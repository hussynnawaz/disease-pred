import { symptomsList, demoDiseaseInfo } from '../data/mockData';

export const symptomService = {
  async getSymptoms(query = '') {
    await new Promise((r) => setTimeout(r, 200));
    const q = String(query).toLowerCase().trim();
    if (!q) return symptomsList.slice(0, 80);
    return symptomsList.filter((s) => s.toLowerCase().replace(/_/g, ' ').includes(q.replace(/_/g, ' '))).slice(0, 80);
  },

  async getAllSymptoms() {
    await new Promise((r) => setTimeout(r, 150));
    return symptomsList;
  },
};