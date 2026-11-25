const cannedResponses = [
  {
    keywords: ['headache', 'head pain'],
    reply: 'For headaches, common self-care includes rest, hydration, and reducing screen strain. If headaches are severe, sudden, frequent, or paired with vision changes/fainting, seek medical care promptly. (Demo response)',
  },
  {
    keywords: ['fever'],
    reply: 'Fever can have many causes. Monitor temperature, stay hydrated, and rest. Seek urgent care if very high, persistent, or accompanied by breathing difficulty, confusion, or severe pain. (Demo response)',
  },
  {
    keywords: ['medicine', 'medication', 'dosage'],
    reply: 'I cannot provide safe dosing for you personally. Please check medication labels and consult a pharmacist/clinician. Use the Medications section for sample reference info only. (Demo response)',
  },
];

export const chatbotService = {
  async sendMessage(text) {
    await new Promise((r) => setTimeout(r, 900));
    const lower = String(text || '').toLowerCase();
    const match = cannedResponses.find((c) => c.keywords.some((k) => lower.includes(k)));
    if (match) return match.reply;
    return 'Thanks for your message. This is a demo medical assistant (not a real clinician). For urgent symptoms, seek immediate care. For general guidance, try asking about symptoms, appointments, or medication info (general only).';
  },
};