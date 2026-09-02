import React, { useState } from 'react';
import { 
  FileText, 
  Pill, 
  AlertOctagon, 
  History, 
  Stethoscope, 
  Plus, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Hospital,
  Download,
  Eye
} from 'lucide-react';
import { PatientProfile, ClinicalRecord, Medication, Allergy } from '../../types';
import { storageService } from '../../services/storageService';

interface ClinicalDataViewProps {
  patient: PatientProfile;
  onPatientUpdated: (patient: PatientProfile) => void;
}

export const ClinicalDataView: React.FC<ClinicalDataViewProps> = ({
  patient,
  onPatientUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'medications' | 'allergies' | 'records'>('history');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddClinicalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newRecord: ClinicalRecord = {
      id: `CR-${Date.now()}`,
      patientId: patient.id,
      date: new Date().toISOString().split('T')[0],
      type: 'Clinical Note',
      title: newNoteTitle,
      doctorName: patient.primaryDoctor.name,
      facility: patient.primaryDoctor.hospital,
      content: newNoteContent,
    };

    const updatedPatient: PatientProfile = {
      ...patient,
      clinicalRecords: [newRecord, ...patient.clinicalRecords],
    };

    storageService.savePatient(updatedPatient);
    onPatientUpdated(updatedPatient);
    setShowAddNoteModal(false);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Electronic Health Record (EHR)
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Protected Health Information (PHI)
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Clinical Profile & Medical History</h2>
          <p className="text-xs text-slate-300 mt-1">
            Patient EHR Dossier • Primary Physician: {patient.primaryDoctor.name} ({patient.primaryDoctor.hospital})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddNoteModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-blue-950"
          >
            <Plus className="w-4 h-4" />
            <span>Add Clinical Entry</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'history' as const, label: 'Medical History & Diagnoses', icon: History, count: patient.medicalHistory.length },
          { id: 'medications' as const, label: 'Active Medications', icon: Pill, count: patient.currentMedications.length },
          { id: 'allergies' as const, label: 'Allergies & Sensitivities', icon: AlertOctagon, count: patient.allergies.length },
          { id: 'records' as const, label: 'Clinical Encounters & Notes', icon: FileText, count: patient.clinicalRecords.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Medical History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Documented Chronic Conditions & Prior Interventions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patient.medicalHistory.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{item}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Continuous telemetry parameters adjusted for baseline cardiac tolerance.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Medications */}
      {activeTab === 'medications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patient.currentMedications.map((med) => (
            <div key={med.id} className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{med.name}</h4>
                      <span className="text-xs font-mono text-purple-300 font-bold">{med.dosage}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {med.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Frequency:</span>
                    <span className="font-semibold text-slate-200">{med.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prescriber:</span>
                    <span className="text-slate-200">{med.prescribedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="font-mono text-slate-300">{med.startDate}</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Instructions:</span> {med.instructions}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Allergies */}
      {activeTab === 'allergies' && (
        <div className="space-y-4">
          {patient.allergies.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center text-xs text-slate-400">
              No documented drug or environmental allergies in chart.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {patient.allergies.map((alg) => (
                <div key={alg.id} className="glass-panel rounded-3xl p-5 border border-rose-500/30 bg-rose-950/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        <AlertOctagon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{alg.allergen}</h4>
                        <span className="text-xs text-rose-300 font-semibold">{alg.reaction}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500 text-white font-mono">
                      {alg.severity}
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400 font-mono">
                    Recorded Date: {alg.recordedDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Clinical Records */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {patient.clinicalRecords.map((record) => (
            <div key={record.id} className="glass-panel rounded-3xl p-6 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{record.title}</h4>
                    <div className="text-xs text-slate-400 font-mono">
                      {record.doctorName} • {record.facility}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    {record.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{record.date}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                {record.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Clinical Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel-elevated rounded-3xl max-w-lg w-full p-6 border border-cyan-500/30">
            <h3 className="text-lg font-bold text-white mb-1">Add Clinical Note Entry</h3>
            <p className="text-xs text-slate-400 mb-4">Append doctor observation or patient report to chart.</p>

            <form onSubmit={handleAddClinicalNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Entry Title</label>
                <input
                  type="text"
                  placeholder="e.g. Tele-Consultation Follow-Up"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clinical Observation / Notes</label>
                <textarea
                  rows={4}
                  placeholder="Enter clinical assessment, vitals correlation, or adjustments..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-950"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
