import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Bell, 
  User, 
  Stethoscope, 
  RefreshCw, 
  Sliders, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  AlertTriangle, 
  FileText,
  Heart,
  Phone
} from 'lucide-react';
import { UserRole, SyncStatusState, AlertRecord, PatientProfile } from '../../types';
import { storageService } from '../../services/storageService';
import { DEMO_DOCTOR } from '../../data/mockData';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activePatient: PatientProfile;
  onOpenSimulator: () => void;
  onOpenAlerts: () => void;
  onOpenAuth: (tab?: 'login' | 'register' | 'reset' | 'doctor') => void;
  onOpenLanding: () => void;
  onOpenReportModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activePatient,
  onOpenSimulator,
  onOpenAlerts,
  onOpenAuth,
  onOpenLanding,
  onOpenReportModal,
}) => {
  const [syncState, setSyncState] = useState<SyncStatusState>(storageService.getSyncState());
  const [alerts, setAlerts] = useState<AlertRecord[]>(storageService.getAlerts());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const unsub = storageService.onSyncStatusChange((s) => {
      setSyncState(s);
      setAlerts(storageService.getAlerts());
    });
    return unsub;
  }, []);

  const unacknowledgedCritical = alerts.filter(a => a.severity === 'critical' && !a.acknowledgedByDoctor);
  const unacknowledgedTotal = alerts.filter(a => !a.acknowledgedByDoctor);

  const handleToggleNetwork = () => {
    storageService.setSimulatedOffline(syncState.isOnline);
  };

  const handleManualSync = async () => {
    if (syncState.isOnline && syncState.pendingSyncCount > 0) {
      await storageService.syncOfflineQueue();
    }
  };

  const patientInitials = activePatient.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D1525] border-b border-slate-800/60 px-4 lg:px-8 py-3 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Sleek Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onOpenLanding}>
          <div className="w-8 h-8 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase italic">
              Nexus<span className="text-cyan-400 font-black">Med</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono not-italic font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                RPM
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Sleek Live Monitoring & Sync Pill */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-pulse"></span>
            <span>Monitoring Active</span>
          </div>

          {/* Sync & Cloud Status */}
          <button
            onClick={handleToggleNetwork}
            className={`flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-medium transition-all ${
              syncState.isOnline
                ? 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-cyan-500/40'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
            title="Toggle online/offline cache mode"
          >
            {syncState.isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono">Cloud Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[11px] font-mono">Offline Buffer</span>
              </>
            )}

            {syncState.pendingSyncCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold">
                {syncState.pendingSyncCount}
              </span>
            )}
          </button>

          {syncState.isOnline && syncState.pendingSyncCount > 0 && (
            <button
              onClick={handleManualSync}
              disabled={syncState.isSyncing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Emergency Contact Pill (as in theme header) */}
          <div className="hidden lg:block text-right pr-2 border-r border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">Emergency Contact</div>
            <div className="text-xs text-white font-mono font-bold tracking-tight flex items-center justify-end gap-1">
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{activePatient.emergencyContact.phone}</span>
            </div>
          </div>

          {/* Simulator Quick Action */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162035] hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 text-cyan-300 text-xs font-medium transition-all"
            title="Open Telemetry Anomaly Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-mono">Simulate</span>
          </button>

          {/* Critical Alerts Bell */}
          <button
            onClick={onOpenAlerts}
            className={`relative p-2 rounded-lg border transition-all ${
              unacknowledgedCritical.length > 0
                ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 animate-pulse'
                : unacknowledgedTotal.length > 0
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-[#162035] border-slate-700/60 text-slate-400 hover:text-white'
            }`}
            title="View Alerts"
          >
            <Bell className="w-4 h-4" />
            {unacknowledgedTotal.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                {unacknowledgedTotal.length}
              </span>
            )}
          </button>

          {/* Clinical Report Button (when Doctor) */}
          {currentRole === 'doctor' && onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          )}

          {/* User Role Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-[#162035] hover:bg-slate-800 border border-slate-700/60 text-white text-xs font-semibold transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600/50 flex items-center justify-center text-xs font-bold text-cyan-300 shadow-md">
                {currentRole === 'doctor' ? 'EV' : patientInitials}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {currentRole === 'doctor' ? 'Dr. Vance' : activePatient.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-400 font-mono capitalize">
                  {currentRole} Mode
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0E1629] border border-slate-700/70 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                    Active Profile
                  </div>
                  <div className="text-xs font-semibold text-white mt-0.5">
                    {currentRole === 'doctor' ? DEMO_DOCTOR.name : activePatient.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ID: {currentRole === 'doctor' ? DEMO_DOCTOR.id : activePatient.id}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentRole('patient')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                    currentRole === 'patient'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold">Patient Dashboard</div>
                    <div className="text-[10px] text-slate-400">Personal telemetry & records</div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentRole('doctor')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors mt-1 ${
                    currentRole === 'doctor'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="font-bold">Doctor Command Center</div>
                    <div className="text-[10px] text-slate-400">Multi-patient grid & triage</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Sign In / Switch Profile</span>
                </button>

                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>Register New Patient</span>
                </button>

                <button
                  onClick={onOpenLanding}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span>Product Overview</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

