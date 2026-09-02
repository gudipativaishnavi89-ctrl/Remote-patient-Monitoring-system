import { PatientProfile, DoctorProfile, IoTDevice, VitalReading, AlertRecord, HealthRiskAnalysis } from '../types';

export const DEMO_DOCTOR: DoctorProfile = {
  id: 'DOC-8842',
  name: 'Dr. Evelyn Vance, MD, FACC',
  title: 'Chief of Tele-Cardiology & Remote Patient Monitoring',
  department: 'Cardiovascular Remote Care Center',
  hospital: 'Metropolitan General Hospital',
  licenseNumber: 'MD-NY-748920',
  email: 'evelyn.vance@metrohealth.demo',
};

export const DEMO_PATIENTS: PatientProfile[] = [
  {
    id: 'PT-10024',
    name: 'Sarah Jenkins',
    age: 58,
    gender: 'Female',
    dob: '1968-04-12',
    bloodType: 'A+',
    email: 'sarah.jenkins@patient.demo',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, New York, NY 10001',
    emergencyContact: {
      name: 'Michael Jenkins',
      relationship: 'Spouse',
      phone: '+1 (555) 890-1234',
      isPrimary: true,
    },
    primaryDoctor: {
      name: 'Dr. Evelyn Vance, MD',
      id: 'DOC-8842',
      specialty: 'Cardiovascular Medicine',
      hospital: 'Metropolitan General Hospital',
      contact: '+1 (555) 900-4400',
    },
    medicalHistory: [
      'Hypertension (Stage 2) - Diagnosed 2018',
      'Mild Congestive Heart Failure (NYHA Class II)',
      'Dyslipidemia - Managed via statins',
      'Post-PCI Stenting (LAD) - Oct 2023',
    ],
    allergies: [
      {
        id: 'ALG-1',
        allergen: 'Penicillin',
        reaction: 'Urticaria & Anaphylactoid Rash',
        severity: 'severe',
        recordedDate: '2019-02-10',
      },
      {
        id: 'ALG-2',
        allergen: 'Iodinated Radiocontrast Agents',
        reaction: 'Mild Bronchospasm',
        severity: 'moderate',
        recordedDate: '2023-10-14',
      },
    ],
    currentMedications: [
      {
        id: 'MED-1',
        name: 'Lisinopril',
        dosage: '20 mg',
        frequency: 'Once Daily (Morning)',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2023-11-01',
        instructions: 'Take with full glass of water. Monitor for dizziness.',
        status: 'active',
      },
      {
        id: 'MED-2',
        name: 'Metoprolol Succinate ER',
        dosage: '50 mg',
        frequency: 'Once Daily',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2023-10-20',
        instructions: 'Do not crush or chew. Take with morning meal.',
        status: 'active',
      },
      {
        id: 'MED-3',
        name: 'Atorvastatin',
        dosage: '40 mg',
        frequency: 'Once Daily (Bedtime)',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2021-06-15',
        instructions: 'Take at bedtime.',
        status: 'active',
      },
      {
        id: 'MED-4',
        name: 'Aspirin (Enteric Coated)',
        dosage: '81 mg',
        frequency: 'Once Daily',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2023-10-15',
        instructions: 'Antiplatelet therapy.',
        status: 'active',
      },
    ],
    clinicalRecords: [
      {
        id: 'CR-901',
        patientId: 'PT-10024',
        date: '2026-08-28',
        type: 'Clinical Note',
        title: 'RPM Telehealth Bi-Weekly Review',
        doctorName: 'Dr. Evelyn Vance, MD',
        facility: 'Metropolitan General Hospital Tele-RPM Hub',
        content: 'Patient reports good exercise tolerance. Blood pressure readings stabilized following Lisinopril titration. Home SpO2 consistently >97%. No peripheral edema reported.',
      },
      {
        id: 'CR-902',
        patientId: 'PT-10024',
        date: '2026-08-10',
        type: 'Lab Result',
        title: 'Comprehensive Metabolic Panel & Lipid Panel',
        doctorName: 'Dr. Marcus Reid (Pathology)',
        facility: 'Metro Central Labs',
        content: 'eGFR: 78 mL/min/1.73m², Serum Creatinine: 0.92 mg/dL, Potassium: 4.4 mEq/L (Normal), LDL: 68 mg/dL (At target < 70).',
      },
      {
        id: 'CR-903',
        patientId: 'PT-10024',
        date: '2026-06-14',
        type: 'Diagnosis',
        title: 'Echocardiogram (TTE) Assessment',
        doctorName: 'Dr. Evelyn Vance, MD',
        facility: 'Cardiology Imaging Suite',
        content: 'Left ventricular ejection fraction (LVEF) 52%. Mild concentric LV hypertrophy. No regional wall motion abnormalities.',
      },
    ],
    assignedDevices: ['DEV-HR-01', 'DEV-BP-02', 'DEV-OX-03', 'DEV-TP-04'],
    baselineVitals: {
      targetHeartRate: [60, 85],
      targetBPSys: [110, 130],
      targetBPDia: [70, 85],
      targetSpO2: 95,
      targetTemp: [36.2, 37.3],
    },
  },
  {
    id: 'PT-10025',
    name: 'Robert Henderson',
    age: 71,
    gender: 'Male',
    dob: '1955-09-03',
    bloodType: 'O-',
    email: 'robert.henderson@patient.demo',
    phone: '+1 (555) 345-6789',
    address: '120 Ocean View Blvd, San Francisco, CA 94122',
    emergencyContact: {
      name: 'Clara Henderson',
      relationship: 'Daughter',
      phone: '+1 (555) 991-2300',
      isPrimary: true,
    },
    primaryDoctor: {
      name: 'Dr. Evelyn Vance, MD',
      id: 'DOC-8842',
      specialty: 'Cardiovascular Medicine',
      hospital: 'Metropolitan General Hospital',
      contact: '+1 (555) 900-4400',
    },
    medicalHistory: [
      'Chronic Obstructive Pulmonary Disease (COPD Stage III)',
      'Atrial Fibrillation (Paroxysmal)',
      'Type 2 Diabetes Mellitus',
    ],
    allergies: [
      {
        id: 'ALG-3',
        allergen: 'Sulfa Drugs',
        reaction: 'Severe skin rash',
        severity: 'severe',
        recordedDate: '2015-04-12',
      },
    ],
    currentMedications: [
      {
        id: 'MED-5',
        name: 'Apixaban (Eliquis)',
        dosage: '5 mg',
        frequency: 'Twice Daily',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2022-03-01',
        instructions: 'Anticoagulant for AFib. Take exactly 12 hours apart.',
        status: 'active',
      },
      {
        id: 'MED-6',
        name: 'Tiotropium Bromide (Spiriva)',
        dosage: '18 mcg',
        frequency: 'Inhale Once Daily',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2020-01-10',
        instructions: 'Maintenance bronchodilator.',
        status: 'active',
      },
    ],
    clinicalRecords: [
      {
        id: 'CR-904',
        patientId: 'PT-10025',
        date: '2026-08-30',
        type: 'Clinical Note',
        title: 'COPD & AFib Risk Review',
        doctorName: 'Dr. Evelyn Vance, MD',
        facility: 'Metro RPM Center',
        content: 'Patient monitored closely for SpO2 desaturation episodes. SpO2 has dipped occasionally to 91% during sleep. Supplemental low-flow oxygen prescribed for nocturnal use.',
      },
    ],
    assignedDevices: ['DEV-HR-05', 'DEV-OX-06', 'DEV-BP-07'],
    baselineVitals: {
      targetHeartRate: [65, 95],
      targetBPSys: [115, 138],
      targetBPDia: [72, 88],
      targetSpO2: 92,
      targetTemp: [36.0, 37.2],
    },
  },
  {
    id: 'PT-10026',
    name: 'Eleanor Davis',
    age: 64,
    gender: 'Female',
    dob: '1962-11-20',
    bloodType: 'B+',
    email: 'eleanor.davis@patient.demo',
    phone: '+1 (555) 456-7890',
    address: '45 Pine Needle Lane, Seattle, WA 98101',
    emergencyContact: {
      name: 'Thomas Davis',
      relationship: 'Son',
      phone: '+1 (555) 777-8899',
      isPrimary: true,
    },
    primaryDoctor: {
      name: 'Dr. Evelyn Vance, MD',
      id: 'DOC-8842',
      specialty: 'Cardiovascular Medicine',
      hospital: 'Metropolitan General Hospital',
      contact: '+1 (555) 900-4400',
    },
    medicalHistory: [
      'Heart Failure with Preserved Ejection Fraction (HFpEF)',
      'Essential Hypertension',
      'Chronic Kidney Disease Stage 3a',
    ],
    allergies: [],
    currentMedications: [
      {
        id: 'MED-7',
        name: 'Sacubitril/Valsartan (Entresto)',
        dosage: '24/26 mg',
        frequency: 'Twice Daily',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2024-02-15',
        instructions: 'Take morning and evening.',
        status: 'active',
      },
      {
        id: 'MED-8',
        name: 'Furosemide',
        dosage: '20 mg',
        frequency: 'Once Daily (Morning)',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2024-03-01',
        instructions: 'Take in morning to prevent nighttime diuresis.',
        status: 'active',
      },
    ],
    clinicalRecords: [
      {
        id: 'CR-905',
        patientId: 'PT-10026',
        date: '2026-08-25',
        type: 'Clinical Note',
        title: 'Weight & Fluid Monitoring',
        doctorName: 'Dr. Evelyn Vance, MD',
        facility: 'Metro Tele-Heart Clinic',
        content: 'Fluid balance stable. Daily weight logs show no rapid gain. Patient instructed to maintain low-sodium diet (<1500mg/day).',
      },
    ],
    assignedDevices: ['DEV-HR-08', 'DEV-BP-09', 'DEV-TP-10'],
    baselineVitals: {
      targetHeartRate: [58, 80],
      targetBPSys: [110, 128],
      targetBPDia: [68, 80],
      targetSpO2: 96,
      targetTemp: [36.4, 37.2],
    },
  },
  {
    id: 'PT-10027',
    name: 'Marcus Chen',
    age: 42,
    gender: 'Male',
    dob: '1984-07-15',
    bloodType: 'O+',
    email: 'marcus.chen@patient.demo',
    phone: '+1 (555) 678-9012',
    address: '88 Tech Boulevard, Austin, TX 78701',
    emergencyContact: {
      name: 'Lily Chen',
      relationship: 'Sister',
      phone: '+1 (555) 443-2211',
      isPrimary: true,
    },
    primaryDoctor: {
      name: 'Dr. Evelyn Vance, MD',
      id: 'DOC-8842',
      specialty: 'Cardiovascular Medicine',
      hospital: 'Metropolitan General Hospital',
      contact: '+1 (555) 900-4400',
    },
    medicalHistory: [
      'Post-Myocarditis Recovery (Viral)',
      'Sinus Tachycardia Episodes',
      'Mild Anxiety-Induced Palpitations',
    ],
    allergies: [],
    currentMedications: [
      {
        id: 'MED-9',
        name: 'Propranolol',
        dosage: '10 mg',
        frequency: 'As needed (PRN)',
        prescribedBy: 'Dr. Evelyn Vance',
        startDate: '2025-01-10',
        instructions: 'Take 1 tablet for acute palpitations or tremor.',
        status: 'active',
      },
    ],
    clinicalRecords: [
      {
        id: 'CR-906',
        patientId: 'PT-10027',
        date: '2026-08-15',
        type: 'Clinical Note',
        title: 'Myocarditis Follow-up',
        doctorName: 'Dr. Evelyn Vance, MD',
        facility: 'Metro Heart Institute',
        content: 'Troponin levels returned to baseline. Continuous ECG patch shows gradual reduction in PVCs. Patient cleared for light cardio exercise.',
      },
    ],
    assignedDevices: ['DEV-HR-11', 'DEV-OX-12'],
    baselineVitals: {
      targetHeartRate: [60, 90],
      targetBPSys: [110, 125],
      targetBPDia: [70, 82],
      targetSpO2: 97,
      targetTemp: [36.5, 37.2],
    },
  },
];

