import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, PatientProfile, VitalReading, AlertRecord, HealthRiskAnalysis, IoTDevice } from './types';
import { storageService } from './services/storageService';
import { analyzePatientRisk } from './services/aiRiskEngine';

// Common UI
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { VitalSimulatorPanel } from './components/simulation/VitalSimulatorPanel';
import { EmergencyAlertModal } from './components/emergency/EmergencyAlertModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';

// Patient Views
import { PatientDashboard } from './components/patient/PatientDashboard';
import { VitalsView } from './components/patient/VitalsView';
import { IoTDevicesView } from './components/patient/IoTDevicesView';
import { ClinicalDataView } from './components/patient/ClinicalDataView';
import { AIInsightsView } from './components/patient/AIInsightsView';
import { AlertsView } from './components/patient/AlertsView';
import { PatientProfileView } from './components/patient/PatientProfileView';
import { SettingsView } from './components/patient/SettingsView';

// Doctor Views
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorLiveMonitoring } from './components/doctor/DoctorLiveMonitoring';
import { DoctorPatientDirectory } from './components/doctor/DoctorPatientDirectory';
import { DoctorReportsView } from './components/doctor/DoctorReportsView';

export default function App() {
  // Navigation & Role State
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Modals & Panels
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register' | 'reset' | 'doctor'>('login');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [activeAlertForModal, setActiveAlertForModal] = useState<AlertRecord | null>(null);

  // App Data State
  const [patients, setPatients] = useState<PatientProfile[]>(() => storageService.getPatients());
  const [activePatientId, setActivePatientId] = useState<string>(() => storageService.getCurrentPatientId());
  
  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];
  
  const [latestVital, setLatestVital] = useState<VitalReading>(() => storageService.getLatestVital(activePatient.id));
  const [vitalsHistory, setVitalsHistory] = useState<VitalReading[]>(() => storageService.getVitals(activePatient.id));
  const [aiRisk, setAiRisk] = useState<HealthRiskAnalysis>(() => storageService.getLatestAiRisk(activePatient.id));
  const [devices, setDevices] = useState<IoTDevice[]>(() => storageService.getIoTDevices(activePatient.id));
  const [alerts, setAlerts] = useState<AlertRecord[]>(() => storageService.getAlerts(activePatient.id));

  // Sync state with active patient changes
  const refreshPatientData = useCallback((patientId: string) => {
    const p = storageService.getPatients().find(x => x.id === patientId) || storageService.getPatients()[0];
    setPatients(storageService.getPatients());
    setLatestVital(storageService.getLatestVital(p.id));
    setVitalsHistory(storageService.getVitals(p.id));
    setAiRisk(storageService.getLatestAiRisk(p.id));
    setDevices(storageService.getIoTDevices(p.id));
    setAlerts(storageService.getAlerts(p.id));
  }, []);

  useEffect(() => {
    refreshPatientData(activePatientId);
  }, [activePatientId, refreshPatientData]);

  // Handle Role Switching
  const handleSwitchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'doctor') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('home');
    }
  };

  // Launch from Landing Page
  const handleLaunchPortal = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentTab(role === 'doctor' ? 'dashboard' : 'home');
    setViewMode('app');
  };

  // Handle New Vital Reading Received from IoT or Simulator
  const handleNewReading = (reading: VitalReading) => {
    setLatestVital(reading);
    const updatedHistory = storageService.getVitals(activePatient.id);
    setVitalsHistory(updatedHistory);

    // Refresh alerts in case a threshold alert was created
    const updatedAlerts = storageService.getAlerts(activePatient.id);
    setAlerts(updatedAlerts);

    // Update AI risk analysis
    const freshRisk = analyzePatientRisk(activePatient, reading, updatedHistory);
    // If it's a promise, resolve it
    if (freshRisk instanceof Promise) {
      freshRisk.then(res => setAiRisk(res));
    } else {
      setAiRisk(freshRisk);
    }

    // Auto trigger alert modal if critical
    if (reading.status === 'critical') {
      const topAlert = updatedAlerts[0] || {
        id: `ALT-${Date.now()}`,
        patientId: activePatient.id,
        timestamp: reading.timestamp,
        severity: 'critical' as const,
        vitalType: 'heartRate' as const,
        value: `${reading.heartRate} BPM`,
        threshold: '> 140 BPM',
        message: 'Critical Tachycardia / Hemodynamic Instability detected via live biosensor stream.',
        acknowledged: false,
      };
      setActiveAlertForModal(topAlert);
      setIsAlertModalOpen(true);
    }
  };

  const handleOpenAlertDetails = (alert: AlertRecord) => {
    setActiveAlertForModal(alert);
    setIsAlertModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Header (Visible in App mode) */}
      {viewMode === 'app' ? (
        <>
          <Header
            currentRole={currentRole}
            setCurrentRole={handleSwitchRole}
            activePatient={activePatient}
            onOpenAuth={(tab) => {
              setAuthModalInitialTab(tab || 'login');
              setIsAuthModalOpen(true);
            }}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenAlerts={() => {
              const topAlert = alerts[0] || {
                id: `ALT-${Date.now()}`,
                patientId: activePatient.id,
                timestamp: latestVital.timestamp,
                severity: latestVital.status === 'critical' ? 'critical' : 'warning',
                vitalType: 'heartRate',
                value: `${latestVital.heartRate} BPM`,
                threshold: '> 105 BPM',
                message: 'Vital status warning threshold exceeded.',
                acknowledged: false,
              };
              handleOpenAlertDetails(topAlert);
            }}
            onOpenLanding={() => setViewMode('landing')}
          />
          <Navigation
            currentRole={currentRole}
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
          />
        </>
      ) : null}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {viewMode === 'landing' ? (
          <LandingPage
            onLaunchPortal={handleLaunchPortal}
            onOpenSimulator={() => {
              setViewMode('app');
              setIsSimulatorOpen(true);
            }}
            onOpenAuth={(tab) => {
              setAuthModalInitialTab(tab || 'login');
              setIsAuthModalOpen(true);
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
            {/* PATIENT PORTAL VIEWS */}
            {currentRole === 'patient' && (
              <>
                {currentTab === 'home' && (
                  <PatientDashboard
                    patient={activePatient}
                    latestVital={latestVital}
                    vitalsHistory={vitalsHistory}
                    aiRisk={aiRisk}
                    devices={devices}
                    onNavigateTab={setCurrentTab}
                    onOpenAlertModal={() => {
                      const topAlert = alerts[0] || {
                        id: `ALT-${Date.now()}`,
                        patientId: activePatient.id,
                        timestamp: latestVital.timestamp,
                        severity: latestVital.status === 'critical' ? 'critical' : 'warning',
                        vitalType: 'heartRate',
                        value: `${latestVital.heartRate} BPM`,
                        threshold: '> 105 BPM',
                        message: 'Vital Reading Exceeded Target Baseline Range.',
                        acknowledged: false,
                      };
                      handleOpenAlertDetails(topAlert);
                    }}
                    onOpenSimulator={() => setIsSimulatorOpen(true)}
                  />
                )}

                {(currentTab === 'vitals' || currentTab === 'history') && (
                  <VitalsView
                    patient={activePatient}
                    latestVital={latestVital}
                    vitalsHistory={vitalsHistory}
                    onOpenSimulator={() => setIsSimulatorOpen(true)}
                  />
                )}

                {currentTab === 'clinical' && (
                  <ClinicalDataView
                    patient={activePatient}
                    onPatientUpdated={(p) => {
                      setPatients(storageService.getPatients());
                    }}
                  />
                )}

                {currentTab === 'ai_insights' && (
                  <AIInsightsView
                    patient={activePatient}
                    latestVital={latestVital}
                    vitalsHistory={vitalsHistory}
                    currentAnalysis={aiRisk}
                    onAnalysisUpdated={setAiRisk}
                  />
                )}

                {currentTab === 'alerts' && (
                  <AlertsView
                    patient={activePatient}
                    alerts={alerts}
                    onSelectAlert={handleOpenAlertDetails}
                    onRefreshAlerts={() => setAlerts(storageService.getAlerts(activePatient.id))}
                    currentRole={currentRole}
                  />
                )}

                {currentTab === 'devices' && (
                  <IoTDevicesView
                    devices={devices}
                    onDeviceUpdated={() => setDevices(storageService.getIoTDevices(activePatient.id))}
                  />
                )}

                {currentTab === 'profile' && (
                  <PatientProfileView
                    patient={activePatient}
                    onPatientUpdated={(p) => {
                      setPatients(storageService.getPatients());
                    }}
                  />
                )}

                {currentTab === 'settings' && (
                  <SettingsView
                    patient={activePatient}
                    onRefreshData={() => refreshPatientData(activePatient.id)}
                  />
                )}
              </>
            )}

            {/* DOCTOR COMMAND CENTER VIEWS */}
            {currentRole === 'doctor' && (
              <>
                {currentTab === 'dashboard' && (
                  <DoctorDashboard
                    patients={patients}
                    selectedPatient={activePatient}
                    onSelectPatient={(p) => {
                      setActivePatientId(p.id);
                      storageService.setCurrentPatientId(p.id);
                    }}
                    onNavigateTab={setCurrentTab}
                    onOpenAlertModal={handleOpenAlertDetails}
                    onOpenSimulator={() => setIsSimulatorOpen(true)}
                  />
                )}

                {currentTab === 'live_monitoring' && (
                  <DoctorLiveMonitoring
                    patients={patients}
                    onSelectPatient={(p) => {
                      setActivePatientId(p.id);
                      storageService.setCurrentPatientId(p.id);
                      setCurrentTab('dashboard');
                    }}
                    onOpenAlertModal={handleOpenAlertDetails}
                  />
                )}

                {currentTab === 'patients' && (
                  <DoctorPatientDirectory
                    patients={patients}
                    selectedPatient={activePatient}
                    onSelectPatient={(p) => {
                      setActivePatientId(p.id);
                      storageService.setCurrentPatientId(p.id);
                    }}
                    onNavigateTab={setCurrentTab}
                  />
                )}

                {currentTab === 'alerts' && (
                  <AlertsView
                    patient={activePatient}
                    alerts={storageService.getAllAlerts()}
                    onSelectAlert={handleOpenAlertDetails}
                    onRefreshAlerts={() => setAlerts(storageService.getAlerts(activePatient.id))}
                    currentRole={currentRole}
                  />
                )}

                {currentTab === 'clinical_records' && (
                  <ClinicalDataView
                    patient={activePatient}
                    onPatientUpdated={() => setPatients(storageService.getPatients())}
                  />
                )}

                {currentTab === 'ai_risk' && (
                  <AIInsightsView
                    patient={activePatient}
                    latestVital={latestVital}
                    vitalsHistory={vitalsHistory}
                    currentAnalysis={aiRisk}
                    onAnalysisUpdated={setAiRisk}
                  />
                )}

                {currentTab === 'reports' && (
                  <DoctorReportsView
                    patient={activePatient}
                    latestVital={latestVital}
                    vitalsHistory={vitalsHistory}
                    aiRisk={aiRisk}
                  />
                )}

                {currentTab === 'settings' && (
                  <SettingsView
                    patient={activePatient}
                    onRefreshData={() => refreshPatientData(activePatient.id)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Global Modals & Simulators */}
      <VitalSimulatorPanel
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        activePatient={activePatient}
        latestVital={latestVital}
        onNewReading={handleNewReading}
      />

      <EmergencyAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alert={activeAlertForModal}
        patient={activePatient}
        currentRole={currentRole}
        onAlertUpdated={() => setAlerts(storageService.getAlerts(activePatient.id))}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalInitialTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(role, pid) => {
          setCurrentRole(role);
          if (pid) {
            setActivePatientId(pid);
            refreshPatientData(pid);
          }
          setViewMode('app');
          setCurrentTab(role === 'doctor' ? 'dashboard' : 'home');
        }}
      />
    </div>
  );
}
