import { API_BASE_URL } from '../constants/api';

const specialtyMap = {
  Fungal_infection: 'Dermatology',
  Migraine: 'Neurology',
  GERD: 'Gastroenterology',
  Diabetes: 'Endocrinology',
  Allergy: 'Internal Medicine / Allergy',
  'Paralysis (brain hemorrhage)': 'Neurology',
  'Peptic ulcer diseae': 'Gastroenterology',
};

export const diseasePredictionService = {
  async predict({ symptoms = [], duration = '', severity = '', notes = '' }) {
    if (!symptoms || symptoms.length === 0) {
      throw new Error('Please select at least one symptom.');
    }
    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    // API returns score as percentage (0-100). UI expects fraction-like display with *100, so convert.
    const predictions = (data.predictions || []).map((p) => ({
      disease: p.disease,
      score: (typeof p.score === 'number' ? p.score : 0) / 100,
      description: p.description || '',
      precautions: p.precautions || [],
    }));
    return {
      disclaimer: data.disclaimer || 'Preliminary AI-generated information only. This is not a confirmed diagnosis.',
      modelNote: data.score_note || 'Model score is a relative output of the trained model, not clinically validated diagnostic confidence.',
      inputWarning: data.input_warning || null,
      inputs: { symptoms: data.selected_symptoms || symptoms, duration, severity, notes },
      recommendedSpecialty: specialtyMap[predictions[0]?.disease] || 'General Practice',
      predictions,
      generatedAt: new Date().toISOString(),
    };
  },
};