export const INITIAL_IOT_DEVICES: IoTDevice[] = [
  {
    id: 'DEV-HR-01',
    name: 'CardioBeat Pro ECG Chest Sensor',
    type: 'heart_rate',
    model: 'MedTech CB-400X 3D Biometric',
    macAddress: 'C4:8E:22:91:FA:01',
    connected: true,
    batteryLevel: 92,
    lastSync: 'Just now',
    latestReading: '72 BPM (Sinus Rhythm)',
    status: 'active',
    signalStrength: -48,
  },
  {
    id: 'DEV-BP-02',
    name: 'PrecisionPressure Wireless Cuff',
    type: 'blood_pressure',
    model: 'OmniCuff Pro Dual-Chamber v4',
    macAddress: 'A8:3B:56:11:09:82',
    connected: true,
    batteryLevel: 84,
    lastSync: '3 mins ago',
    latestReading: '120/80 mmHg',
    status: 'active',
    signalStrength: -55,
  },
  {
    id: 'DEV-OX-03',
    name: 'OxySpectra 3D Optical Pulse Oximeter',
    type: 'pulse_oximeter',
    model: 'SpectraMed SpO2 Max 4K',
    macAddress: 'F2:99:A1:74:33:BC',
    connected: true,
    batteryLevel: 78,
    lastSync: 'Just now',
    latestReading: '98% SpO₂ (Perfusion Index 4.2)',
    status: 'active',
    signalStrength: -42,
  },
  {
    id: 'DEV-TP-04',
    name: 'ThermoContinuous Core Sensor Patch',
    type: 'temperature',
    model: 'DermaTherm Bio-Array 2.0',
    macAddress: '10:C3:5B:78:E0:44',
    connected: true,
    batteryLevel: 95,
    lastSync: '1 min ago',
    latestReading: '36.6 °C (Normothermic)',
    status: 'active',
    signalStrength: -50,
  },
];

