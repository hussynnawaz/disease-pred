import { API_BASE_URL } from '../constants/api';

export const chatbotService = {
  async sendMessage(text) {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `Request failed (${res.status})`);
    }
    return data.reply || 'No response received.';
  },
};