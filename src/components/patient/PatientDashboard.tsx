import React from 'react';
import { 
  Heart, 
  Activity, 
  Wind, 
  Thermometer, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Radio, 
  ShieldAlert, 
  ArrowRight, 
  RefreshCw, 
  Cpu,
  ChevronRight
} from 'lucide-react';
import { PatientProfile, VitalReading, HealthRiskAnalysis, IoTDevice } from '../../types';
import { HeartCanvas3D } from '../3d/HeartCanvas3D';
import { ECGWaveform } from '../charts/ECGWaveform';

interface PatientDashboardProps {
  patient: PatientProfile;
  latestVital: VitalReading;
  vitalsHistory: VitalReading[];
  aiRisk: HealthRiskAnalysis;
  devices: IoTDevice[];
  onNavigateTab: (tab: string) => void;
  onOpenAlertModal: () => void;
  onOpenSimulator: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  latestVital,
  vitalsHistory,
  aiRisk,
  devices,
  onNavigateTab,
  onOpenAlertModal,
  onOpenSimulator,
}) => {
  const isEmergency = latestVital.status === 'critical';
  const isWarning = latestVital.status === 'warning';

  const connectedDevicesCount = devices.filter(d => d.connected).length;

  const vitalsCards = [
    {
      id: 'hr',
      title: 'Heart Rate',
      value: latestVital.heartRate,
      unit: 'BPM',
      status: latestVital.heartRate >= 140 || latestVital.heartRate <= 45 ? 'critical' : latestVital.heartRate >= 105 || latestVital.heartRate <= 52 ? 'warning' : 'normal',
      target: `${patient.baselineVitals.targetHeartRate[0]} - ${patient.baselineVitals.targetHeartRate[1]} BPM`,
      icon: Heart,
      iconBoxBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      time: new Date(latestVital.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 'bp',
      title: 'Blood Pressure',
      value: `${latestVital.bloodPressureSys}/${latestVital.bloodPressureDia}`,
      unit: 'mmHg',
      status: latestVital.bloodPressureSys >= 180 || latestVital.bloodPressureDia >= 120 ? 'critical' : latestVital.bloodPressureSys >= 135 || latestVital.bloodPressureDia >= 88 ? 'warning' : 'normal',
      target: `< 130/80 mmHg`,
      icon: Activity,
      iconBoxBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      time: new Date(latestVital.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 'spo2',
      title: 'SpO₂ Oxygen',
      value: latestVital.spo2,
      unit: '%',
      status: latestVital.spo2 < 90 ? 'critical' : latestVital.spo2 <= 94 ? 'warning' : 'normal',
      target: `≥ ${patient.baselineVitals.targetSpO2}%`,
      icon: Wind,
      iconBoxBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      time: new Date(latestVital.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 'temp',
      title: 'Body Temperature',
      value: latestVital.temperature,
      unit: '°C',
      status: latestVital.temperature >= 39.5 ? 'critical' : latestVital.temperature >= 37.8 ? 'warning' : 'normal',
      target: `${patient.baselineVitals.targetTemp[0]} - ${patient.baselineVitals.targetTemp[1]} °C`,
      icon: Thermometer,
      iconBoxBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      time: new Date(latestVital.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Patient Welcome & Quick Status Banner */}
      <div className="bg-[#0E1629] rounded-2xl p-5 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {patient.id}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {patient.age} yrs • {patient.gender} • Blood {patient.bloodType}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {patient.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl">
              Attending: <span className="text-cyan-300 font-semibold">{patient.primaryDoctor.name}</span> • {patient.primaryDoctor.hospital}
            </p>
          </div>

          {/* Quick Status Pill and Emergency CTA */}
          <div className="flex flex-wrap items-center gap-3">
            {isEmergency ? (
              <button
                onClick={onOpenAlertModal}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse flex items-center gap-2 transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>CRITICAL ANOMALY DETECTED</span>
              </button>
            ) : isWarning ? (
              <button
                onClick={onOpenAlertModal}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Telemetry Out of Target</span>
              </button>
            ) : (
              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                <span>All Vitals Within Target</span>
              </div>
            )}

            <button
              onClick={onOpenSimulator}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Vitals Cards Grid - Sleek Interface theme style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitalsCards.map((card) => {
          const Icon = card.icon;
          const isCrit = card.status === 'critical';
          const isWarn = card.status === 'warning';

          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab('vitals')}
              className="relative bg-[#162035] border border-slate-700/50 hover:border-cyan-500/40 p-5 rounded-2xl shadow-xl cursor-pointer group transition-all duration-200"
            >
              {/* Subtle top ambient glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500/15 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-300 pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${card.iconBoxBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCrit
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isWarn
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    }`}
                  >
                    {card.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline">
                    <span className={`text-3xl font-bold tracking-tighter font-mono ${
                      isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-white'
                    }`}>
                      {card.value}
                    </span>
                    <span className="text-xs font-normal text-slate-400 ml-1.5 font-mono">{card.unit}</span>
                  </div>

                  <div className="text-xs text-slate-400 font-medium tracking-wide mt-1">
                    {card.title}
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Target: <span className="text-slate-400">{card.target}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-cyan-400 font-semibold group-hover:text-cyan-300">
                  <span>View Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: 3D Anatomical Heart + Live ECG Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Heart Visualizer Card */}
        <div className="lg:col-span-4 bg-[#162035] rounded-2xl p-5 border border-slate-700/50 shadow-xl flex flex-col justify-between relative group">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Heart className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">3D Real-Time Cardiac Mesh</span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {latestVital.heartRate} BPM
            </span>
          </div>

          <div className="my-2 h-[220px] w-full flex items-center justify-center">
            <HeartCanvas3D
              bpm={latestVital.heartRate}
              status={latestVital.status}
              className="w-full h-full"
            />
          </div>

          <div className="pt-3 border-t border-slate-700/50 text-xs text-slate-400 flex items-center justify-between">
            <span className="font-mono text-[11px]">Systole/Diastole 60fps</span>
            <button
              onClick={() => onNavigateTab('vitals')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>ECG Strip</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Live ECG Rhythm Strip */}
        <div className="lg:col-span-8 flex flex-col">
          <ECGWaveform
            bpm={latestVital.heartRate}
            status={latestVital.status}
            className="h-full"
          />
        </div>
      </div>

      {/* Bottom Row: AI Health Risk with Sleek Circular Gauge & Connected Devices Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Health Risk Analysis Card with Circular Gauge */}
        <div 
          onClick={() => onNavigateTab('ai_insights')}
          className="lg:col-span-7 bg-[#162035] rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/40 shadow-xl cursor-pointer flex flex-col justify-between transition-all"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">AI Health Risk Engine</h4>
                  <div className="text-[11px] text-slate-400">Real-Time Predictive Stratification</div>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                aiRisk.riskLevel === 'critical' ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                aiRisk.riskLevel === 'high' ? 'bg-orange-500 text-white' :
                aiRisk.riskLevel === 'moderate' ? 'bg-amber-500 text-slate-950' :
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {aiRisk.riskLevel} Risk
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
              {/* Sleek Circular Gauge from Theme */}
              <div className="w-28 h-28 rounded-full border-[6px] border-slate-800 flex items-center justify-center relative shrink-0">
                <div 
                  className="absolute inset-0 rounded-full border-[6px] border-cyan-500 border-t-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  style={{ transform: `rotate(${Math.min(aiRisk.riskScore * 3.6, 360)}deg)` }}
                />
                <div className="text-center">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">{aiRisk.riskScore}%</div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Score</div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiRisk.summary}
                </p>

                {/* Factor chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {aiRisk.primaryFactors.slice(0, 2).map((factor, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium">
                      • {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>Detailed AI Clinical Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Connected IoT Devices Summary */}
        <div 
          onClick={() => onNavigateTab('devices')}
          className="lg:col-span-5 bg-[#162035] rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/40 shadow-xl cursor-pointer flex flex-col justify-between transition-all"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">IoT Biosensor Fleet</h4>
                  <div className="text-[11px] text-slate-400">{connectedDevicesCount} of {devices.length} Active</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                BLE 5.3 Active
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {devices.slice(0, 3).map((d) => (
                <div key={d.id} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${d.connected ? 'bg-emerald-400 shadow-[0_0_6px_#22c55e]' : 'bg-slate-600'}`} />
                    <span className="font-semibold text-slate-200 truncate max-w-[140px]">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span>{d.batteryLevel}%</span>
                    <span className={d.connected ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                      {d.connected ? 'SYNCED' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>Configure All Biosensors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

