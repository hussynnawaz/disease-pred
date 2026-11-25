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
DESCRIPTION_CSV = BASE_DIR / "symptom_Description.csv"
PRECAUTION_CSV = BASE_DIR / "symptom_precaution.csv"
SEVERITY_CSV = BASE_DIR / "Symptom-severity.csv"

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

# canonical (lowercase, single-underscore) symptom name -> vocabulary entry
_CANONICAL_TO_VOCAB = {}
# canonical disease name -> description / precautions loaded from CSVs
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
    """Load model, artifacts, metrics and CSV files (for descriptions/precautions) at startup."""
    global MODEL, ARTIFACTS, METRICS, MODEL_BACKEND, MODEL_LOADED
    global SYMPTOM_VOCABULARY, SEVERITY_MAP, LABEL_ENCODER
    global _CANONICAL_TO_VOCAB, _CANONICAL_TO_DESC, _CANONICAL_TO_PREC

    missing = [
        p.name
        for p in (MODEL_PATH, ARTIFACTS_PATH, METRICS_PATH, DESCRIPTION_CSV, PRECAUTION_CSV)
        if not p.exists()
    ]
    if missing:
        raise FileNotFoundError(f"Missing required files: {', '.join(missing)}")

    # 1. Trained model (once)
    MODEL, MODEL_BACKEND = _load_keras_model()

    # 2. Training artifacts — authoritative for feature order, severity weights, labels
    ARTIFACTS = joblib.load(ARTIFACTS_PATH)
    SYMPTOM_VOCABULARY = list(ARTIFACTS["symptom_vocabulary"])
    SEVERITY_MAP = dict(ARTIFACTS["severity_map"])
    LABEL_ENCODER = ARTIFACTS["label_encoder"]

    # 3. Model metrics
    with open(METRICS_PATH, "r", encoding="utf-8") as f:
        METRICS = json.load(f)

    # 4. Symptom vocabulary lookup
    _CANONICAL_TO_VOCAB = {_canonical(v): v for v in SYMPTOM_VOCABULARY}

    # 5. Load disease descriptions directly from CSV (authoritative for UI text)
    _CANONICAL_TO_DESC = {}
    desc_df = pd.read_csv(DESCRIPTION_CSV)
    for _, row in desc_df.iterrows():
        disease = str(row["Disease"]).strip()
        desc = str(row["Description"]).strip()
        _CANONICAL_TO_DESC[_canonical(disease)] = desc

    # 6. Load disease precautions directly from CSV (authoritative for UI text)
    _CANONICAL_TO_PREC = {}
    prec_df = pd.read_csv(PRECAUTION_CSV)
    for _, row in prec_df.iterrows():
        disease = str(row["Disease"]).strip()
        precs = []
        for col in prec_df.columns[1:]:
            val = row.get(col)
            if pd.notna(val):
                s = str(val).strip()
                if s:
                    precs.append(s)
        _CANONICAL_TO_PREC[_canonical(disease)] = precs

    # Also fold in any descriptions/precautions from artifacts for label-encoder classes
    # that might differ in spelling but share the same canonical key (e.g. hemmorhoids).
    for cls in LABEL_ENCODER.classes_:
        key = _canonical(cls)
        if key not in _CANONICAL_TO_DESC:
            # try close match
            close = difflib.get_close_matches(key, _CANONICAL_TO_DESC.keys(), n=1, cutoff=0.6)
            if close:
                _CANONICAL_TO_DESC[key] = _CANONICAL_TO_DESC[close[0]]
        if key not in _CANONICAL_TO_PREC:
            close = difflib.get_close_matches(key, _CANONICAL_TO_PREC.keys(), n=1, cutoff=0.6)
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


