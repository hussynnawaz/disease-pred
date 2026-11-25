import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoMedications } from '../data/mockData';

const MED_LOG_KEY = 'hms_med_logs';

export const medicationService = {
  async getMedications() {
    await new Promise((r) => setTimeout(r, 300));
    return demoMedications;
  },

  async getMedicationById(id) {
    await new Promise((r) => setTimeout(r, 200));
    return demoMedications.find((m) => m.id === id) || null;
  },

  async logMedication({ medicationId, status }) {
    const raw = await AsyncStorage.getItem(MED_LOG_KEY);
    const logs = raw ? JSON.parse(raw) : [];
    const entry = { id: `log-${Date.now()}`, medicationId, status, at: new Date().toISOString() };
    logs.unshift(entry);
    await AsyncStorage.setItem(MED_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
    return entry;
  },

  async getMedicationLogs() {
    const raw = await AsyncStorage.getItem(MED_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  },
};