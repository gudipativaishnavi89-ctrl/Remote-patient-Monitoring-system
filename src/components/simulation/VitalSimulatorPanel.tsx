import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  Play, 
  Square, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Zap,
  Activity,
  Heart,
  Thermometer,
  Wind
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { PatientProfile, VitalReading } from '../../types';

interface VitalSimulatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activePatient: PatientProfile;
  latestVital: VitalReading;
  onNewReading: (reading: VitalReading) => void;
}

export const VitalSimulatorPanel: React.FC<VitalSimulatorPanelProps> = ({
  isOpen,
  onClose,
  activePatient,
  latestVital,
  onNewReading,
}) => {
  const [hr, setHr] = useState(latestVital.heartRate);
  const [sys, setSys] = useState(latestVital.bloodPressureSys);
  const [dia, setDia] = useState(latestVital.bloodPressureDia);
  const [spo2, setSpo2] = useState(latestVital.spo2);
  const [temp, setTemp] = useState(latestVital.temperature);
  const [resp, setResp] = useState(latestVital.respiratoryRate);

  const [isAutoStreaming, setIsAutoStreaming] = useState(false);
  const [isOnline, setIsOnline] = useState(storageService.isOnline());

  useEffect(() => {
    const unsub = storageService.onSyncStatusChange(s => setIsOnline(s.isOnline));
    return unsub;
  }, []);

  // Update sliders when external vital changes if not auto streaming
  useEffect(() => {
    if (!isAutoStreaming) {
      setHr(latestVital.heartRate);
      setSys(latestVital.bloodPressureSys);
      setDia(latestVital.bloodPressureDia);
      setSpo2(latestVital.spo2);
      setTemp(latestVital.temperature);
      setResp(latestVital.respiratoryRate);
    }
  }, [latestVital, isAutoStreaming]);

  // Periodic Auto streaming simulation
  useEffect(() => {
    if (!isAutoStreaming) return;

    const interval = setInterval(() => {
      // Mild natural physiological drift
      const newHr = Math.max(40, Math.min(180, Math.round(hr + (Math.random() * 4 - 2))));
      const newSys = Math.max(80, Math.min(210, Math.round(sys + (Math.random() * 4 - 2))));
      const newDia = Math.max(50, Math.min(130, Math.round(dia + (Math.random() * 3 - 1.5))));
      const newSpo2 = Math.max(82, Math.min(100, Math.round(spo2 + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
      const newTemp = Number((temp + (Math.random() * 0.1 - 0.05)).toFixed(1));
      const newResp = Math.max(10, Math.min(32, Math.round(resp + (Math.random() * 2 - 1))));

      setHr(newHr);
      setSys(newSys);
      setDia(newDia);
      setSpo2(newSpo2);
      setTemp(newTemp);
      setResp(newResp);

      let status: 'normal' | 'warning' | 'critical' = 'normal';
      if (newHr >= 140 || newHr <= 45 || newSys >= 180 || newDia >= 120 || newSpo2 < 90 || newTemp >= 39.5) {
        status = 'critical';
      } else if (newHr >= 105 || newHr <= 52 || newSys >= 135 || newDia >= 88 || newSpo2 <= 94 || newTemp >= 37.8) {
        status = 'warning';
      }

      const recorded = storageService.recordVitalReading({
        patientId: activePatient.id,
        timestamp: new Date().toISOString(),
        heartRate: newHr,
        bloodPressureSys: newSys,
        bloodPressureDia: newDia,
        spo2: newSpo2,
        temperature: newTemp,
        respiratoryRate: newResp,
        status,
      });

      onNewReading(recorded);
    }, 2800);

    return () => clearInterval(interval);
  }, [isAutoStreaming, hr, sys, dia, spo2, temp, resp, activePatient, onNewReading]);

  if (!isOpen) return null;

  const handleInjectReading = (
    overrideHr?: number,
    overrideSys?: number,
    overrideDia?: number,
    overrideSpo2?: number,
    overrideTemp?: number,
    overrideResp?: number
  ) => {
    const finalHr = overrideHr ?? hr;
    const finalSys = overrideSys ?? sys;
    const finalDia = overrideDia ?? dia;
    const finalSpo2 = overrideSpo2 ?? spo2;
    const finalTemp = overrideTemp ?? temp;
    const finalResp = overrideResp ?? resp;

    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (finalHr >= 140 || finalHr <= 45 || finalSys >= 180 || finalDia >= 120 || finalSpo2 < 90 || finalTemp >= 39.5) {
      status = 'critical';
    } else if (finalHr >= 105 || finalHr <= 52 || finalSys >= 135 || finalDia >= 88 || finalSpo2 <= 94 || finalTemp >= 37.8) {
      status = 'warning';
    }

    const recorded = storageService.recordVitalReading({
      patientId: activePatient.id,
      timestamp: new Date().toISOString(),
      heartRate: finalHr,
      bloodPressureSys: finalSys,
      bloodPressureDia: finalDia,
      spo2: finalSpo2,
      temperature: finalTemp,
      respiratoryRate: finalResp,
      status,
    });

    onNewReading(recorded);
  };

  const applyPreset = (type: 'normal' | 'warning' | 'critical' | 'bradycardia') => {
    if (type === 'normal') {
      setHr(72);
      setSys(120);
      setDia(80);
      setSpo2(98);
      setTemp(36.6);
      setResp(15);
      handleInjectReading(72, 120, 80, 98, 36.6, 15);
    } else if (type === 'warning') {
      setHr(108);
      setSys(142);
      setDia(92);
      setSpo2(94);
      setTemp(37.9);
      setResp(19);
      handleInjectReading(108, 142, 92, 94, 37.9, 19);
    } else if (type === 'critical') {
      setHr(146);
      setSys(186);
      setDia(122);
      setSpo2(88);
      setTemp(39.6);
      setResp(26);
      handleInjectReading(146, 186, 122, 88, 39.6, 26);
    } else if (type === 'bradycardia') {
      setHr(44);
      setSys(96);
      setDia(60);
      setSpo2(96);
      setTemp(36.4);
      setResp(12);
      handleInjectReading(44, 96, 60, 96, 36.4, 12);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel-elevated rounded-3xl max-w-2xl w-full p-6 border border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">IoT Telemetry & Network Simulator</h3>
              <p className="text-xs text-slate-400">
                Simulate real-time sensor streams, trigger physiological anomalies, and test offline cloud sync.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Clinical Scenario Presets */}
        <div className="my-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
            Inject Clinical Scenarios
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => applyPreset('normal')}
              className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Normal Vitals</span>
              <span className="text-[10px] text-emerald-400/70 font-mono">72 BPM | 120/80</span>
            </button>

            <button
              onClick={() => applyPreset('warning')}
              className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 text-amber-300 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Stage 2 Warning</span>
              <span className="text-[10px] text-amber-400/70 font-mono">108 BPM | 142/92</span>
            </button>

            <button
              onClick={() => applyPreset('critical')}
              className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold flex flex-col items-center gap-1 transition-all shadow-md shadow-rose-950/60"
            >
              <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-rose-200">CRITICAL Emergency</span>
              <span className="text-[10px] text-rose-300/80 font-mono">146 BPM | 88% SpO₂</span>
            </button>

            <button
              onClick={() => applyPreset('bradycardia')}
              className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 hover:bg-indigo-900/50 text-indigo-300 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
            >
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Bradycardia Alert</span>
              <span className="text-[10px] text-indigo-400/70 font-mono">44 BPM | 96/60</span>
            </button>
          </div>
        </div>

        {/* Real-time parameter sliders */}
        <div className="space-y-4 my-5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {/* Heart Rate */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Heart Rate:
              </span>
              <span className="font-mono text-cyan-300 font-bold">{hr} BPM</span>
            </div>
            <input
              type="range"
              min="35"
              max="190"
              value={hr}
              onChange={(e) => setHr(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Blood Pressure (Sys & Dia) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Systolic BP:</span>
                <span className="font-mono text-blue-300 font-bold">{sys} mmHg</span>
              </div>
              <input
                type="range"
                min="70"
                max="220"
                value={sys}
                onChange={(e) => setSys(Number(e.target.value))}
                className="w-full accent-blue-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Diastolic BP:</span>
                <span className="font-mono text-blue-300 font-bold">{dia} mmHg</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                value={dia}
                onChange={(e) => setDia(Number(e.target.value))}
                className="w-full accent-blue-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* SpO2 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-400" /> Blood Oxygen (SpO₂):
              </span>
              <span className="font-mono text-emerald-300 font-bold">{spo2}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="100"
              value={spo2}
              onChange={(e) => setSpo2(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Body Temp */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Body Temperature:
              </span>
              <span className="font-mono text-amber-300 font-bold">{temp} °C</span>
            </div>
            <input
              type="range"
              min="34.5"
              max="41.0"
              step="0.1"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Network Simulation & Auto Stream Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => storageService.setSimulatedOffline(isOnline)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isOnline
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500/50'
                  : 'bg-amber-950 border-amber-500 text-amber-300'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isOnline ? 'Go Offline (Test Local Cache)' : 'Offline Mode (Local Only)'}</span>
            </button>

            <button
              onClick={() => setIsAutoStreaming(!isAutoStreaming)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isAutoStreaming
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              {isAutoStreaming ? <Square className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" /> : <Play className="w-3.5 h-3.5 fill-slate-300 text-slate-300" />}
              <span>{isAutoStreaming ? 'Streaming Live...' : 'Continuous Stream'}</span>
            </button>
          </div>

          <button
            onClick={() => handleInjectReading()}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/80 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Send Telemetry Pulse</span>
          </button>
        </div>
      </div>
    </div>
  );
};
