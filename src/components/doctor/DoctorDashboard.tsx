import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Search, 
  Filter, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Stethoscope,
  Heart,
  ChevronRight,
  TrendingUp,
  Hospital
} from 'lucide-react';
import { PatientProfile, VitalReading, AlertRecord, HealthRiskAnalysis } from '../../types';
import { storageService } from '../../services/storageService';

interface DoctorDashboardProps {
  patients: PatientProfile[];
  selectedPatient: PatientProfile;
  onSelectPatient: (patient: PatientProfile) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAlertModal: (alert: AlertRecord) => void;
  onOpenSimulator: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onNavigateTab,
  onOpenAlertModal,
  onOpenSimulator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'moderate' | 'low'>('all');

  const allAlerts = storageService.getAllAlerts();
  const unacknowledgedAlerts = allAlerts.filter(a => !a.acknowledged);

  // Compute triage metrics
  const totalPatients = patients.length;
  const criticalCount = unacknowledgedAlerts.filter(a => a.severity === 'critical').length;
  const highRiskCount = patients.filter(p => {
    const analysis = storageService.getLatestAiRisk(p.id);
    return analysis.riskLevel === 'high' || analysis.riskLevel === 'critical';
  }).length;

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.medicalHistory.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    if (riskFilter === 'all') return true;
    const analysis = storageService.getLatestAiRisk(p.id);
    return analysis.riskLevel === riskFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Doctor Welcome & Triage Command Bar */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <Hospital className="w-3.5 h-3.5" /> Metropolitan General Hospital • Cardiology Dept
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Lead Clinician: Dr. Evelyn Vance, MD
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Clinical Command Center & Patient Triage</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time multi-patient telemetry feeds, predictive AI arrhythmia risk ranking, and emergency intervention center.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('live_monitoring')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-950 flex items-center gap-2 transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Multi-Patient Live Grid</span>
          </button>
        </div>
      </div>

      {/* Clinical KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-teal-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Monitored Patients</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black font-mono text-white">{totalPatients}</div>
            <div className="text-[11px] text-teal-300 mt-0.5 font-mono">Active Continuous Telemetry</div>
          </div>
        </div>

        <div className={`glass-panel rounded-2xl p-5 border flex flex-col justify-between ${
          criticalCount > 0 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Unacknowledged Alerts</span>
            <div className={`p-2 rounded-xl ${criticalCount > 0 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-900 text-slate-400'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-black font-mono ${criticalCount > 0 ? 'text-rose-400' : 'text-white'}`}>
              {unacknowledgedAlerts.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {criticalCount} Critical • {unacknowledgedAlerts.length - criticalCount} Warnings
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">High/Critical AI Risk</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black font-mono text-purple-300">{highRiskCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Flagged for Clinical Review</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">IoT Sensor Health</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black font-mono text-cyan-300">98.6%</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">BLE Packet Delivery Rate</div>
          </div>
        </div>
      </div>

      {/* Patient Triage Table & Search Filter */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Patient Telemetry Triage Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">Click a patient to inspect individual EHR chart, 3D cardiac model, and waveforms</p>
          </div>

          {/* Search & Risk Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient name, ID, condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400 w-56"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-teal-400 font-mono"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk Only</option>
              <option value="high">High Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Primary Diagnosis</th>
                <th className="py-2.5 px-3">Latest Vitals</th>
                <th className="py-2.5 px-3">AI Risk Score</th>
                <th className="py-2.5 px-3">Alert Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {filteredPatients.map((patient) => {
                const latestVital = storageService.getLatestVital(patient.id);
                const aiRisk = storageService.getLatestAiRisk(patient.id);
                const isSelected = selectedPatient.id === patient.id;
                const patientAlerts = storageService.getAlerts(patient.id);
                const hasCritical = patientAlerts.some(a => a.severity === 'critical' && !a.acknowledged);
                const hasWarning = patientAlerts.some(a => a.severity === 'warning' && !a.acknowledged);

                return (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-teal-950/30' : ''
                    }`}
                  >
                    {/* Patient Column */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        {patient.name}
                        {isSelected && <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono text-[9px]">Active</span>}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {patient.id} • {patient.age}y {patient.gender} • Blood {patient.bloodType}
                      </div>
                    </td>

                    {/* Primary Diagnosis */}
                    <td className="py-3 px-3">
                      <span className="text-slate-300 font-medium">{patient.medicalHistory[0] || 'Under Observation'}</span>
                    </td>

                    {/* Latest Vitals */}
                    <td className="py-3 px-3 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-rose-400 font-bold">{latestVital.heartRate} BPM</span>
                        <span className="text-blue-300">{latestVital.bloodPressureSys}/{latestVital.bloodPressureDia}</span>
                        <span className="text-emerald-300">{latestVital.spo2}% SpO₂</span>
                      </div>
                    </td>

                    {/* AI Risk */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          aiRisk.riskLevel === 'critical' ? 'bg-rose-500 text-white' :
                          aiRisk.riskLevel === 'high' ? 'bg-orange-500 text-white' :
                          aiRisk.riskLevel === 'moderate' ? 'bg-amber-500 text-slate-950' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {aiRisk.riskLevel} ({aiRisk.riskScore}%)
                        </span>
                      </div>
                    </td>

                    {/* Alert Status */}
                    <td className="py-3 px-3">
                      {hasCritical ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500 text-white animate-pulse">
                          CRITICAL ALERT
                        </span>
                      ) : hasWarning ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Warning
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(patient);
                          onNavigateTab('clinical_records');
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-teal-400 text-teal-300 text-xs font-semibold"
                      >
                        Chart →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
