import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Smartphone, 
  HardDrive, 
  Cpu, 
  Wifi, 
  WifiOff, 
  Cloud, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Zap
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const Architecture3D: React.FC = () => {
  const [isOnline, setIsOnline] = useState(storageService.isOnline());
  const [activeStep, setActiveStep] = useState(0);
  const [pulsePosition, setPulsePosition] = useState(0);

  useEffect(() => {
    const unsub = storageService.onSyncStatusChange((s) => {
      setIsOnline(s.isOnline);
    });
    return unsub;
  }, []);

  useEffect(() => {
    // Pulse animation through nodes
    const interval = setInterval(() => {
      setPulsePosition((prev) => (prev >= 5 ? 0 : prev + 1));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 'iot',
      title: '1. IoT Biometric Sensors',
      subtitle: 'ECG, SpO₂, BP, Temp',
      icon: Activity,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
      description: 'Medical-grade continuous BLE/Wi-Fi biosensors stream encrypted raw telemetry every 1-5 seconds.',
    },
    {
      id: 'mobile',
      title: '2. Patient Mobile App',
      subtitle: 'Edge Ingestion Gateway',
      icon: Smartphone,
      color: 'text-blue-400 border-blue-500/40 bg-blue-950/40',
      description: 'Aggregates multi-sensor telemetry, verifies packet checksums, and handles local device pairing.',
    },
    {
      id: 'storage',
      title: '3. Local Encrypted Storage',
      subtitle: 'Zero Data-Loss Cache',
      icon: HardDrive,
      color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40',
      description: 'Stores all vital readings locally in encrypted cache. Ensures 100% data preservation during network drops.',
    },
    {
      id: 'edge-ai',
      title: '4. Edge AI Screening',
      subtitle: 'Real-Time Rule & Risk Check',
      icon: Cpu,
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
      description: 'Sub-second rule-based risk evaluation detects acute critical threshold breaches even while offline.',
    },
    {
      id: 'network',
      title: isOnline ? '5. Cloud Health Gateway' : '5. Offline Storage Hold',
      subtitle: isOnline ? 'HTTPS / WSS Synced' : 'Queued for Auto-Sync',
      icon: isOnline ? Cloud : HardDrive,
      color: isOnline ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' : 'text-amber-400 border-amber-500/40 bg-amber-950/40',
      description: isOnline
        ? 'Real-time synchronization with HIPAA-compliant cloud database and notification dispatch.'
        : 'Network unavailable. Buffered in local persistent queue; automatically syncs upon internet restoration.',
    },
    {
      id: 'doctor',
      title: '6. Doctor Command Center',
      subtitle: 'Clinical Tele-Triage',
      icon: UserCheck,
      color: 'text-teal-400 border-teal-500/40 bg-teal-950/40',
      description: 'Physicians monitor live telemetry, view AI risk stratification, acknowledge alerts, and adjust care plans.',
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-cyan-500/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Edge-to-Cloud Pipeline
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            System Architecture & Data Synchronization Workflow
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => storageService.setSimulatedOffline(!isOnline)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isOnline
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
            }`}
            title="Toggle network simulation to test offline local storage and automated cloud sync"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span>Network: {isOnline ? 'ONLINE (Cloud Connected)' : 'OFFLINE (Local Mode)'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Workflow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isPulsing = pulsePosition === idx;
          const isSelected = activeStep === idx;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                step.color
              } ${
                isSelected
                  ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-950/80 scale-[1.02]'
                  : 'hover:border-cyan-400/50'
              } ${isPulsing ? 'border-cyan-300 shadow-md shadow-cyan-500/20' : ''}`}
            >
              {isPulsing && (
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight mb-1">{step.title}</h4>
                <p className="text-xs text-slate-300 font-medium mb-2">{step.subtitle}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 line-clamp-3">
                {step.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Condition Banner */}
      <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">
              {isOnline ? 'Active Online Data Pipeline' : 'Offline Edge Preservation Mode Active'}
            </div>
            <p className="text-slate-400 mt-0.5">
              {isOnline
                ? 'Continuous telemetry stream: Sensors → Mobile → Edge Screening → Cloud Hub → Doctor live monitor.'
                : 'Offline failover engaged: Readings stored in encrypted local client storage. When connectivity is restored, unsynced packets flush to cloud.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {!isOnline && (
            <button
              onClick={() => {
                storageService.setSimulatedOffline(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Restore Internet & Auto-Sync
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
