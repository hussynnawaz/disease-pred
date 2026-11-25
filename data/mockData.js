export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

export const demoUsers = [
  {
    id: 'u-patient-1',
    name: 'Aisha Khan',
    email: 'patient@demo.com',
    password: 'demo123',
    phone: '+92 300 1234567',
    role: ROLES.PATIENT,
  },
  {
    id: 'u-doctor-1',
    name: 'Dr. Hamza Ali',
    email: 'doctor@demo.com',
    password: 'demo123',
    phone: '+92 301 9876543',
    role: ROLES.DOCTOR,
    specialization: 'General Medicine',
    qualifications: 'MBBS, FCPS',
    availability: 'Mon-Fri, 9:00 AM - 2:00 PM',
  },
  {
    id: 'u-admin-1',
    name: 'System Admin',
    email: 'admin@demo.com',
    password: 'demo123',
    phone: '+92 302 5551111',
    role: ROLES.ADMIN,
  },
];

export const symptomsList = [
  'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills',
  'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting',
  'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain', 'anxiety',
  'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy',
  'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes',
  'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin',
  'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain',
  'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
  'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
  'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm',
  'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion',
  'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements',
  'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness',
  'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels',
  'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties',
  'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips', 'slurred_speech',
  'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
  'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
  'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of_urine',
  'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
  'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body',
  'belly_pain', 'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes',
  'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum',
  'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
  'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen',
  'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum',
  'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples',
  'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails',
  'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze',
];

export const demoDiseaseInfo = {
  Fungal_infection: {
    description: 'A common skin condition caused by fungi, often presenting with itching and rash.',
    precautions: ['Keep skin dry', 'Use antifungal creams as advised', 'Avoid sharing personal items'],
    specialty: 'Dermatology',
  },
  Allergy: {
    description: 'An immune response to substances that are usually harmless to most people.',
    precautions: ['Avoid known triggers', 'Keep antihistamines available if prescribed', 'Consult a clinician for severe reactions'],
    specialty: 'Internal Medicine / Allergy',
  },
  GERD: {
    description: 'Gastroesophageal reflux disease causing acid reflux and heartburn symptoms.',
    precautions: ['Avoid spicy/fatty foods', 'Do not lie down after meals', 'Seek medical advice for persistent symptoms'],
    specialty: 'Gastroenterology',
  },
  'Peptic ulcer diseae': {
    description: 'Sores in the stomach or upper intestine lining that may cause abdominal pain.',
    precautions: ['Avoid NSAIDs unless prescribed', 'Limit alcohol', 'Follow clinician guidance'],
    specialty: 'Gastroenterology',
  },
  Diabetes: {
    description: 'A metabolic condition affecting blood sugar regulation.',
    precautions: ['Monitor glucose as advised', 'Follow dietary guidance', 'Seek urgent care for severe symptoms'],
    specialty: 'Endocrinology',
  },
  Migraine: {
    description: 'A neurological condition often involving recurrent headaches and sensitivity.',
    precautions: ['Track triggers', 'Rest in a dark quiet room', 'Consult a clinician for frequent episodes'],
    specialty: 'Neurology',
  },
};

export const demoMedications = [
  {
    id: 'm1',
    name: 'Paracetamol 500mg',
    usage: 'Commonly used for fever and mild to moderate pain relief (sample info).',
    sideEffects: 'Nausea, stomach upset (uncommon), allergic reactions (rare).',
    precautions: 'Do not exceed recommended dose. Avoid alcohol. Consult clinician if liver disease exists.',
    dosageNote: 'Sample prescription note only: e.g., 1 tablet every 6-8 hours if needed (not a prescription).',
    schedule: { time: '08:00', label: 'Morning' },
  },
  {
    id: 'm2',
    name: 'Cetirizine 10mg',
    usage: 'Commonly used for allergy symptoms such as sneezing and runny nose (sample info).',
    sideEffects: 'Drowsiness, dry mouth, fatigue (may vary).',
    precautions: 'Use caution when driving. Consult clinician if pregnant or breastfeeding.',
    dosageNote: 'Sample prescription note only: e.g., 1 tablet at night (not a prescription).',
    schedule: { time: '21:00', label: 'Night' },
  },
  {
    id: 'm3',
    name: 'Omeprazole 20mg',
    usage: 'Commonly used to reduce stomach acid in acid-related conditions (sample info).',
    sideEffects: 'Headache, abdominal pain, nausea (may occur).',
    precautions: 'Inform clinician about long-term use. Not for self-diagnosed emergencies.',
    dosageNote: 'Sample prescription note only: e.g., 1 capsule before breakfast (not a prescription).',
    schedule: { time: '07:30', label: 'Before breakfast' },
  },
];

