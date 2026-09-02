import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  TrendingUp, 
  History, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Download
} from 'lucide-react';
import { PatientProfile, VitalReading } from '../../types';
import { ECGWaveform } from '../charts/ECGWaveform';
import { VitalTrendChart } from '../charts/VitalTrendChart';

interface VitalsViewProps {
  patient: PatientProfile;
  latestVital: VitalReading;
  vitalsHistory: VitalReading[];
  onOpenSimulator: () => void;
}

export const VitalsView: React.FC<VitalsViewProps> = ({
  patient,
  latestVital,
  vitalsHistory,
  onOpenSimulator,
}) => {
  const [selectedVitalTab, setSelectedVitalTab] = useState<'heartRate' | 'bloodPressure' | 'spo2' | 'temperature'>('heartRate');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Biometric Telemetry Stream
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Last Sync: {new Date(latestVital.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Real-Time Vitals & Historical Trends</h2>
          <p className="text-xs text-slate-300 mt-1">
            Continuous calibrated multi-sensor feeds with dynamic 12-lead rhythm analysis and longitudinal trend projections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSimulator}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950"
          >
            <Zap className="w-4 h-4" />
            <span>Simulate Sensor Spike</span>
          </button>
        </div>
      </div>

      {/* Live ECG Rhythm Strip */}
      <ECGWaveform
        bpm={latestVital.heartRate}
        status={latestVital.status}
        className="h-auto"
      />

      {/* Vital Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'heartRate' as const, label: 'Heart Rate', val: `${latestVital.heartRate} BPM`, icon: Heart, color: 'text-rose-400' },
          { id: 'bloodPressure' as const, label: 'Blood Pressure', val: `${latestVital.bloodPressureSys}/${latestVital.bloodPressureDia} mmHg`, icon: Activity, color: 'text-blue-400' },
          { id: 'spo2' as const, label: 'Oxygen (SpO₂)', val: `${latestVital.spo2}%`, icon: Wind, color: 'text-emerald-400' },
          { id: 'temperature' as const, label: 'Body Temp', val: `${latestVital.temperature} °C`, icon: Thermometer, color: 'text-amber-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedVitalTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedVitalTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-cyan-950/70 border-cyan-500/60 shadow-lg shadow-cyan-950/80'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${tab.color}`} />
                {isActive && <span className="h-2 w-2 rounded-full bg-cyan-400" />}
              </div>
              <div className="text-xs text-slate-400 font-medium">{tab.label}</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">{tab.val}</div>
            </button>
          );
        })}
      </div>

      {/* Interactive Trend Chart */}
      <VitalTrendChart
        vitals={vitalsHistory}
        selectedVital={selectedVitalTab}
        className="w-full"
      />

      {/* Recent Measurements Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Recent Biometric Telemetry Log</h3>
              <p className="text-xs text-slate-400">Timestamped records captured via IoT continuous gateway</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {vitalsHistory.length} total logs stored
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Date / Timestamp</th>
                <th className="py-2.5 px-3">Heart Rate</th>
                <th className="py-2.5 px-3">Blood Pressure</th>
                <th className="py-2.5 px-3">SpO₂</th>
                <th className="py-2.5 px-3">Temperature</th>
                <th className="py-2.5 px-3">Resp Rate</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Sync State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 font-mono">
              {vitalsHistory.slice(0, 10).map((v) => (
                <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 text-slate-300">
                    {new Date(v.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{v.heartRate} <span className="text-[10px] text-slate-500">BPM</span></td>
                  <td className="py-3 px-3 text-slate-200">{v.bloodPressureSys}/{v.bloodPressureDia} <span className="text-[10px] text-slate-500">mmHg</span></td>
                  <td className="py-3 px-3 text-slate-200">{v.spo2}%</td>
                  <td className="py-3 px-3 text-slate-200">{v.temperature}°C</td>
                  <td className="py-3 px-3 text-slate-400">{v.respiratoryRate} rpm</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      v.status === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      v.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {v.synced ? (
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Cloud Synced
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Local Queued
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
