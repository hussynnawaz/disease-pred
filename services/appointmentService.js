import { demoAppointments } from '../data/mockData';

export const appointmentService = {
  async getAppointments() {
    await new Promise((r) => setTimeout(r, 350));
    return demoAppointments;
  },
  async getAppointmentById(id) {
    await new Promise((r) => setTimeout(r, 200));
    return demoAppointments.find((a) => a.id === id) || null;
  },
  async updateStatus(id, status) {
    await new Promise((r) => setTimeout(r, 300));
    return { ok: true, id, status };
  },
};