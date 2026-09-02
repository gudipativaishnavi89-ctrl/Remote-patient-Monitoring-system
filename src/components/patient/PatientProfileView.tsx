import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Stethoscope, 
  ShieldCheck, 
  Edit3, 
  Save, 
  CheckCircle2,
  Calendar,
  Activity
} from 'lucide-react';
import { PatientProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface PatientProfileViewProps {
  patient: PatientProfile;
  onPatientUpdated: (patient: PatientProfile) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  onPatientUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(patient.name);
  const [phone, setPhone] = useState(patient.phone);
  const [address, setAddress] = useState(patient.address);
  const [emergencyName, setEmergencyName] = useState(patient.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(patient.emergencyContact.phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientProfile = {
      ...patient,
      name,
      phone,
      address,
      emergencyContact: {
        ...patient.emergencyContact,
        name: emergencyName,
        phone: emergencyPhone,
      },
    };
    storageService.savePatient(updated);
    onPatientUpdated(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-cyan-950">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {patient.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Enrolled in Continuous Telemetry
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-0.5">{patient.name}</h2>
            <p className="text-xs text-slate-300">
              {patient.age} yrs • {patient.gender} • Blood Type: <strong className="text-rose-400 font-mono">{patient.bloodType}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Demographics'}</span>
        </button>
      </div>

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 border border-cyan-500/30 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Update Patient Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Residential Address (For 911 EMS Dispatch)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-950 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* View Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact & Demographics */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Contact & Residential Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-white">{patient.email}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold text-white">{patient.phone}</span>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                <span className="text-slate-400">Address:</span>
                <span className="font-semibold text-white">{patient.address}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Date of Birth:</span>
                <span className="font-mono text-white">{patient.dob}</span>
              </div>
            </div>

            {/* Emergency Contact Block */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Primary Emergency Contact
              </div>
              <div className="text-xs text-white font-semibold">
                {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                {patient.emergencyContact.phone}
              </div>
            </div>
          </div>

          {/* Assigned Healthcare Team & Baseline Targets */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>Primary Care Physician & Clinic</span>
              </h3>

              <div className="mt-3 space-y-2 text-xs">
                <div className="text-sm font-bold text-teal-300">{patient.primaryDoctor.name}</div>
                <div className="text-slate-300">{patient.primaryDoctor.specialty}</div>
                <div className="text-slate-400">{patient.primaryDoctor.hospital}</div>
                <div className="text-cyan-400 font-mono text-xs">{patient.primaryDoctor.contact}</div>
              </div>

              {/* Baseline Vital Targets */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" /> Calibrated Baseline Thresholds
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Target HR:</span>
                    <span className="text-white font-bold">{patient.baselineVitals.targetHeartRate[0]} - {patient.baselineVitals.targetHeartRate[1]} BPM</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Target BP:</span>
                    <span className="text-white font-bold">&lt; 130/80 mmHg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Target SpO₂:</span>
                    <span className="text-white font-bold">≥ {patient.baselineVitals.targetSpO2}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Target Temp:</span>
                    <span className="text-white font-bold">{patient.baselineVitals.targetTemp[0]} - {patient.baselineVitals.targetTemp[1]} °C</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Identity verified & tied to cryptographic medical token ID.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