export const demoAppointments = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Aisha Khan',
    doctorName: 'Dr. Hamza Ali',
    date: '2026-11-26',
    time: '10:30 AM',
    status: 'Upcoming',
    reason: 'Follow-up on symptom assessment',
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'Omar Siddiqui',
    doctorName: 'Dr. Hamza Ali',
    date: '2026-11-26',
    time: '12:00 PM',
    status: 'Upcoming',
    reason: 'Medication review',
  },
  {
    id: 'a3',
    patientId: 'p3',
    patientName: 'Sara Malik',
    doctorName: 'Dr. Hamza Ali',
    date: '2026-11-25',
    time: '3:00 PM',
    status: 'Completed',
    reason: 'General checkup',
  },
];

export const demoPatients = [
  {
    id: 'p1',
    name: 'Aisha Khan',
    age: 28,
    gender: 'Female',
    phone: '+92 300 1234567',
    email: 'aisha.khan@example.com',
    allergies: 'Penicillin (reported)',
    currentMeds: ['Paracetamol 500mg', 'Cetirizine 10mg'],
    history: ['Seasonal allergy', 'Mild gastritis'],
  },
  {
    id: 'p2',
    name: 'Omar Siddiqui',
    age: 35,
    gender: 'Male',
    phone: '+92 333 2221100',
    email: 'omar.s@example.com',
    allergies: 'None reported',
    currentMeds: ['Omeprazole 20mg'],
    history: ['GERD'],
  },
  {
    id: 'p3',
    name: 'Sara Malik',
    age: 41,
    gender: 'Female',
    phone: '+92 321 8887766',
    email: 'sara.m@example.com',
    allergies: 'Sulfa drugs (reported)',
    currentMeds: [],
    history: ['Migraine'],
  },
];

export const demoHealthRecords = [
  {
    id: 'r1',
    title: 'CBC Report',
    category: 'Laboratory Reports',
    date: '2026-11-10',
    type: 'PDF',
    summary: 'Hemoglobin slightly low; WBC within reference range (sample).',
    doctorNote: 'Monitor iron intake and recheck in 4 weeks.',
  },
  {
    id: 'r2',
    title: 'Prescription - Nov 2026',
    category: 'Prescriptions',
    date: '2026-11-05',
    type: 'Image',
    summary: 'Short-term allergy medication advised (sample).',
    doctorNote: 'Avoid known triggers.',
  },
  {
    id: 'r3',
    title: 'Diagnosis Note',
    category: 'Diagnosis History',
    date: '2026-10-20',
    type: 'PDF',
    summary: 'History consistent with seasonal allergic rhinitis (sample).',
    doctorNote: 'Follow-up if symptoms worsen.',
  },
];

export const demoAssessments = [
  {
    id: 'as1',
    date: '2026-11-24',
    symptoms: ['headache', 'nausea', 'sensitivity_to_light'],
    results: [
      { disease: 'Migraine', score: 0.78, description: 'Neurological pattern often involving headache and nausea (demo).', precautions: ['Rest in dark room', 'Track triggers'] },
      { disease: 'Tension headache', score: 0.41, description: 'Common headache type related to stress/tension (demo).', precautions: ['Hydration', 'Stress management'] },
    ],
  },
  {
    id: 'as2',
    date: '2026-11-18',
    symptoms: ['skin_rash', 'itching'],
    results: [
      { disease: 'Fungal_infection', score: 0.72, description: 'Skin condition often associated with itching/rash (demo).', precautions: ['Keep area dry', 'Consult dermatologist'] },
    ],
  },
];