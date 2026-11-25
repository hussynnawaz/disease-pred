import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoUsers } from '../data/mockData';

const AUTH_KEY = 'hms_auth_user';

export const authService = {
  async login(email, password) {
    await new Promise((r) => setTimeout(r, 600));
    const user = demoUsers.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase().trim() && u.password === password
    );
    if (!user) {
      return { ok: false, message: 'Invalid email or password. Try demo accounts from the welcome screen.' };
    }
    const safeUser = { ...user };
    delete safeUser.password;
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    return { ok: true, user: safeUser };
  },

  async register(payload) {
    await new Promise((r) => setTimeout(r, 700));
    const exists = demoUsers.some((u) => u.email.toLowerCase() === String(payload.email).toLowerCase().trim());
    if (exists) {
      return { ok: false, message: 'An account with this email already exists (demo). Try logging in.' };
    }
    const newUser = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return { ok: true, user: newUser };
  },

  async logout() {
    await AsyncStorage.removeItem(AUTH_KEY);
    return { ok: true };
  },

  async getSession() {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};