// Generate 30 days of realistic demo historical readings for patient PT-10024
export function generateHistoricalVitalData(patientId: string): VitalReading[] {
  const readings: VitalReading[] = [];
  const now = new Date();
  
  // 30 days, 3 readings per day
  for (let d = 30; d >= 0; d--) {
    const times = [8, 14, 20]; // 8 AM, 2 PM, 8 PM
    for (const hour of times) {
      const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      date.setHours(hour, Math.floor(Math.random() * 50), 0, 0);

      // Normal base with mild realistic variance
      let hr = Math.round(68 + Math.sin(d * 0.4 + hour) * 8 + (Math.random() * 6 - 3));
      let sys = Math.round(118 + Math.sin(d * 0.3) * 6 + (Math.random() * 8 - 4));
      let dia = Math.round(78 + Math.sin(d * 0.3) * 4 + (Math.random() * 6 - 3));
      let spo2 = Math.round(97 + (Math.random() > 0.8 ? 1 : 0) + (Math.random() > 0.9 ? -1 : 0));
      let temp = Number((36.5 + Math.sin(d * 0.2) * 0.2 + (Math.random() * 0.3 - 0.15)).toFixed(1));
      let resp = Math.round(14 + Math.random() * 3);

      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (sys > 135 || hr > 88 || spo2 < 95) {
        status = 'warning';
      }

      readings.push({
        id: `VR-${patientId}-${date.getTime()}`,
        patientId,
        timestamp: date.toISOString(),
        heartRate: hr,
        bloodPressureSys: sys,
        bloodPressureDia: dia,
        spo2,
        temperature: temp,
        respiratoryRate: resp,
        status,
        synced: true,
      });
    }
  }

  return readings;
}

