import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Phone, 
  UserCheck, 
  Siren,
  Filter,
  Check
} from 'lucide-react';
import { AlertRecord, PatientProfile, UserRole } from '../../types';
import { storageService } from '../../services/storageService';

interface AlertsViewProps {
  patient: PatientProfile;
  alerts: AlertRecord[];
  onSelectAlert: (alert: AlertRecord) => void;
  onRefreshAlerts: () => void;
  currentRole: UserRole;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  patient,
  alerts,
  onSelectAlert,
  onRefreshAlerts,
  currentRole,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const handleQuickAcknowledge = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    storageService.acknowledgeAlert(
      alertId, 
      currentRole === 'doctor' ? 'Dr. Evelyn Vance, MD' : patient.name,
      'Direct acknowledgment from alert center.'
    );
    onRefreshAlerts();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Real-Time Telemetry Triage
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {alerts.filter(a => !a.acknowledged).length} Unacknowledged
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Emergency & Warning Alert Center</h2>
          <p className="text-xs text-slate-300 mt-1">
            Automated notifications triggered by physiological thresholds with instant on-call doctor & 911 dispatch links.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterSeverity === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterSeverity === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterSeverity === 'warning' ? 'bg-amber-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Warnings
          </button>
        </div>
      </div>

      {/* Emergency Contacts Summary Card */}
      <div className="glass-panel rounded-3xl p-5 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs">Designated Emergency Dispatch Contacts</h4>
            <p className="text-[11px] text-slate-400">
              Primary: <span className="text-slate-200 font-semibold">{patient.emergencyContact.name}</span> ({patient.emergencyContact.phone}) • Doctor: <span className="text-slate-200 font-semibold">{patient.primaryDoctor.name}</span>
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
          SMS & Voice Dispatch Active
        </span>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="font-bold text-slate-200">No active alerts matching your filter</div>
            <p className="text-slate-500 mt-1">All real-time physiological telemetry is within calibrated target baselines.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className={`glass-panel rounded-2xl p-5 border transition-all cursor-pointer ${
                  isCrit
                    ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500'
                    : 'border-amber-500/30 bg-amber-950/20 hover:border-amber-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border mt-0.5 ${
                      isCrit ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {isCrit ? <Siren className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          isCrit ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(alert.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm mt-1">{alert.message}</h4>

                      <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-2">
                        <span>Trigger: <strong className={isCrit ? 'text-rose-400' : 'text-amber-400'}>{alert.value}</strong></span>
                        <span>Threshold: <strong className="text-slate-300">{alert.threshold}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right side actions & acknowledgment state */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    {alert.acknowledged ? (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ack by {alert.acknowledgedBy}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleQuickAcknowledge(e, alert.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    <span className="text-[11px] text-cyan-400 hover:underline">
                      View Dispatch Options →
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
