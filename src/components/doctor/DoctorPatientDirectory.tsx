import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  Activity, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  ShieldCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { PatientProfile } from '../../types';
import { storageService } from '../../services/storageService';

interface DoctorPatientDirectoryProps {
  patients: PatientProfile[];
  selectedPatient: PatientProfile;
  onSelectPatient: (patient: PatientProfile) => void;
  onNavigateTab: (tab: string) => void;
}

export const DoctorPatientDirectory: React.FC<DoctorPatientDirectoryProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.medicalHistory.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Department Registry
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {patients.length} Active Patients Registered
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Patient Registry & Clinical Roster</h2>
          <p className="text-xs text-slate-300 mt-1">
            Search patient records, examine diagnoses, active prescriptions, sensor telemetry history, and emergency contacts.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patient, ID, condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const latestVital = storageService.getLatestVital(patient.id);
          const aiRisk = storageService.getLatestAiRisk(patient.id);
          const isSelected = selectedPatient.id === patient.id;

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`glass-panel rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-500/60 bg-teal-950/20 ring-1 ring-teal-500/40 shadow-xl shadow-teal-950'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{patient.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {patient.id} • {patient.age}y {patient.gender}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    aiRisk.riskLevel === 'critical' ? 'bg-rose-500 text-white' :
                    aiRisk.riskLevel === 'high' ? 'bg-orange-500 text-white' :
                    aiRisk.riskLevel === 'moderate' ? 'bg-amber-500 text-slate-950' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {aiRisk.riskLevel}
                  </span>
                </div>

                {/* Clinical Snapshot */}
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Medical History:</span>
                    <span className="font-medium text-slate-200">{patient.medicalHistory.join(', ')}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Latest Vitals</span>
                      <span>{new Date(latestVital.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-rose-400">{latestVital.heartRate} BPM</span>
                      <span className="text-blue-300">{latestVital.bloodPressureSys}/{latestVital.bloodPressureDia}</span>
                      <span className="text-emerald-300">{latestVital.spo2}% SpO₂</span>
                      <span className="text-amber-300">{latestVital.temperature}°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPatient(patient);
                    onNavigateTab('clinical_records');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-400 text-teal-300 text-xs font-semibold transition-colors"
                >
                  Clinical Chart
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPatient(patient);
                    onNavigateTab('reports');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-200 text-xs font-semibold transition-colors"
                >
                  Export Report →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
