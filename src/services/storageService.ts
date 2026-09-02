import { VitalReading, IoTDevice, AlertRecord, SyncStatusState, PatientProfile, HealthRiskAnalysis } from '../types';
import { DEMO_PATIENTS, INITIAL_IOT_DEVICES, INITIAL_ALERTS, generateHistoricalVitalData } from '../data/mockData';
import { calculateLocalHealthRisk } from './aiRiskEngine';

const STORAGE_KEYS = {
  PATIENTS: 'rpm_patients_v1',
  CURRENT_PATIENT_ID: 'rpm_current_patient_id_v1',
  VITALS_HISTORY: 'rpm_vitals_history_v1',
  OFFLINE_QUEUE: 'rpm_offline_queue_v1',
  IOT_DEVICES: 'rpm_iot_devices_v1',
  ALERTS: 'rpm_alerts_v1',
  AUDIT_LOGS: 'rpm_audit_logs_v1',
  SIMULATED_OFFLINE: 'rpm_simulated_offline_v1',
};

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor?: string;
  performedBy?: string;
  details: string;
}

class StorageService {
  private isSimulatedOffline: boolean = false;
  private syncListeners: Array<(state: SyncStatusState) => void> = [];

  constructor() {
    this.initData();
    if (typeof window !== 'undefined') {
      const storedOffline = localStorage.getItem(STORAGE_KEYS.SIMULATED_OFFLINE);
      this.isSimulatedOffline = storedOffline === 'true';

      window.addEventListener('online', () => this.handleNetworkChange());
      window.addEventListener('offline', () => this.handleNetworkChange());
    }
  }

