import React from 'react';
import { 
  Home, 
  Activity, 
  FileText, 
  History, 
  Cpu, 
  Bell, 
  Radio, 
  User, 
  Settings,
  Users,
  LayoutDashboard,
  ShieldAlert,
  ClipboardList,
  BarChart3,
  Stethoscope
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavigationProps {
  currentRole: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentRole,
  currentTab,
  onSelectTab,
}) => {
  const patientTabs = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'vitals', label: 'Telemetry & ECG', icon: Activity },
    { id: 'clinical', label: 'Clinical Data', icon: FileText },
    { id: 'history', label: 'Trend History', icon: History },
    { id: 'ai_insights', label: 'AI Risk Engine', icon: Cpu },
    { id: 'alerts', label: 'Alert Log', icon: Bell },
    { id: 'devices', label: 'IoT Biosensors', icon: Radio },
    { id: 'profile', label: 'Patient Profile', icon: User },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  const doctorTabs = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Directory', icon: Users },
    { id: 'live_monitoring', label: 'Live Ward Grid', icon: Activity },
    { id: 'alerts', label: 'Triage Alerts', icon: ShieldAlert },
    { id: 'clinical_records', label: 'Clinical Records', icon: ClipboardList },
    { id: 'ai_risk', label: 'Risk Stratification', icon: Cpu },
    { id: 'reports', label: 'Clinical Reports', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const tabs = currentRole === 'doctor' ? doctorTabs : patientTabs;

  return (
    <div className="w-full bg-[#0E1629]/95 border-b border-slate-800/80 backdrop-blur-md px-4 lg:px-8 sticky top-[57px] z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.15)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

