import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  Activity, 
  Info,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { PatientProfile, VitalReading, HealthRiskAnalysis } from '../../types';
import { analyzePatientRisk } from '../../services/aiRiskEngine';

interface AIInsightsViewProps {
  patient: PatientProfile;
  latestVital: VitalReading;
  vitalsHistory: VitalReading[];
  currentAnalysis: HealthRiskAnalysis;
  onAnalysisUpdated: (analysis: HealthRiskAnalysis) => void;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  patient,
  latestVital,
  vitalsHistory,
  currentAnalysis,
  onAnalysisUpdated,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunFreshAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePatientRisk(patient, latestVital, vitalsHistory);
      onAnalysisUpdated(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-rose-950/40 border-rose-500/40',
          text: 'text-rose-400',
          badge: 'bg-rose-500 text-white',
          glow: 'shadow-rose-950/80',
        };
      case 'high':
        return {
          bg: 'bg-orange-950/40 border-orange-500/40',
          text: 'text-orange-400',
          badge: 'bg-orange-500 text-white',
          glow: 'shadow-orange-950/60',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40',
          text: 'text-amber-400',
          badge: 'bg-amber-500 text-slate-950',
          glow: 'shadow-amber-950/40',
        };
      default:
        return {
          bg: 'bg-emerald-950/30 border-emerald-500/30',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          glow: 'shadow-emerald-950/40',
        };
    }
  };

  const colors = getRiskColor(currentAnalysis.riskLevel);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-purple-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Gemini AI Biometric Intelligence
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Evaluated: {new Date(currentAnalysis.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">AI Health Risk Stratification</h2>
          <p className="text-xs text-slate-300 mt-1">
            Predictive multi-variate modeling correlating continuous ECG, hemodynamic pressures, and EHR history.
          </p>
        </div>

        <button
          onClick={handleRunFreshAnalysis}
          disabled={isAnalyzing}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Evaluating Bio-Tensors...' : 'Re-Analyze Current Vitals'}</span>
        </button>
      </div>

      {/* Main Risk Overview Banner */}
      <div className={`glass-panel-elevated rounded-3xl p-6 border ${colors.bg} shadow-2xl relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider ${colors.badge}`}>
                {currentAnalysis.riskLevel} Health Risk
              </span>
              <span className="text-xs font-mono text-slate-400">
                Confidence: {currentAnalysis.confidenceScore}%
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {currentAnalysis.summary}
            </h3>
          </div>

          {/* Large Visual Risk Score Dial */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Computed Risk</div>
              <div className={`text-4xl font-black font-mono mt-0.5 ${colors.text}`}>
                {currentAnalysis.riskScore}%
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            <div className="text-xs text-slate-300 space-y-0.5">
              <div>HR: <span className="font-mono font-bold text-white">{latestVital.heartRate} BPM</span></div>
              <div>BP: <span className="font-mono font-bold text-white">{latestVital.bloodPressureSys}/{latestVital.bloodPressureDia}</span></div>
              <div>SpO₂: <span className="font-mono font-bold text-white">{latestVital.spo2}%</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars: Contributing Factors, Clinical Risks, & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contributing Factors */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Primary Contributing Factors</h4>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              {currentAnalysis.primaryFactors.map((factor, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Potential Health Risks */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Potential Health Risks</h4>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              {currentAnalysis.potentialRisks.map((risk, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Actionable Guidance</h4>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              {currentAnalysis.recommendations.map((rec, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Clinical Explanation & Medical Disclaimer */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-white text-sm">AI Clinical Assessment Explanation</h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          {currentAnalysis.explanation}
        </p>

        {/* Strict Medical Disclaimer as per Prompt Directive */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
          <Stethoscope className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200">Clinical Decision Support Disclaimer: </span>
            AI-generated risk stratification and insights are designed solely to assist patient self-awareness and augment clinical triage workflows. They do not constitute a formal diagnosis, medical prescription, or replacement for evaluation by a licensed healthcare provider.
          </div>
        </div>
      </div>
    </div>
  );
};
