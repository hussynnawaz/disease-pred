import { API_BASE_URL } from '../constants/api';

export const symptomService = {
  async getSymptoms(query = '') {
    const res = await fetch(`${API_BASE_URL}/api/symptoms`);
    if (!res.ok) throw new Error('Failed to load symptoms from server.');
    const data = await res.json();
    const all = (data.symptoms || []).map((s) => s.symptom);
    const q = String(query).toLowerCase().trim().replace(/_/g, ' ');
    if (!q) return all.slice(0, 80);
    return all.filter((s) => s.toLowerCase().replace(/_/g, ' ').includes(q)).slice(0, 80);
  },

  async getAllSymptoms() {
    const res = await fetch(`${API_BASE_URL}/api/symptoms`);
    if (!res.ok) throw new Error('Failed to load symptoms from server.');
    const data = await res.json();
    return (data.symptoms || []).map((s) => s.symptom);
  },
};