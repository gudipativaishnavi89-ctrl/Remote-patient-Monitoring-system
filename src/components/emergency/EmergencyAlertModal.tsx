import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  UserCheck, 
  ShieldAlert, 
  X, 
  CheckCircle, 
  Siren, 
  MessageSquare,
  Clock,
  HeartCrack,
  Activity
} from 'lucide-react';
import { AlertRecord, PatientProfile, UserRole } from '../../types';
import { storageService } from '../../services/storageService';

interface EmergencyAlertModalProps {
  alert: AlertRecord | null;
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  currentRole: UserRole;
  onAlertUpdated: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  alert,
  isOpen,
  onClose,
  patient,
  currentRole,
  onAlertUpdated,
}) => {
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isNotifyingDoctor, setIsNotifyingDoctor] = useState(false);
  const [isCallingEMS, setIsCallingEMS] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isOpen || !alert) return null;

  const isCritical = alert.severity === 'critical';

  const handleNotifyDoctor = async () => {
    setIsNotifyingDoctor(true);
    await new Promise(r => setTimeout(r, 600));
    setIsNotifyingDoctor(false);
    setActionMessage(`High-priority emergency push dispatch sent to ${patient.primaryDoctor.name} (${patient.primaryDoctor.hospital}).`);
    storageService.logAudit('DOCTOR_EMERGENCY_DISPATCH', 'Emergency System', `Pushed priority page for Patient ${patient.name} to ${patient.primaryDoctor.name}`);
  };

  const handleNotifyEmergencyContact = () => {
    setActionMessage(`SMS and automated voice telemetry alert dispatched to primary contact: ${patient.emergencyContact.name} (${patient.emergencyContact.phone}).`);
    storageService.logAudit('EMERGENCY_CONTACT_NOTIFIED', 'Emergency System', `Automated alert sent to ${patient.emergencyContact.name}`);
  };

  const handleCallEMS = () => {
    setIsCallingEMS(true);
    setActionMessage('Initiated direct E911 Emergency Telemetry Bridge. Patient GPS coordinates and live biometric summary transmitted to local dispatch center.');
    storageService.logAudit('E911_DISPATCH_TRIGGERED', 'Emergency Dispatcher', `Transmitted live telemetry packet to emergency services for ${patient.name} at ${patient.address}`);
  };

  const handleAcknowledge = () => {
    storageService.acknowledgeAlert(
      alert.id,
      currentRole === 'doctor' ? 'Dr. Evelyn Vance, MD' : patient.name,
      doctorNotes || (currentRole === 'doctor' ? 'Physician reviewed telemetry and advised monitoring.' : 'Patient acknowledged emergency alert notice.')
    );
    onAlertUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in duration-200">
      <div className={`rounded-3xl max-w-xl w-full p-6 border shadow-2xl relative max-h-[90vh] overflow-y-auto ${
        isCritical 
          ? 'bg-slate-950/95 border-rose-500/50 shadow-rose-950/80' 
          : 'bg-slate-950/95 border-amber-500/40 shadow-amber-950/60'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl flex items-center justify-center ${
              isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {isCritical ? <Siren className="w-6 h-6 animate-bounce" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                  isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {alert.severity} Clinical Alert
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {alert.vitalType === 'heartRate' ? 'Cardiac Arrhythmia / Rate Outlier' :
                 alert.vitalType === 'spo2' ? 'Hypoxemia Respiratory Desaturation' :
                 alert.vitalType === 'bloodPressure' ? 'Hypertensive Crisis / Hemodynamic Alert' : 'Biometric Anomaly Detected'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Metric Banner */}
        <div className="my-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Trigger Value</div>
            <div className="text-2xl font-black font-mono text-white mt-0.5 flex items-center gap-2">
              <span className={isCritical ? 'text-rose-400' : 'text-amber-400'}>{alert.value}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Safety Threshold</div>
            <div className="text-sm font-mono font-semibold text-slate-300 mt-1">{alert.threshold}</div>
          </div>
        </div>

        {/* Alert Details & Medical Guidance */}
        <div className="space-y-3 mb-5 text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
          <p className="font-medium text-slate-200">{alert.message}</p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            <span className="text-cyan-400 font-bold">Patient:</span> {patient.name} (Age {patient.age}, {patient.gender}) • <span className="text-cyan-400 font-bold">Location:</span> {patient.address}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Automated clinical screening advice: Verify patient is seated and calm. For persistent chest pain, shortness of breath, or numbness, immediately initiate Emergency Dispatch.
          </p>
        </div>

        {actionMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          <button
            onClick={handleNotifyDoctor}
            disabled={isNotifyingDoctor}
            className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 hover:bg-blue-900/60 text-blue-300 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Notify On-Call Doctor</span>
            <span className="text-[10px] text-blue-400/70">{patient.primaryDoctor.name.split(',')[0]}</span>
          </button>

          <button
            onClick={handleNotifyEmergencyContact}
            className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Phone className="w-4 h-4 text-indigo-400" />
            <span>Emergency Contact</span>
            <span className="text-[10px] text-indigo-400/70">{patient.emergencyContact.name}</span>
          </button>

          <button
            onClick={handleCallEMS}
            className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 hover:bg-rose-900/80 text-rose-200 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-rose-950"
          >
            <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Call 911 / EMS</span>
            <span className="text-[10px] text-rose-300/70">GPS Telemetry Bridge</span>
          </button>
        </div>

        {/* Doctor Clinical Notes on Acknowledgment (if Doctor or acknowledging) */}
        {currentRole === 'doctor' && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Physician Assessment & Triage Note (Optional):
            </label>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="e.g. Telemetry reviewed. Patient advised to take PRN medication and re-measure in 15 min..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 outline-none h-16 resize-none"
            />
          </div>
        )}

        {/* Acknowledge Button */}
        <button
          onClick={handleAcknowledge}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>Acknowledge Alert & Log in Patient Chart</span>
        </button>
      </div>
    </div>
  );
};
