import React from 'react';
import { 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Maximize2,
  Clock,
  Radio
} from 'lucide-react';
import { PatientProfile, VitalReading } from '../../types';
import { storageService } from '../../services/storageService';
import { ECGWaveform } from '../charts/ECGWaveform';

interface DoctorLiveMonitoringProps {
  patients: PatientProfile[];
  onSelectPatient: (patient: PatientProfile) => void;
  onOpenAlertModal: (alert: any) => void;
}

export const DoctorLiveMonitoring: React.FC<DoctorLiveMonitoringProps> = ({
  patients,
  onSelectPatient,
  onOpenAlertModal,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-teal-400" /> Multi-Patient Telemetry Broadcast
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Real-Time Sub-Second Ingestion
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Multi-Patient Live ECG & Biometric Stream Grid</h2>
          <p className="text-xs text-slate-300 mt-1">
            Simultaneous multi-patient telemetry matrix with active arrhythmia auto-detection and high-contrast waveforms.
          </p>
        </div>
      </div>

      {/* Multi-patient Live Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patients.map((patient) => {
          const latestVital = storageService.getLatestVital(patient.id);
          const aiRisk = storageService.getLatestAiRisk(patient.id);
          const alerts = storageService.getAlerts(patient.id);
          const criticalAlert = alerts.find(a => a.severity === 'critical' && !a.acknowledged);

          const isCrit = latestVital.status === 'critical' || !!criticalAlert;
          const isWarn = latestVital.status === 'warning';

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`glass-panel rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isCrit
                  ? 'border-rose-500/60 bg-rose-950/20 ring-1 ring-rose-500/40 shadow-xl shadow-rose-950/80'
                  : isWarn
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-slate-800 hover:border-teal-500/50'
              }`}
            >
              <div>
                {/* Patient Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{patient.name}</h3>
                      <span className="text-xs text-slate-400 font-mono">({patient.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {patient.age}y {patient.gender} • <span className="text-slate-300 font-medium">{patient.medicalHistory[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      isCrit ? 'bg-rose-500 text-white animate-pulse' :
                      isWarn ? 'bg-amber-500 text-slate-950' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {latestVital.status}
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-500 hover:text-white" />
                  </div>
                </div>

                {/* 4 Vitals Badges */}
                <div className="grid grid-cols-4 gap-2 my-3 font-mono text-center">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">HR</span>
                    <span className="text-sm font-bold text-rose-400">{latestVital.heartRate}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">BP</span>
                    <span className="text-xs font-bold text-blue-300">{latestVital.bloodPressureSys}/{latestVital.bloodPressureDia}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SpO₂</span>
                    <span className="text-sm font-bold text-emerald-300">{latestVital.spo2}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Temp</span>
                    <span className="text-sm font-bold text-amber-300">{latestVital.temperature}°</span>
                  </div>
                </div>

                {/* Real-Time Live Waveform Component */}
                <div className="my-2 rounded-2xl overflow-hidden border border-slate-800">
                  <ECGWaveform
                    bpm={latestVital.heartRate}
                    status={latestVital.status}
                    className="p-3"
                  />
                </div>
              </div>

              {/* Bottom Quick Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  AI Risk: <strong className="text-purple-300">{aiRisk.riskScore}% ({aiRisk.riskLevel})</strong>
                </span>

                <span className="text-teal-400 hover:underline font-semibold flex items-center gap-1">
                  Open Patient Chart →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
