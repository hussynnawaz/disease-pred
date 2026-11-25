import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoHealthRecords } from '../data/mockData';

const RECORDS_KEY = 'hms_records_extra';

export const medicalRecordService = {
  async getRecords() {
    await new Promise((r) => setTimeout(r, 400));
    const extraRaw = await AsyncStorage.getItem(RECORDS_KEY);
    const extra = extraRaw ? JSON.parse(extraRaw) : [];
    return [...extra, ...demoHealthRecords];
  },

  async addRecordMeta(record) {
    const extraRaw = await AsyncStorage.getItem(RECORDS_KEY);
    const extra = extraRaw ? JSON.parse(extraRaw) : [];
    const entry = {
      id: `r-${Date.now()}`,
      title: record.title || 'Uploaded Document',
      category: record.category || 'Other',
      date: new Date().toISOString().slice(0, 10),
      type: record.type || 'PDF',
      summary: 'Pending AI/clinical summary (demo record metadata).',
      doctorNote: '',
    };
    extra.unshift(entry);
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(extra));
    return entry;
  },

  async getAISummary(recordId) {
    await new Promise((r) => setTimeout(r, 900));
    return {
      disclaimer: 'AI-generated summary for demo purposes only. Never invent clinical findings when records are incomplete.',
      importantInfo: [
        'Patient-reported allergies should be verified clinically.',
        'Previous diagnoses listed are from available records only.',
      ],
      previousDiagnoses: ['Seasonal allergic rhinitis (from prior note, sample)'],
      currentMedications: ['Paracetamol 500mg', 'Cetirizine 10mg'],
      allergies: ['Penicillin (reported)', 'Sulfa drugs (reported, if applicable)'],
      labsHighlights: ['CBC: Hemoglobin slightly low (sample)'],
      missingInfo: ['Recent blood pressure readings', 'Last specialist consultation date', 'Family history details'],
    };
  },
};