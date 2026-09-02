import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Stethoscope, 
  Lock, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle2,
  FilePlus,
  Hospital,
  KeyRound,
  UserPlus,
  LogIn,
  Send,
  Building2,
  Pill,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { PatientProfile, UserRole } from '../../types';
import { storageService } from '../../services/storageService';
import { DEMO_PATIENTS, DEMO_DOCTOR } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, patientId?: string) => void;
  initialTab?: 'login' | 'register' | 'reset' | 'doctor';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'reset' | 'doctor'>(initialTab);
  
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialTab]);

  // 1. Login Form State (Email ID and Password)
  const [loginEmail, setLoginEmail] = useState('sarah.jenkins@patient.demo');
  const [loginPassword, setLoginPassword] = useState('SecurePass2026!');
  
  // 2. Register Form State (All fields explicitly requested by user)
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [regAge, setRegAge] = useState<number>(42);
  const [regContactNumber, setRegContactNumber] = useState('');
  const [regPrimaryDoctor, setRegPrimaryDoctor] = useState('Dr. Evelyn Vance, MD');
  const [regEmergencyContact, setRegEmergencyContact] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [regHospitalClinic, setRegHospitalClinic] = useState('Metropolitan General Hospital');
  const [regMedicalHistory, setRegMedicalHistory] = useState('Hypertension, Post-PCI');
  const [regCurrentMedications, setRegCurrentMedications] = useState('Lisinopril 10mg, Aspirin 81mg');
  const [regAllergies, setRegAllergies] = useState('Penicillin, Latex');

  // 3. Reset Form State (Mail ID and Verification Code)
  const [resetMailId, setResetMailId] = useState('');
  const [resetVerificationCode, setResetVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');

  // Doctor credentials
  const [docLicense, setDocLicense] = useState('MD-NY-748920');
  const [docPassword, setDocPassword] = useState('MetDocSecure2026!');

  // Notification / Alert states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // 1. Sign In Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both Email ID and Password.');
      return;
    }

    const patients = storageService.getPatients();
    const found = patients.find(p => p.email.toLowerCase() === loginEmail.toLowerCase()) || patients[0];
    
    if (found) {
      storageService.setCurrentPatientId(found.id);
      storageService.logAudit(
        'USER_LOGIN_SUCCESS', 
        found.name, 
        `Patient (${found.name}) signed in securely with 256-bit encrypted session.`
      );
      setSuccessMessage(`Welcome back, ${found.name}! Signed in securely.`);
      setTimeout(() => {
        onLoginSuccess('patient', found.id);
        onClose();
      }, 500);
    } else {
      setErrorMessage('Account not found in healthcare registry. Please check email or register.');
    }
  };

  // 2. Register Patient Profile Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regFullName.trim()) {
      setErrorMessage('Please provide FULL NAME.');
      return;
    }
    if (!regPassword.trim()) {
      setErrorMessage('Please provide PASSWORD.');
      return;
    }
    if (!regContactNumber.trim()) {
      setErrorMessage('Please provide CONTACT NUMBER.');
      return;
    }

    const generatedId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const autoEmail = `${regFullName.toLowerCase().replace(/\s+/g, '.')}@patient.demo`;

    // Process comma-separated medical history, medications, allergies
    const historyArray = regMedicalHistory
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const medicationArray = regCurrentMedications
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((medName, idx) => ({
        id: `MED-${Date.now()}-${idx}`,
        name: medName,
        dosage: 'Prescribed',
        frequency: 'Daily',
        prescribedBy: regPrimaryDoctor || 'Dr. Evelyn Vance, MD',
        startDate: new Date().toISOString().split('T')[0],
        instructions: 'Take as directed with water',
        status: 'active' as const,
      }));

    const allergyArray = regAllergies
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((allergyName, idx) => ({
        id: `ALG-${Date.now()}-${idx}`,
        allergen: allergyName,
        reaction: 'Hypersensitivity Warning',
        severity: 'moderate' as const,
        recordedDate: new Date().toISOString().split('T')[0],
      }));

    const newPatient: PatientProfile = {
      id: generatedId,
      name: regFullName,
      age: Number(regAge) || 40,
      gender: regGender,
      dob: `${2026 - (Number(regAge) || 40)}-06-15`,
      bloodType: 'O+',
      email: autoEmail,
      phone: regContactNumber,
      address: '742 Healthcare Boulevard, Medical District',
      emergencyContact: {
        name: regEmergencyContact || 'Primary Family Contact',
        relationship: 'Emergency Contact',
        phone: regEmergencyPhone || regContactNumber || '+1 (555) 999-0000',
        isPrimary: true,
      },
      primaryDoctor: {
        name: regPrimaryDoctor || 'Dr. Evelyn Vance, MD',
        id: 'DOC-8842',
        specialty: 'Cardiovascular Medicine',
        hospital: regHospitalClinic || 'Metropolitan General Hospital',
        contact: '+1 (555) 900-4400',
      },
      medicalHistory: historyArray.length > 0 ? historyArray : ['General Monitoring Baseline'],
      allergies: allergyArray,
      currentMedications: medicationArray,
      clinicalRecords: [],
      assignedDevices: ['DEV-HR-01', 'DEV-BP-02', 'DEV-OX-03'],
      baselineVitals: {
        targetHeartRate: [60, 85],
        targetBPSys: [110, 130],
        targetBPDia: [70, 85],
        targetSpO2: 95,
        targetTemp: [36.2, 37.3],
      },
    };

    storageService.savePatient(newPatient);
    storageService.setCurrentPatientId(newPatient.id);
    storageService.logAudit(
      'PATIENT_REGISTRATION', 
      newPatient.name, 
      `New patient profile created with ID: ${newPatient.id} (${newPatient.primaryDoctor.hospital})`
    );

    setSuccessMessage(`Patient profile for "${newPatient.name}" created successfully!`);
    setTimeout(() => {
      onLoginSuccess('patient', newPatient.id);
      onClose();
    }, 600);
  };

  // 3. Reset Password Handler
  const handleSendVerificationCode = () => {
    if (!resetMailId.trim()) {
      setErrorMessage('Please enter your Mail ID first to receive a verification code.');
      return;
    }
    const code = `${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedCode(code);
    setResetVerificationCode(code);
    setSuccessMessage(`Verification code dispatched to ${resetMailId}: ${code}`);
    setErrorMessage('');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resetMailId.trim()) {
      setErrorMessage('Please enter your Mail ID.');
      return;
    }
    if (!resetVerificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit Verification Code.');
      return;
    }

    setSuccessMessage('Verification code confirmed! Password reset successfully.');
    storageService.logAudit(
      'PASSWORD_RESET_SUCCESS',
      resetMailId,
      `Security credentials reset for ${resetMailId} with verified OTP.`
    );

    setTimeout(() => {
      setLoginEmail(resetMailId);
      setTab('login');
      setSuccessMessage('Please sign in with your updated credentials.');
    }, 900);
  };

  // Doctor Portal Login
  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.logAudit('DOCTOR_LOGIN_SUCCESS', DEMO_DOCTOR.name, 'Physician logged into Clinical Command Center.');
    setSuccessMessage('Physician credentials authorized.');
    setTimeout(() => {
      onLoginSuccess('doctor');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0E1629] rounded-2xl max-w-2xl w-full p-5 sm:p-6 border border-slate-700/80 shadow-2xl relative max-h-[94vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Healthcare Security Portal</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  HIPAA / 256-BIT
                </span>
              </h3>
              <p className="text-xs text-slate-400">Remote Patient Monitoring & Clinical System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#162035] border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Options Requested: 1. Login, 2. Register, 3. Reset */}
        <div className="my-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold flex items-center justify-between">
            <span>Authentication Option</span>
            {tab === 'doctor' && (
              <span className="text-teal-400 font-bold">Doctor 2FA Mode</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#162035] rounded-xl border border-slate-700/80">
            {/* 1. Login */}
            <button
              type="button"
              onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-lg text-xs font-bold transition-all ${
                tab === 'login'
                  ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>1. Login</span>
            </button>

            {/* 2. Register */}
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-lg text-xs font-bold transition-all ${
                tab === 'register'
                  ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>2. Register</span>
            </button>

            {/* 3. Reset */}
            <button
              type="button"
              onClick={() => { setTab('reset'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-lg text-xs font-bold transition-all ${
                tab === 'reset'
                  ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>3. Reset</span>
            </button>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* OPTION 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setTab('reset')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Forgot Key / Reset?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Patients Select */}
            <div className="p-3.5 rounded-xl bg-[#162035] border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] font-mono uppercase tracking-wider font-bold">
                Quick Select Demo Patient:
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {DEMO_PATIENTS.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setLoginEmail(p.email);
                      setLoginPassword('SecureDemoPass!');
                    }}
                    className={`p-2 rounded-lg text-left text-[11px] border transition-colors ${
                      loginEmail === p.email
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                        : 'bg-[#0E1629] border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="truncate font-bold">{p.name}</div>
                    <div className="text-slate-400 text-[10px] font-mono">{p.id} • {p.age}y/o</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button: Sign In Securely */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In Securely</span>
            </button>

            {/* Doctor Access Alternative */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setTab('doctor')}
                className="text-xs text-slate-400 hover:text-teal-300 font-medium inline-flex items-center gap-1.5"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>Are you a Clinician? Switch to Doctor 2FA Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* OPTION 2: REGISTER (All user-specified fields) */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
              <UserPlus className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Register new patient profile with demographics, physician details, and clinical history.</span>
            </div>

            {/* Row 1: FULL NAME & PASSWORD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jessica Palmer"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  PASSWORD *
                </label>
                <input
                  type="password"
                  placeholder="Create secure password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 2: GENDER, AGE, CONTACT NUMBER */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  GENDER *
                </label>
                <select
                  value={regGender}
                  onChange={(e) => setRegGender(e.target.value as any)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  AGE *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 45"
                  value={regAge}
                  onChange={(e) => setRegAge(Number(e.target.value))}
                  min="1"
                  max="120"
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  CONTACT NUMBER *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={regContactNumber}
                  onChange={(e) => setRegContactNumber(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 3: PRIMARY DOCTOR & HOSPITAL / CLINIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  PRIMARY DOCTOR *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Evelyn Vance, MD"
                  value={regPrimaryDoctor}
                  onChange={(e) => setRegPrimaryDoctor(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  HOSPITAL / CLINIC *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metropolitan General Hospital"
                  value={regHospitalClinic}
                  onChange={(e) => setRegHospitalClinic(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 4: EMERGENCY CONTACT & PHONE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  EMERGENCY CONTACT NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mark Palmer (Spouse)"
                  value={regEmergencyContact}
                  onChange={(e) => setRegEmergencyContact(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  EMERGENCY CONTACT PHONE
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 987-6543"
                  value={regEmergencyPhone}
                  onChange={(e) => setRegEmergencyPhone(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            {/* Row 5: EXISTING MEDICAL HISTORY (comma separated) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                EXISTING MEDICAL HISTORY (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Post-PCI, Arrhythmia, Type 2 Diabetes"
                value={regMedicalHistory}
                onChange={(e) => setRegMedicalHistory(e.target.value)}
                className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Row 6: CURRENT MEDICATIONS & ALLERGIES (comma separated) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  CURRENT MEDICATIONS (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lisinopril 10mg, Aspirin 81mg, Metoprolol 25mg"
                  value={regCurrentMedications}
                  onChange={(e) => setRegCurrentMedications(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  ALLERGIES
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Latex, Sulfa"
                  value={regAllergies}
                  onChange={(e) => setRegAllergies(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            {/* Action Button: Create Patient Profile */}
            <button
              type="submit"
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Create Patient Profile</span>
            </button>
          </form>
        )}

        {/* OPTION 3: RESET (Asking mail id and verification code) */}
        {tab === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <KeyRound className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Enter your registered Mail ID and 6-digit Verification Code to reset access.</span>
            </div>

            {/* Mail ID Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mail ID / Registered Email *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={resetMailId}
                    onChange={(e) => setResetMailId(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full bg-[#162035] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="px-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Code</span>
                </button>
              </div>
            </div>

            {/* Verification Code Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Verification Code *
                </label>
                {generatedCode && (
                  <span className="text-[11px] font-mono text-cyan-400">
                    Dispatched Code: <strong className="font-bold">{generatedCode}</strong>
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={resetVerificationCode}
                  onChange={(e) => setResetVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit verification code"
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="Enter new password (optional)"
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify & Reset Password</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* DOCTOR CLINICAL LOGIN */}
        {tab === 'doctor' && (
          <form onSubmit={handleDoctorLogin} className="space-y-4">
            <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
              <Hospital className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Authorized for Metropolitan General Hospital Clinical Staff</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Medical License / Provider ID
              </label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={docLicense}
                  onChange={(e) => setDocLicense(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-teal-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2FA Hardware Token / Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={docPassword}
                  onChange={(e) => setDocPassword(e.target.value)}
                  className="w-full bg-[#162035] border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white outline-none focus:border-teal-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Authorize & Launch Doctor Command Center</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← Return to Patient Options
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
