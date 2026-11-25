"""
Minimal Flask backend for the AI Disease Prediction model.

Loads the trained .keras model and joblib artifacts ONCE at startup —
model + artifacts only (no CSV files are read or used), then exposes
four JSON endpoints:
    GET  /api/health
    GET  /api/symptoms
    POST /api/predict
    GET  /api/metrics

Model predictions are preliminary AI-generated information only.
"""

import difflib
import json
import os
import re
import warnings
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

warnings.filterwarnings("ignore")

# --------------------------------------------------------------------------
# Paths (all files live next to this script in backend/)
# --------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "health_monitoring_model.keras"
ARTIFACTS_PATH = BASE_DIR / "health_monitoring_artifacts.pkl"
METRICS_PATH = BASE_DIR / "model_metrics.json"

DISCLAIMER = (
    "AI-generated preliminary information. Not a medical diagnosis. "
    "Consult a qualified healthcare professional."
)

# --------------------------------------------------------------------------
# Model loading (once, at startup)
# --------------------------------------------------------------------------
MODEL = None
ARTIFACTS = None
METRICS = {}
MODEL_BACKEND = None
MODEL_LOADED = False

SYMPTOM_VOCABULARY = []          # authoritative 131-feature ordering
SEVERITY_MAP = {}                # symptom -> severity weight
LABEL_ENCODER = None             # sklearn LabelEncoder (41 classes)
DESCRIPTION_MAP = {}             # disease -> description
PRECAUTION_MAP = {}              # disease -> [precautions]

# canonical (lowercase, single-underscore) symptom name -> vocabulary entry
_CANONICAL_TO_VOCAB = {}
# canonical disease name -> description / precautions (from artifacts only)
_CANONICAL_TO_DESC = {}
_CANONICAL_TO_PREC = {}


def _canonical(text: str) -> str:
    """Lowercase, trim, and collapse whitespace/underscores to one underscore."""
    return re.sub(r"[\s_]+", "_", str(text).strip().lower()).strip("_")


def _load_keras_model():
    """Prefer TensorFlow/Keras; fall back to standalone Keras (JAX/Torch)."""
    try:
        import tensorflow as tf  # noqa: F401

        return tf.keras.models.load_model(MODEL_PATH), "tensorflow"
    except Exception:
        # Standalone Keras fallback (TensorFlow has no wheels for this Python).
        os.environ.setdefault("KERAS_BACKEND", "jax")
        import keras

        return keras.saving.load_model(str(MODEL_PATH)), keras.backend.backend()


def load_all():
    """Load model, artifacts and metrics exactly once (no CSVs)."""
    global MODEL, ARTIFACTS, METRICS, MODEL_BACKEND, MODEL_LOADED
    global SYMPTOM_VOCABULARY, SEVERITY_MAP, LABEL_ENCODER
    global DESCRIPTION_MAP, PRECAUTION_MAP
    global _CANONICAL_TO_VOCAB, _CANONICAL_TO_DESC, _CANONICAL_TO_PREC

    missing = [
        p.name
        for p in (MODEL_PATH, ARTIFACTS_PATH, METRICS_PATH)
        if not p.exists()
    ]
    if missing:
        raise FileNotFoundError(f"Missing required files: {', '.join(missing)}")

    # 1. Trained model (once)
    MODEL, MODEL_BACKEND = _load_keras_model()

    # 2. Training artifacts — the single source of truth for
    #    feature order, severity weights, labels, descriptions, precautions
    ARTIFACTS = joblib.load(ARTIFACTS_PATH)
    SYMPTOM_VOCABULARY = list(ARTIFACTS["symptom_vocabulary"])
    SEVERITY_MAP = dict(ARTIFACTS["severity_map"])
    LABEL_ENCODER = ARTIFACTS["label_encoder"]
    DESCRIPTION_MAP = dict(ARTIFACTS["description_map"])
    PRECAUTION_MAP = dict(ARTIFACTS["precaution_map"])

    # 3. Model metrics
    with open(METRICS_PATH, "r", encoding="utf-8") as f:
        METRICS = json.load(f)

    # 4. Lookup indexes (built from artifacts only)
    _CANONICAL_TO_VOCAB = {_canonical(v): v for v in SYMPTOM_VOCABULARY}
    _CANONICAL_TO_DESC = {_canonical(k): str(v) for k, v in DESCRIPTION_MAP.items()}
    _CANONICAL_TO_PREC = {_canonical(k): list(v) for k, v in PRECAUTION_MAP.items()}

    # The notebook's label encoder contains one misspelled class
    # ("hemmorhoids" vs "hemorrhoids") — bridge such cases by close match.
    for cls in LABEL_ENCODER.classes_:
        key = _canonical(cls)
        if key not in _CANONICAL_TO_DESC:
            close = difflib.get_close_matches(key, _CANONICAL_TO_DESC.keys(), n=1)
            if close:
                _CANONICAL_TO_DESC[key] = _CANONICAL_TO_DESC[close[0]]
        if key not in _CANONICAL_TO_PREC:
            close = difflib.get_close_matches(key, _CANONICAL_TO_PREC.keys(), n=1)
            if close:
                _CANONICAL_TO_PREC[key] = _CANONICAL_TO_PREC[close[0]]

    MODEL_LOADED = True


load_all()