@app.route("/api/chat", methods=["POST"])
def chat():
    """Minimal guidance chatbot (not a clinician)."""
    payload = request.get_json(silent=True) or {}
    text = str(payload.get("message", "") or "").lower().strip()
    if not text:
        return jsonify({
            "reply": "Please type a message. I can share general guidance, but I cannot diagnose or prescribe.",
            "disclaimer": DISCLAIMER,
        })

    # Keyword-based guidance (keeps it safe and simple)
    if any(k in text for k in ["headache and nausea", "nausea and headache"]):
        reply = ("Headache with nausea can have many causes (migraine, dehydration, infection, etc.). "
                 "Rest in a quiet/dark space if helpful, stay hydrated, and avoid triggers. "
                 "Seek urgent care for sudden severe headache, confusion, fainting, stiff neck, fever, vision changes, or weakness. "
                 "Use the Symptom Checker with at least 3 symptoms for a preliminary model-based overview (not a diagnosis).")
    elif any(k in text for k in ["headache", "head pain", "migraine"]):
        reply = ("For headaches: rest, hydration, limit screen strain, and note triggers. "
                 "Seek urgent care for sudden severe headache, confusion, fainting, vision changes, "
                 "or weakness. This is general guidance, not a diagnosis.")
    elif any(k in text for k in ["fever", "temperature", "hot", "chills"]):
        reply = ("For fever/chills: monitor temperature, stay hydrated, rest. Seek urgent care if very high, "
                 "persistent, or with breathing difficulty, chest pain, confusion, or severe pain.")
    elif any(k in text for k in ["fatigue", "tired", "exhausted", "weakness", "weak"]):
        reply = ("Fatigue/weakness can have many causes (sleep, stress, illness, dehydration, anemia, etc.). "
                 "Rest, hydrate, eat balanced meals, and track other symptoms (fever, weight change, pain). "
                 "If fatigue is severe, sudden, worsening, or comes with chest pain/breathing issues/fainting, seek medical care promptly. "
                 "For a preliminary check based on multiple symptoms, use the Symptom Checker in this app (not a diagnosis).")
    elif any(k in text for k in ["nausea", "vomit", "throwing up"]):
        reply = ("For nausea/vomiting: sip fluids, eat bland foods if tolerated, and rest. Seek care for dehydration, "
                 "blood in vomit, severe abdominal pain, high fever, or symptoms lasting more than a day or two.")
    elif any(k in text for k in ["stomach", "abdominal", "belly", "acidity", "heartburn"]):
        reply = ("For stomach/abdominal discomfort: note timing, triggers, and associated symptoms. Avoid spicy/fatty foods if they worsen symptoms. "
                 "Seek urgent care for severe pain, vomiting blood, black stools, fever, or a rigid abdomen.")
    elif any(k in text for k in ["cough", "cold", "sneeze", "runny nose", "congestion"]):
        reply = ("For cold/cough symptoms: rest, fluids, and humidified air may help. Seek care if you have trouble breathing, "
                 "chest pain, high/persistent fever, or symptoms worsening after initial improvement.")
    elif any(k in text for k in ["rash", "itch", "itching", "skin"]):
        reply = ("For rash/itching: avoid scratching, keep the area clean and dry, and watch for spreading, pain, fever, or pus. "
                 "A clinician or dermatologist can advise safely, especially if widespread or severe.")
    elif any(k in text for k in ["medicine", "medication", "dosage", "pill", "tablet", "drug"]):
        reply = ("I cannot provide personalized dosing or tell you if a medicine is safe for you. "
                 "Always follow the label and consult a pharmacist or clinician. Use the Medications "
                 "section for sample reference info only (not prescriptions).")
    elif any(k in text for k in ["pain", "ache"]):
        reply = ("Pain can come from many causes. Note location, severity, duration, and triggers. "
                 "Use general self-care only if mild and known cause; seek care for severe, sudden, or unexplained pain "
                 "(especially chest, head, abdomen, or after injury).")
    elif any(k in text for k in ["anxiety", "stress", "worried"]):
        reply = ("For stress/anxiety: try grounding/breathing exercises, sleep, movement, and reducing caffeine if helpful. "
                 "If anxiety is overwhelming, persistent, or affecting daily life, consider speaking with a healthcare or mental health professional.")
    elif any(k in text for k in ["hunger", "hungry", "appetite", "eating", "not eating"]):
        reply = ("Changes in hunger/appetite can happen with stress, sleep changes, illness, or medications. "
                 "Try regular meals/snacks, hydration, and note other symptoms (weight change, nausea, fatigue). "
                 "If appetite loss or excessive hunger is persistent, unexplained, or paired with worrying symptoms, consider speaking with a clinician. "
                 "For a symptom-based overview, you can use the Symptom Checker (select 3+ symptoms).")
    else:
        reply = (
            "I’m here to offer general health guidance and help you use this app (Symptom Checker, Health Records, Medications). "
            "I can’t diagnose or prescribe. For urgent or severe symptoms, seek immediate care. "
            "Tell me what you’re experiencing (e.g. headache, nausea, fatigue, fever, belly pain, cough, rash) and I’ll give general next steps, "
            "or use the Symptom Checker (3+ symptoms) for a preliminary AI overview."
        )

    return jsonify({"reply": reply, "disclaimer": DISCLAIMER})


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
    if len(normalized) < 3:
        return jsonify({
            "error": "Please provide at least 3 symptoms for a more reliable assessment (the model is trained on 3–17 symptoms per case).",
            "symptom_count": len(normalized),
        }), 400

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