  private initData() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEMO_PATIENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PATIENT_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT_ID, 'PT-10024');
    }
    if (!localStorage.getItem(STORAGE_KEYS.IOT_DEVICES)) {
      localStorage.setItem(STORAGE_KEYS.IOT_DEVICES, JSON.stringify(INITIAL_IOT_DEVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VITALS_HISTORY)) {
      const defaultHistory = generateHistoricalVitalData('PT-10024');
      localStorage.setItem(STORAGE_KEYS.VITALS_HISTORY, JSON.stringify(defaultHistory));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE)) {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      const initialLogs: AuditLogEntry[] = [
        {
          id: 'LOG-1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action: 'PATIENT_AUTHENTICATION',
          actor: 'Sarah Jenkins (Patient)',
          performedBy: 'Sarah Jenkins (Patient)',
          details: 'Secure biometric login verified. HIPAA Session Token generated.',
        },
        {
          id: 'LOG-2',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          action: 'IOT_DEVICE_STREAM_SYNC',
          actor: 'Edge IoT Gateway',
          performedBy: 'Edge IoT Gateway',
          details: 'Synchronized 4 biometric sensors with 256-bit encryption.',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialLogs));
    }
  }

  public resetDemoData() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PATIENT_ID);
    localStorage.removeItem(STORAGE_KEYS.IOT_DEVICES);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.VITALS_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    this.initData();
    this.logAudit('CACHE_RESET', 'System Admin', 'Re-seeded application demo data to pristine hospital factory state.');
  }

  public isOnline(): boolean {
    if (this.isSimulatedOffline) return false;
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  }

  public setSimulatedOffline(offline: boolean) {
    this.isSimulatedOffline = offline;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, String(offline));
    }
    this.logAudit(
      offline ? 'NETWORK_MODE_OFFLINE' : 'NETWORK_MODE_ONLINE',
      'System Operator',
      offline ? 'Switched to simulated local offline storage mode.' : 'Restored cloud network synchronization channel.'
    );
    this.handleNetworkChange();
  }

  public getSimulatedOffline(): boolean {
    return this.isSimulatedOffline;
  }

  public onSyncStatusChange(cb: (state: SyncStatusState) => void) {
    this.syncListeners.push(cb);
    cb(this.getSyncState());
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== cb);
    };
  }

  private notifySyncListeners(isSyncing: boolean = false) {
    const state = this.getSyncState(isSyncing);
    this.syncListeners.forEach(cb => cb(state));
  }

  public getSyncState(isSyncing: boolean = false): SyncStatusState {
    const queue = this.getOfflineQueue();
    const vitals = this.getVitalsHistory();
    const nowIso = new Date().toLocaleTimeString();
    return {
      isOnline: this.isOnline(),
      pendingSyncCount: queue.length,
      pendingCount: queue.length,
      lastSyncTimestamp: new Date().toISOString(),
      lastSyncTime: nowIso,
      isSyncing,
      syncHistoryCount: vitals.filter(v => v.synced).length,
    };
  }

  public getSyncStatus(): SyncStatusState {
    return this.getSyncState();
  }

  private handleNetworkChange() {
    if (this.isOnline()) {
      this.syncOfflineQueue();
    }
    this.notifySyncListeners();
  }

  public getPatients(): PatientProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : DEMO_PATIENTS;
    } catch {
      return DEMO_PATIENTS;
    }
  }

  public getPatient(id: string): PatientProfile | undefined {
    return this.getPatients().find(p => p.id === id);
  }

  public savePatient(patient: PatientProfile) {
    const patients = this.getPatients();
    const idx = patients.findIndex(p => p.id === patient.id);
    if (idx >= 0) {
      patients[idx] = patient;
    } else {
      patients.unshift(patient);
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    this.logAudit('PATIENT_PROFILE_UPDATED', patient.name, `Updated clinical profile for ID: ${patient.id}`);
  }

  public getCurrentPatientId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PATIENT_ID) || 'PT-10024';
  }

  public setCurrentPatientId(id: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PATIENT_ID, id);
  }

  public getVitalsHistory(patientId?: string): VitalReading[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VITALS_HISTORY);
      const list: VitalReading[] = data ? JSON.parse(data) : [];
      if (patientId) {
        const filtered = list.filter(v => v.patientId === patientId);
        if (filtered.length === 0) {
          return generateHistoricalVitalData(patientId);
        }
        return filtered;
      }
      return list;
    } catch {
      return [];
    }
  }

  public getVitals(patientId?: string): VitalReading[] {
    return this.getVitalsHistory(patientId);
  }

  public getLatestVital(patientId?: string): VitalReading {
    const history = this.getVitalsHistory(patientId);
    if (history.length > 0) return history[0];
    return {
      id: `VR-FALLBACK`,
      patientId: patientId || 'PT-10024',
      timestamp: new Date().toISOString(),
      heartRate: 72,
      bloodPressureSys: 120,
      bloodPressureDia: 80,
      spo2: 98,
      temperature: 36.6,
      respiratoryRate: 16,
      status: 'normal',
      synced: true,
    };
  }

  public getLatestAiRisk(patientId: string): HealthRiskAnalysis {
    const patient = this.getPatient(patientId) || this.getPatients()[0];
    const latestVital = this.getLatestVital(patientId);
    const vitals = this.getVitalsHistory(patientId);
    return calculateLocalHealthRisk(patient, latestVital, vitals);
  }

  public getOfflineQueue(): VitalReading[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public recordVitalReading(reading: Omit<VitalReading, 'id' | 'synced'>): VitalReading {
    const isConnected = this.isOnline();
    const newRecord: VitalReading = {
      ...reading,
      id: `VR-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      synced: isConnected,
    };

    const history = this.getVitalsHistory();
    history.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.VITALS_HISTORY, JSON.stringify(history));

    if (!isConnected) {
      const queue = this.getOfflineQueue();
      queue.push(newRecord);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
      this.logAudit('OFFLINE_VITAL_SAVED', 'Edge Client', `Stored offline vital reading ${newRecord.heartRate} BPM, BP ${newRecord.bloodPressureSys}/${newRecord.bloodPressureDia} to encrypted local cache.`);
    } else {
      this.logAudit('CLOUD_VITAL_SYNC', 'IoT Pipeline', `Dispatched vital telemetry to Cloud Health Gateway (Patient ${reading.patientId})`);
    }

    // Auto-create alert if warning or critical
    if (reading.status === 'critical' || reading.status === 'warning') {
      this.createAlert({
        patientId: reading.patientId,
        timestamp: reading.timestamp,
        severity: reading.status,
        vitalType: reading.heartRate > 105 ? 'heartRate' : reading.spo2 < 95 ? 'spo2' : 'bloodPressure',
        value: `${reading.heartRate} BPM | ${reading.bloodPressureSys}/${reading.bloodPressureDia} mmHg`,
        threshold: reading.status === 'critical' ? 'Critical Emergency Limit' : 'Baseline Warning Threshold',
        message: reading.status === 'critical'
          ? `CRITICAL Telemetry Anomaly: HR ${reading.heartRate} BPM, BP ${reading.bloodPressureSys}/${reading.bloodPressureDia} mmHg, SpO₂ ${reading.spo2}%.`
          : `Warning: Vitals out of baseline: HR ${reading.heartRate} BPM, BP ${reading.bloodPressureSys}/${reading.bloodPressureDia} mmHg.`,
        acknowledged: false,
        emergencyDispatched: reading.status === 'critical',
        contactsNotified: true,
      });
    }

    this.notifySyncListeners();
    return newRecord;
  }

  public async syncOfflineQueue(): Promise<{ syncedCount: number }> {
    const queue = this.getOfflineQueue();
    if (queue.length === 0) return { syncedCount: 0 };

    this.notifySyncListeners(true);

    // Simulate realistic cloud packet handshake delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const history = this.getVitalsHistory();
    const queueIds = new Set(queue.map(q => q.id));

    const updatedHistory = history.map(item => {
      if (queueIds.has(item.id)) {
        return { ...item, synced: true };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEYS.VITALS_HISTORY, JSON.stringify(updatedHistory));
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify([]));

    this.logAudit('OFFLINE_QUEUE_FLUSHED', 'Auto-Sync Service', `Synchronized ${queue.length} buffered offline biometric records with central hospital cloud.`);

    this.notifySyncListeners(false);
    return { syncedCount: queue.length };
  }

  public getIoTDevices(patientId?: string): IoTDevice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IOT_DEVICES);
      return data ? JSON.parse(data) : INITIAL_IOT_DEVICES;
    } catch {
      return INITIAL_IOT_DEVICES;
    }
  }

  public updateIoTDevice(device: IoTDevice) {
    const devices = this.getIoTDevices();
    const idx = devices.findIndex(d => d.id === device.id);
    if (idx >= 0) {
      devices[idx] = device;
      localStorage.setItem(STORAGE_KEYS.IOT_DEVICES, JSON.stringify(devices));
      this.logAudit('IOT_DEVICE_UPDATE', 'Device Manager', `Updated device status ${device.name} [${device.connected ? 'ONLINE' : 'OFFLINE'}]`);
    }
  }

  public getAlerts(patientId?: string): AlertRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
      const list: AlertRecord[] = data ? JSON.parse(data) : INITIAL_ALERTS;
      if (patientId) {
        return list.filter(a => a.patientId === patientId);
      }
      return list;
    } catch {
      return INITIAL_ALERTS;
    }
  }

  public getAllAlerts(): AlertRecord[] {
    return this.getAlerts();
  }

  public createAlert(alert: Omit<AlertRecord, 'id'>): AlertRecord {
    const newAlert: AlertRecord = {
      ...alert,
      id: `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      acknowledged: alert.acknowledged ?? false,
    };
    const alerts = this.getAlerts();
    alerts.unshift(newAlert);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    this.logAudit('EMERGENCY_ALERT_TRIGGERED', 'AI Safety Engine', `Generated ${alert.severity.toUpperCase()} alert for Patient ${alert.patientId}: ${alert.message}`);
    return newAlert;
  }

  public acknowledgeAlert(alertId: string, actorName: string, notes?: string) {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex(a => a.id === alertId);
    if (idx >= 0) {
      alerts[idx].acknowledged = true;
      alerts[idx].acknowledgedBy = actorName;
      alerts[idx].acknowledgedByDoctor = true;
      alerts[idx].acknowledgedAt = new Date().toISOString();
      if (notes) alerts[idx].doctorNotes = notes;
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      this.logAudit('ALERT_ACKNOWLEDGED', actorName, `Acknowledged alert ${alertId}: ${notes || 'Reviewed'}`);
    }
  }

  public getAuditLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      const raw = data ? JSON.parse(data) : [];
      return raw.map((item: any) => ({
        ...item,
        actor: item.actor || item.performedBy || 'System User',
      }));
    } catch {
      return [];
    }
  }

  public logAudit(action: string, actor: string, details: string) {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      performedBy: actor,
      details,
    };
    logs.unshift(newEntry);
    if (logs.length > 100) logs.length = 100;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    }
  }
}

export const storageService = new StorageService();