export const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 'ALT-101',
    patientId: 'PT-10025',
    patientName: 'Robert Henderson',
    timestamp: '2026-09-02T06:45:00.000Z',
    severity: 'warning',
    vitalType: 'spo2',
    value: '91% SpO₂',
    threshold: '< 92%',
    message: 'Transient nocturnal hypoxemia episode detected during sleep cycle.',
    acknowledgedByDoctor: false,
    emergencyDispatched: false,
    contactsNotified: false,
  },
  {
    id: 'ALT-102',
    patientId: 'PT-10026',
    patientName: 'Eleanor Davis',
    timestamp: '2026-09-01T18:20:00.000Z',
    severity: 'warning',
    vitalType: 'bloodPressure',
    value: '138/88 mmHg',
    threshold: '> 135/85 mmHg',
    message: 'Elevated systolic pressure post-evening activity. Normalized in subsequent scan.',
    acknowledgedByDoctor: true,
    acknowledgedAt: '2026-09-01T19:00:00.000Z',
    doctorNotes: 'Advised patient to avoid excessive dietary sodium at dinner.',
    emergencyDispatched: false,
    contactsNotified: true,
  },
];

export const INITIAL_AI_RISK: Record<string, HealthRiskAnalysis> = {
  'PT-10024': {
    patientId: 'PT-10024',
    timestamp: new Date().toISOString(),
    calculatedAt: new Date().toISOString(),
    riskScore: 18,
    riskLevel: 'low',
    confidenceScore: 96,
    explanation: 'Continuous telemetry shows balanced cardiovascular indicators with no acute ectopic pace.',
    recommendations: [
      'Maintain daily prescribed medication schedule (Lisinopril & Metoprolol)',
      'Continue routine 3x daily IoT synchronized check-ins',
      'Follow-up teleconsultation scheduled in 14 days',
    ],
    potentialRisks: ['Minimal immediate acute cardiovascular risk.'],
    primaryFactors: [
      'Heart rate consistently in normal sinus range (68 - 76 BPM)',
      'Blood pressure well controlled on current ACE-inhibitor regimen',
      'Stable peripheral oxygenation at 98%',
      'Normothermic 24-hour continuous baseline',
    ],
    summary: 'Current vital signs are within the configured safe monitoring range. No acute arrhythmia or hemodynamic decompensation indicated.',
    triageRecommendations: [
      'Maintain daily prescribed medication schedule (Lisinopril & Metoprolol)',
      'Continue routine 3x daily IoT synchronized check-ins',
      'Follow-up teleconsultation scheduled in 14 days',
    ],
    trendAnalysis: {
      heartRateTrend: 'stable',
      bpTrend: 'stable',
      spo2Trend: 'stable',
      temperatureTrend: 'stable',
    },
    aiModelVersion: 'BioRisk-Gemini-Medical-v4.2',
  },
  'PT-10025': {
    patientId: 'PT-10025',
    timestamp: new Date().toISOString(),
    calculatedAt: new Date().toISOString(),
    riskScore: 64,
    riskLevel: 'moderate',
    confidenceScore: 91,
    explanation: 'Nocturnal SpO2 desaturations correlated with episodic sinus rate fluctuations.',
    recommendations: [
      'Verify supplemental low-flow oxygen cannula fit for sleep',
      'Review anticoagulation adherence (Apixaban)',
      'Doctor notified for virtual telemetry review',
    ],
    potentialRisks: ['Nocturnal hypoxemia and atrial flutter recurrence.'],
    primaryFactors: [
      'Mild nocturnal SpO2 dip detected (91%)',
      'Elevated resting heart rate variability during AFib flutter',
      'Underlying COPD stage III baseline',
    ],
    summary: 'Moderate hemodynamic & respiratory instability observed. Nocturnal desaturation warrants continuous pulse oximetry monitoring.',
    triageRecommendations: [
      'Verify supplemental low-flow oxygen cannula fit for sleep',
      'Review anticoagulation adherence (Apixaban)',
      'Doctor notified for virtual telemetry review',
    ],
    trendAnalysis: {
      heartRateTrend: 'erratic',
      bpTrend: 'stable',
      spo2Trend: 'declining',
      temperatureTrend: 'stable',
    },
    aiModelVersion: 'BioRisk-Gemini-Medical-v4.2',
  },
};
