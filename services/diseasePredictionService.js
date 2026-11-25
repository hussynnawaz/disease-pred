import { demoDiseaseInfo } from '../data/mockData';

// Mock prediction service. In production, this will call a backend API that uses the trained model.
// Expected API shape (for future):
// { predictions: [{ disease, score, description, precautions }] }

function simpleScore(symptoms) {
  const text = symptoms.join(' ').toLowerCase();
  const results = [];
  if (text.includes('rash') || text.includes('itch')) {
    results.push({
      disease: 'Fungal_infection',
      score: 0.74,
      description: demoDiseaseInfo.Fungal_infection?.description || 'Skin-related condition (demo).',
      precautions: demoDiseaseInfo.Fungal_infection?.precautions || [],
    });
  }
  if (text.includes('headache') || text.includes('nausea') || text.includes('sensitivity')) {
    results.push({
      disease: 'Migraine',
      score: 0.71,
      description: demoDiseaseInfo.Migraine?.description || 'Neurological condition (demo).',
      precautions: demoDiseaseInfo.Migraine?.precautions || [],
    });
  }
  if (text.includes('acidity') || text.includes('stomach') || text.includes('burn')) {
    results.push({
      disease: 'GERD',
      score: 0.68,
      description: demoDiseaseInfo.GERD?.description || 'Digestive condition (demo).',
      precautions: demoDiseaseInfo.GERD?.precautions || [],
    });
  }
  if (results.length === 0) {
    results.push({
      disease: 'General consultation recommended',
      score: 0.45,
      description: 'Symptoms are non-specific in this demo. A clinician should review your case.',
      precautions: ['Monitor symptoms', 'Seek care if symptoms worsen or persist'],
    });
  }
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => ({ ...r, score: Math.round(r.score * 100) / 100 }));
}

export const diseasePredictionService = {
  async predict({ symptoms = [], duration = '', severity = '', notes = '' }) {
    await new Promise((r) => setTimeout(r, 1400));
    if (!symptoms || symptoms.length === 0) {
      throw new Error('Please select at least one symptom.');
    }
    const predictions = simpleScore(symptoms);
    const specialtyMap = {
      Fungal_infection: 'Dermatology',
      Migraine: 'Neurology',
      GERD: 'Gastroenterology',
      Diabetes: 'Endocrinology',
      Allergy: 'Internal Medicine / Allergy',
      'General consultation recommended': 'General Practice',
    };
    return {
      disclaimer: 'Preliminary AI-generated information only. This is not a confirmed diagnosis. Please consult a qualified healthcare professional.',
      modelNote: 'Model scores reflect demo inference logic, not clinically validated diagnostic confidence.',
      inputs: { symptoms, duration, severity, notes },
      recommendedSpecialty: specialtyMap[predictions[0].disease] || 'General Practice',
      predictions,
      generatedAt: new Date().toISOString(),
    };
  },
};