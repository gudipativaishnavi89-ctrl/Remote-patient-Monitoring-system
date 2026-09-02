export type UserRole = 'patient' | 'doctor' | 'guest';

export type VitalStatus = 'normal' | 'warning' | 'critical';

export type RiskLevel = 'low' | 'normal' | 'moderate' | 'high' | 'critical';

export interface VitalReading {
  id: string;
  patientId: string;
  timestamp: string; // ISO string
  heartRate: number; // BPM
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  spo2: number; // %
  temperature: number; // °C
  respiratoryRate: number; // rpm
  status: VitalStatus;
  synced: boolean;
  notes?: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'heart_rate' | 'blood_pressure' | 'pulse_oximeter' | 'temperature' | 'multisensor';
  model: string;
  macAddress: string;
  connected: boolean;
  batteryLevel: number; // 0 - 100
  lastSync: string;
  latestReading: string;
  status: 'active' | 'standby' | 'disconnected' | 'low_battery';
  signalStrength: number; // -30 to -90 dBm
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'Diagnosis' | 'Lab Result' | 'Clinical Note' | 'Discharge Summary' | 'Prescription';
  title: string;
  doctorName: string;
  facility: string;
  content: string;
  attachments?: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  status: 'active' | 'completed' | 'paused';
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  recordedDate: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodType: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: EmergencyContact;
  primaryDoctor: {
    name: string;
    id: string;
    specialty: string;
    hospital: string;
    contact: string;
  };
  medicalHistory: string[];
  allergies: Allergy[];
  currentMedications: Medication[];
  clinicalRecords: ClinicalRecord[];
  assignedDevices: string[];
  baselineVitals: {
    targetHeartRate: [number, number];
    targetBPSys: [number, number];
    targetBPDia: [number, number];
    targetSpO2: number;
    targetTemp: [number, number];
  };
}

export interface HealthRiskAnalysis {
  patientId: string;
  timestamp: string;
  calculatedAt?: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryFactors: string[];
  summary: string;
  confidenceScore: number;
  explanation: string;
  recommendations: string[];
  potentialRisks: string[];
  triageRecommendations?: string[];
  trendAnalysis?: {
    heartRateTrend: 'stable' | 'increasing' | 'decreasing' | 'erratic';
    bpTrend: 'stable' | 'elevated' | 'critical';
    spo2Trend: 'stable' | 'declining';
    temperatureTrend: 'stable' | 'febrile';
  };
  aiModelVersion?: string;
}

export interface AlertRecord {
  id: string;
  patientId: string;
  patientName?: string;
  timestamp: string;
  severity: 'warning' | 'critical';
  vitalType: 'heartRate' | 'bloodPressure' | 'spo2' | 'temperature' | 'composite';
  value: string;
  threshold: string;
  message: string;
  acknowledged?: boolean;
  acknowledgedBy?: string;
  acknowledgedByDoctor?: boolean;
  acknowledgedAt?: string;
  doctorNotes?: string;
  emergencyDispatched?: boolean;
  contactsNotified?: boolean;
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  hospital: string;
  licenseNumber: string;
  email: string;
  avatarUrl?: string;
}

export interface SyncStatusState {
  isOnline: boolean;
  pendingSyncCount: number;
  pendingCount?: number;
  lastSyncTimestamp: string;
  lastSyncTime?: string;
  isSyncing: boolean;
  syncHistoryCount: number;
}

export type SyncStatus = SyncStatusState;
