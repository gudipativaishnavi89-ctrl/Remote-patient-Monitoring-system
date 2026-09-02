import React from 'react';
import { 
  Activity, 
  Smartphone, 
  Cpu, 
  Wifi, 
  Cloud, 
  UserCheck, 
  ShieldCheck, 
  Heart, 
  Bell, 
  FileText, 
  Sliders, 
  ArrowRight,
  Sparkles,
  Lock,
  Database,
  Radio,
  CheckCircle2,
  Stethoscope,
  LogIn,
  UserPlus,
  KeyRound
} from 'lucide-react';
import { Architecture3D } from '../3d/Architecture3D';
import { HeartCanvas3D } from '../3d/HeartCanvas3D';
import { UserRole } from '../../types';

interface LandingPageProps {
  onLaunchPortal: (role: UserRole) => void;
  onOpenSimulator: () => void;
  onOpenAuth: (tab?: 'login' | 'register' | 'reset') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchPortal,
  onOpenSimulator,
  onOpenAuth,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#070c18] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Corner Navigation Bar with Sign In & Get Started Boxes */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0F1D]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Medical System ID */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  AURA <span className="text-cyan-400">RPM</span>
                </span>
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  4K 3D TELEHEALTH
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Hospital Remote Patient Monitoring
              </p>
            </div>
          </div>

          {/* TOP CORNER BOXES: Sign In Box + Get Started Box */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Box 1: Sign In Box (triggers 1. Login, 2. Register, 3. Reset options) */}
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#162035] hover:bg-[#1f2d4a] border border-slate-700/90 hover:border-cyan-500/50 text-slate-200 hover:text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              title="Sign in with Email ID and Password, Register, or Reset credentials"
            >
              <LogIn className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Sign In</span>
            </button>

            {/* Box 2: Get Started Box (triggers Register Patient Profile) */}
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              title="Create new Patient Profile with medical history and demographics"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* 4K Hero Section */}
      <section className="relative w-full pt-8 sm:pt-12 pb-20 px-4 lg:px-8 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-xl text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-950/80">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span>Next-Gen Medical Telehealth • 3D 4K Visual Architecture</span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Remote Patient <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300">
                Monitoring System
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-slate-300 font-medium">
              "Connected Care. Intelligent Monitoring. Better Decisions."
            </p>

            <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Real-time continuous biometric telemetry, edge-to-cloud resilience with zero data-loss offline sync, AI-driven cardiovascular risk stratification, and instant clinical emergency dispatch.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onLaunchPortal('patient')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>Launch Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLaunchPortal('doctor')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-teal-500/40 text-teal-300 font-bold text-sm shadow-lg shadow-teal-950/60 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>Enter Doctor Dashboard</span>
              </button>

              <button
                onClick={onOpenSimulator}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700 text-slate-300 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Open Telemetry Simulator</span>
              </button>
            </div>
          </div>

          {/* 3D Heart & Live Telemetry Highlight Card */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 glass-panel-elevated rounded-3xl p-6 border border-cyan-500/30 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-sm">3D Real-Time Cardiac Mesh</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px] border border-cyan-500/20">
                  WebGL 4K
                </span>
              </div>

              <HeartCanvas3D bpm={72} status="normal" className="h-[250px] w-full" />

              <div className="mt-2 text-center text-xs text-slate-400">
                Interactive real-time ventricular contraction synced with biometric sensor rate
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-3">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">Real-Time Vitals Telemetry</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Continuous monitoring of Heart Rate, Blood Pressure (Sys/Dia), SpO₂ oxygen saturation, and Core Body Temperature with 12-lead ECG waveforms.
                  </p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-purple-500/20">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-3">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">AI Health Risk Analysis</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Multi-factor physiological risk scoring and early arrhythmia warning engine powered by Gemini AI and deterministic clinical triage rules.
                  </p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-amber-500/20">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">Offline Data Synchronization</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Zero telemetry loss. Biometric readings are preserved in local encrypted storage and seamlessly synchronized when network connection is restored.
                  </p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-rose-500/20">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 w-fit mb-3">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">Emergency Alert Engine</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Sub-second notification of critical physiological spikes with automated physician pages, family SMS dispatches, and emergency 911 bridge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Architecture & Data Flow Section */}
      <section className="py-16 px-4 lg:px-8 bg-slate-950/60 border-y border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              End-to-End Healthcare Data Flow
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Patient → Mobile App → IoT Devices → Edge Storage → AI Screening → Cloud Gateway → Doctor Dashboard
            </p>
          </div>

          <Architecture3D />
        </div>
      </section>

      {/* Feature Modules Breakdown */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Comprehensive Clinical Capabilities
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Engineered for modern hospitals, cardiology institutes, and remote care operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor Dashboard Card */}
          <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 w-fit mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Doctor Clinical Command Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                High-density multi-patient triage, risk ranking matrix, historical trend analysis, clinical notes authoring, and printable PDF medical report generation.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Patient Risk Stratification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Live Telemetry Multi-Stream
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Clinical Notes & Exportable Reports
                </li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchPortal('doctor')}
              className="mt-6 w-full py-2.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Open Doctor Dashboard →
            </button>
          </div>

          {/* Clinical Records & Security */}
          <div className="glass-panel rounded-3xl p-6 border border-blue-500/20 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Security, Privacy & Clinical Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enterprise HIPAA/GDPR data protection standards with AES-256 local encrypted storage, role-based access control, audit trail logging, and protected health data masking.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Medical History & Allergy Alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Active Medication Schedules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Tamper-evident Audit Logging
                </li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchPortal('patient')}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              View Clinical Data Hub →
            </button>
          </div>

          {/* IoT Devices Ecosystem */}
          <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">IoT Healthcare Device Fleet</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Universal BLE 5.3 & Wi-Fi device compatibility supporting continuous ECG chest straps, wireless blood pressure cuffs, pulse oximeters, and skin temp arrays.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Real-time battery & signal monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Automatic re-pairing on signal loss
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 3D Hardware Component Visualizer
                </li>
              </ul>
            </div>
            <button
              onClick={() => onLaunchPortal('patient')}
              className="mt-6 w-full py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Explore IoT Devices →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">AURA Remote Patient Monitoring System</span>
            <span>• 3D 4K Medical UI</span>
          </div>
          <div className="text-[11px] text-slate-500">
            For demonstration and research purposes. Medical decisions must always be confirmed by licensed clinical staff.
          </div>
        </div>
      </footer>
    </div>
  );
};
