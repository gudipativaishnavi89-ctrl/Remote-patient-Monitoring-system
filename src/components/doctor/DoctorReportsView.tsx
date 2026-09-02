import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  Hospital, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Calendar,
  User,
  Heart
} from 'lucide-react';
import { PatientProfile, VitalReading, HealthRiskAnalysis } from '../../types';
import { storageService } from '../../services/storageService';

interface DoctorReportsViewProps {
  patient: PatientProfile;
  latestVital: VitalReading;
  vitalsHistory: VitalReading[];
  aiRisk: HealthRiskAnalysis;
}

export const DoctorReportsView: React.FC<DoctorReportsViewProps> = ({
  patient,
  latestVital,
  vitalsHistory,
  aiRisk,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportData = {
      reportTitle: 'Remote Patient Continuous Telemetry & EHR Summary',
      generatedDate: new Date().toISOString(),
      patientInfo: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        dob: patient.dob,
        bloodType: patient.bloodType,
      },
      diagnoses: patient.medicalHistory,
      medications: patient.currentMedications,
      allergies: patient.allergies,
      latestVitals: latestVital,
      aiRiskAnalysis: aiRisk,
      physician: patient.primaryDoctor,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_report_${patient.id}_${Date.now()}.json`;
    a.click();
  };

  // Calculate 24h statistics
  const hrValues = vitalsHistory.map(v => v.heartRate);
  const minHr = Math.min(...hrValues);
  const maxHr = Math.max(...hrValues);
  const avgHr = Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Clinical Export Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Patient: {patient.name} ({patient.id})
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Official Telehealth & RPM Medical Report</h2>
          <p className="text-xs text-slate-300 mt-1">
            Generated for clinical documentation, hospital transfers, insurance billing, and EHR archival.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-400 text-teal-300 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data (.JSON)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-950 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clinical Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div
        ref={reportRef}
        className="glass-panel rounded-3xl p-8 border border-slate-700 bg-[#0b1329] print:bg-white print:text-black print:p-6 print:border-none shadow-2xl max-w-4xl mx-auto space-y-6"
      >
        {/* Hospital Letterhead */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-800 print:border-gray-300">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 print:border-gray-400 print:text-black">
              <Hospital className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white print:text-black">
                METROPOLITAN GENERAL HOSPITAL
              </h1>
              <div className="text-xs text-slate-400 print:text-gray-600 font-medium">
                Division of Cardiovascular Medicine • Telemetry Command & RPM Center
              </div>
              <div className="text-[11px] text-slate-500 print:text-gray-500 font-mono">
                700 Health Sciences Blvd • Tel: +1 (555) 900-4400 • Accreditation #MGH-99201
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <div className="text-teal-400 font-bold print:text-black">CONFIDENTIAL MEDICAL REPORT</div>
            <div className="text-slate-400 print:text-gray-600">Date: {new Date().toLocaleDateString()}</div>
            <div className="text-[10px] text-slate-500 print:text-gray-500">Document ID: RPM-{Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        {/* Patient Demographics Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs">
          <div>
            <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-mono">Patient Name</span>
            <strong className="text-white print:text-black font-bold text-sm">{patient.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-mono">Patient MRN / ID</span>
            <strong className="text-teal-300 print:text-black font-mono font-bold">{patient.id}</strong>
          </div>
          <div>
            <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-mono">Age / Gender / DOB</span>
            <span className="text-slate-200 print:text-black font-semibold">{patient.age}y / {patient.gender} / {patient.dob}</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-mono">Blood Group</span>
            <span className="text-rose-400 print:text-red-700 font-mono font-bold">{patient.bloodType}</span>
          </div>
        </div>

        {/* 24-Hour Telemetry Analytics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700 font-mono mb-2">
            1. Continuous Biometric Telemetry Summary (24-Hour Period)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">Heart Rate Range</span>
              <div className="text-base font-bold text-rose-400 print:text-black mt-0.5">{minHr} - {maxHr} BPM</div>
              <div className="text-[10px] text-slate-500">Mean: {avgHr} BPM</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">Blood Pressure</span>
              <div className="text-base font-bold text-blue-300 print:text-black mt-0.5">{latestVital.bloodPressureSys}/{latestVital.bloodPressureDia}</div>
              <div className="text-[10px] text-slate-500">mmHg</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">SpO₂ Oxygenation</span>
              <div className="text-base font-bold text-emerald-300 print:text-black mt-0.5">{latestVital.spo2}%</div>
              <div className="text-[10px] text-slate-500">Normal Range: ≥ 95%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 print:bg-gray-50 border border-slate-800 print:border-gray-300">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">Body Temperature</span>
              <div className="text-base font-bold text-amber-300 print:text-black mt-0.5">{latestVital.temperature} °C</div>
              <div className="text-[10px] text-slate-500">Normothermic</div>
            </div>
          </div>
        </div>

        {/* AI Health Risk Stratification */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700 font-mono mb-2">
            2. AI Cardiovascular & Hemodynamic Risk Stratification
          </h3>
          <div className="p-4 rounded-2xl bg-purple-950/20 print:bg-gray-100 border border-purple-500/30 print:border-gray-300 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-purple-300 print:text-black">
                Classification: <span className="uppercase font-mono">{aiRisk.riskLevel} RISK ({aiRisk.riskScore}%)</span>
              </div>
              <span className="text-[11px] text-slate-400 print:text-gray-600 font-mono">Confidence: {aiRisk.confidenceScore}%</span>
            </div>
            <p className="text-slate-300 print:text-gray-800 leading-relaxed">
              {aiRisk.summary}
            </p>
            <div className="pt-2 border-t border-purple-500/20 print:border-gray-300 text-[11px] text-slate-400 print:text-gray-600">
              <strong>Recommendations:</strong> {aiRisk.recommendations.join(' • ')}
            </div>
          </div>
        </div>

        {/* Current Active Medications & Medical History */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-gray-50 border border-slate-800 print:border-gray-300">
            <span className="font-bold text-white print:text-black block mb-2 font-mono uppercase text-[11px]">Chronic Diagnoses</span>
            <ul className="space-y-1 text-slate-300 print:text-gray-700">
              {patient.medicalHistory.map((h, i) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 print:bg-gray-50 border border-slate-800 print:border-gray-300">
            <span className="font-bold text-white print:text-black block mb-2 font-mono uppercase text-[11px]">Active Prescriptions</span>
            <ul className="space-y-1 text-slate-300 print:text-gray-700">
              {patient.currentMedications.map((m) => (
                <li key={m.id}>• {m.name} ({m.dosage}, {m.frequency})</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Physician Sign-Off & Verification Footer */}
        <div className="pt-6 border-t border-slate-800 print:border-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-white print:text-black">{patient.primaryDoctor.name}</div>
            <div className="text-slate-400 print:text-gray-600">{patient.primaryDoctor.specialty}</div>
            <div className="text-[10px] text-slate-500 print:text-gray-500 font-mono">License ID: {patient.primaryDoctor.id}</div>
          </div>

          <div className="text-center sm:text-right">
            <div className="h-8 border-b border-dashed border-slate-700 print:border-black w-48 mb-1" />
            <div className="text-[10px] text-slate-400 print:text-gray-600 font-mono">Attending Physician Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};