# --------------------------------------------------------------------------
# Feature construction (mirrors the training notebook exactly)
# --------------------------------------------------------------------------
def build_feature_vector(selected_symptoms):
    """
    Build the same 131-feature input vector used during training.

    - Columns and their ORDER come from the trained symptom vocabulary.
    - Every feature starts at 0.0.
    - Selected symptoms are set to their original severity weight.
    """
    row = {symptom: 0.0 for symptom in SYMPTOM_VOCABULARY}
    for symptom in selected_symptoms:
        if symptom not in row:
            continue
        weight = SEVERITY_MAP.get(symptom)
        if weight is None:
            # vocabulary entries contain a few stray spaces
            weight = SEVERITY_MAP.get(symptom.replace(" ", ""), 1)
        row[symptom] = float(weight)

    # Exactly the training column order — do not reorder.
    return pd.DataFrame([row], columns=SYMPTOM_VOCABULARY)


def normalize_symptoms(raw_list):
    """Lowercase, trim, collapse separators, dedupe (order preserved)."""
    normalized, seen = [], set()
    for item in raw_list:
        if not isinstance(item, str):
            continue
        cleaned = _canonical(item)
        if not cleaned or cleaned in seen:
            continue
        seen.add(cleaned)
        normalized.append(cleaned)
    return normalized


def resolve_symptom(cleaned_name):
    """Map a normalized input name to the exact vocabulary entry (or None)."""
    return _CANONICAL_TO_VOCAB.get(cleaned_name)


def get_description(disease):
    return _CANONICAL_TO_DESC.get(_canonical(disease), "")


def get_precautions(disease):
    return _CANONICAL_TO_PREC.get(_canonical(disease), [])


# Training rows contain 3-17 symptoms (mean ~7). Very sparse inputs are
# out-of-distribution for the model and produce diffuse, unreliable scores.
_MIN_SYMPTOMS = 3


def _input_warning(count):
    if count < _MIN_SYMPTOMS:
        return (
            f"Only {count} symptom(s) selected. The model was trained on "
            "combinations of 3-17 symptoms, so results for very few symptoms "
            "are unreliable and may appear unrelated. Select more symptoms "
            "for a more meaningful preliminary assessment."
        )
    return None


# --------------------------------------------------------------------------
# Flask app
# --------------------------------------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.errorhandler(Exception)
def handle_error(error):
    return jsonify({"error": "Internal server error", "detail": str(error)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "model_backend": MODEL_BACKEND,
        "symptoms_count": len(SYMPTOM_VOCABULARY),
        "disease_classes": int(len(LABEL_ENCODER.classes_)),
        "feature_count": len(SYMPTOM_VOCABULARY),
        "metrics": METRICS,
    })


@app.route("/api/symptoms", methods=["GET"])
def symptoms():
    items = []
    for name in SYMPTOM_VOCABULARY:
        weight = SEVERITY_MAP.get(name)
        if weight is None:
            weight = SEVERITY_MAP.get(name.replace(" ", ""), None)
        items.append({
            "symptom": name,
            "label": name.replace("_", " "),
            "severity_weight": weight,
        })
    return jsonify({"count": len(items), "symptoms": items})


@app.route("/api/metrics", methods=["GET"])
def metrics():
    return jsonify(METRICS)


@app.route("/api/predict", methods=["POST"])
def predict():
    if not MODEL_LOADED:
        return jsonify({"error": "Model is not loaded"}), 503

    payload = request.get_json(silent=True)
    if payload is None or "symptoms" not in payload:
        return jsonify({"error": "Request body must be JSON with a 'symptoms' list"}), 400

    raw_symptoms = payload.get("symptoms")
    if not isinstance(raw_symptoms, list):
        return jsonify({"error": "'symptoms' must be a list of strings"}), 400

    normalized = normalize_symptoms(raw_symptoms)
    if not normalized:
        return jsonify({"error": "Please provide at least one symptom"}), 400

    resolved = []
    unknown = []
    for name in normalized:
        entry = resolve_symptom(name)
        if entry is None:
            unknown.append(name)
        elif entry not in resolved:
            resolved.append(entry)

    if not resolved:
        return jsonify({
            "error": "No valid symptoms provided",
            "unknown_symptoms": unknown,
            "hint": "Check GET /api/symptoms for valid names",
        }), 400
    if unknown:
        return jsonify({
            "error": "Unknown symptoms provided",
            "unknown_symptoms": unknown,
            "hint": "Check GET /api/symptoms for valid names",
        }), 400

    try:
        # Same columns, same order, same severity weighting as training.
        features = build_feature_vector(resolved)
        probabilities = MODEL.predict(features.to_numpy(dtype=np.float32), verbose=0)[0]

        top_idx = np.argsort(probabilities)[::-1][:3]
        classes = LABEL_ENCODER.classes_

        predictions = []
        for idx in top_idx:
            disease = str(classes[idx])
            predictions.append({
                "disease": disease,
                "score": round(float(probabilities[idx]) * 100.0, 2),
                "description": get_description(disease),
                "precautions": get_precautions(disease),
            })
    except Exception as exc:
        return jsonify({"error": "Prediction failed", "detail": str(exc)}), 500

    return jsonify({
        "predictions": predictions,
        "selected_symptoms": resolved,
        "symptom_count": len(resolved),
        "input_warning": _input_warning(len(resolved)),
        "score_note": (
            "Model score is a relative output of the trained model, "
            "not clinically validated diagnostic confidence."
        ),
        "disclaimer": DISCLAIMER,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
