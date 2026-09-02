import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Sliders, 
  FileText, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { PatientProfile, SyncStatus } from '../../types';
import { storageService } from '../../services/storageService';

interface SettingsViewProps {
  patient: PatientProfile;
  onRefreshData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  patient,
  onRefreshData,
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(storageService.getSyncStatus());
  const [auditLogs, setAuditLogs] = useState(storageService.getAuditLogs());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  useEffect(() => {
    const unsub = storageService.onSyncStatusChange(setSyncStatus);
    return unsub;
  }, []);

  const handleForceSync = async () => {
    setIsSyncing(true);
    await storageService.syncOfflineQueue();
    setIsSyncing(false);
    setAuditLogs(storageService.getAuditLogs());
    onRefreshData();
  };

  const handleExportData = () => {
    const data = {
      patient,
      vitals: storageService.getVitals(patient.id),
      alerts: storageService.getAlerts(patient.id),
      audit: auditLogs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient_telemetry_${patient.id}_${Date.now()}.json`;
    a.click();
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Reset local demo cache to original factory mock state?')) {
      storageService.resetDemoData();
      onRefreshData();
      setAuditLogs(storageService.getAuditLogs());
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              System Administration
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Engine v4.2-GA
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Platform Settings & Offline Storage</h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure edge caching, zero-loss offline synchronization queues, telemetry thresholds, and tamper-evident audit logs.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export EHR & Vitals (.JSON)</span>
        </button>
      </div>

      {showExportSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Protected Health Data successfully exported in structured JSON format!</span>
        </div>
      )}

      {/* Offline Storage & Edge Engine Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Offline Edge Storage & Cloud Sync</h3>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              syncStatus.isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {syncStatus.isOnline ? 'ONLINE' : 'OFFLINE MODE'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Unsynced Edge Queue:</span>
              <span className="text-cyan-300 font-bold">{syncStatus.pendingCount} biometric readings</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Last Successful Sync:</span>
              <span className="text-slate-200">{syncStatus.lastSyncTime}</span>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => storageService.setSimulatedOffline(syncStatus.isOnline)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                syncStatus.isOnline
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500'
                  : 'bg-amber-950 border-amber-500 text-amber-300'
              }`}
            >
              {syncStatus.isOnline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{syncStatus.isOnline ? 'Simulate Offline' : 'Restore Online'}</span>
            </button>

            <button
              onClick={handleForceSync}
              disabled={isSyncing || syncStatus.pendingCount === 0}
              className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Force Cloud Sync'}</span>
            </button>
          </div>
        </div>

        {/* Security & Factory Reset */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">Security & Storage Management</h3>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Biometric telemetry is buffered using client-side encrypted local state. When offline, all measurements are queued with monotonic timestamps to guarantee sequence integrity during cloud ingestion.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={handleResetData}
              className="w-full py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Local Cache & Re-seed Mock Clinical Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Trail Viewer */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">HIPAA Tamper-Evident Audit Trail</h3>
              <p className="text-xs text-slate-400">Immutable security event logging for medical telemetry access</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {auditLogs.length} events logged
          </span>
        </div>

        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold">
                  {log.action}
                </span>
                <span className="text-slate-300">{log.details}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                <span className="text-slate-400">by {log.actor}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
