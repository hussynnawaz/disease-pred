import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_KEY = 'hms_pending_sync';
const SYNC_HISTORY_KEY = 'hms_sync_history';

export const offlineSyncService = {
  async getPendingCount() {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return arr.length;
  },
  async addPending(item) {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ ...item, queuedAt: new Date().toISOString(), id: `pending-${Date.now()}` });
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(arr));
    return arr.length;
  },
  async retrySync() {
    await new Promise((r) => setTimeout(r, 1200));
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const historyRaw = await AsyncStorage.getItem(SYNC_HISTORY_KEY);
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    const record = {
      id: `sync-${Date.now()}`,
      at: new Date().toISOString(),
      attempted: arr.length,
      synced: arr.length,
      note: 'Demo sync completed locally (no server).',
    };
    history.unshift(record);
    await AsyncStorage.setItem(SYNC_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify([]));
    return { ok: true, record };
  },
  async getHistory() {
    const raw = await AsyncStorage.getItem(SYNC_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  },
};