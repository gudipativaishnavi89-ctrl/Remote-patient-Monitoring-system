import React, { useState } from 'react';
import { 
  Radio, 
  Battery, 
  BatteryCharging, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Activity,
  Heart,
  Wind,
  Thermometer,
  Sliders
} from 'lucide-react';
import { IoTDevice } from '../../types';
import { IoTDevices3D } from '../3d/IoTDevices3D';
import { storageService } from '../../services/storageService';

interface IoTDevicesViewProps {
  devices: IoTDevice[];
  onDeviceUpdated: (device: IoTDevice) => void;
}

export const IoTDevicesView: React.FC<IoTDevicesViewProps> = ({
  devices,
  onDeviceUpdated,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice>(devices[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);

  const handleToggleConnection = (device: IoTDevice) => {
    const updated: IoTDevice = {
      ...device,
      connected: !device.connected,
      status: !device.connected ? 'active' : 'disconnected',
      lastSync: !device.connected ? 'Just now' : device.lastSync,
    };
    storageService.updateIoTDevice(updated);
    onDeviceUpdated(updated);
    if (selectedDevice.id === device.id) {
      setSelectedDevice(updated);
    }
  };

  const handleScanDevices = async () => {
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsScanning(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 border border-cyan-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Hardware Fleet Management
            </span>
            <span className="text-xs text-slate-400 font-mono">
              BLE 5.3 & Wi-Fi Mesh Gateway
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Connected IoT Healthcare Devices</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time biometric sensor mesh with continuous telemetry capture, automated firmware health check, and battery monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScanDevices}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning BLE Band...' : 'Scan Nearby Sensors'}</span>
          </button>

          <button
            onClick={() => setShowPairModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950"
          >
            <Plus className="w-4 h-4" />
            <span>Pair New Device</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Devices List + 3D Device Inspection Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Devices Cards */}
        <div className="lg:col-span-7 space-y-4">
          {devices.map((device) => {
            const isSelected = selectedDevice.id === device.id;

            return (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`glass-panel rounded-2xl p-5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500/60 bg-cyan-950/30 ring-1 ring-cyan-500/40 shadow-xl shadow-cyan-950'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-3 rounded-2xl border ${
                      device.connected ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}>
                      {device.type === 'heart_rate' ? <Heart className="w-5 h-5 text-rose-400" /> :
                       device.type === 'blood_pressure' ? <Activity className="w-5 h-5 text-blue-400" /> :
                       device.type === 'pulse_oximeter' ? <Wind className="w-5 h-5 text-emerald-400" /> :
                       <Thermometer className="w-5 h-5 text-amber-400" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{device.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          device.connected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {device.connected ? 'CONNECTED' : 'STANDBY'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Model: {device.model} • MAC: {device.macAddress}
                      </div>
                      <div className="text-xs font-semibold text-cyan-300 mt-2 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Latest: {device.latestReading}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                      <span className="flex items-center gap-1">
                        <Battery className={`w-4 h-4 ${device.batteryLevel < 20 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                        {device.batteryLevel}%
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                        {device.signalStrength} dBm
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleConnection(device);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        device.connected
                          ? 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/40 text-rose-300'
                          : 'bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-500/40 text-cyan-300'
                      }`}
                    >
                      {device.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Hardware Component Visualizer & Deep Diagnostics */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedDevice.name}</h4>
                  <div className="text-[11px] text-slate-400 font-mono">3D Hardware Component Inspector</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-cyan-300">
                Interactive 3D
              </span>
            </div>

            {/* 3D Component rendering */}
            <div className="my-4 h-[200px] w-full flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 p-2">
              <IoTDevices3D device={selectedDevice} className="w-full h-full" />
            </div>

            {/* Hardware Diagnostics Spec */}
            <div className="space-y-2.5 text-xs bg-slate-900/50 p-4 rounded-2xl border border-slate-800 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Protocol:</span>
                <span className="text-slate-200">Bluetooth Low Energy 5.3 + AES-128</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Firmware:</span>
                <span className="text-emerald-400 font-bold">v3.4.2-GA (Up to Date)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sampling Rate:</span>
                <span className="text-slate-200">250 Hz Continuous</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Telemetry Packet:</span>
                <span className="text-cyan-300">{selectedDevice.lastSync}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleToggleConnection(selectedDevice)}
            className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition-colors border ${
              selectedDevice.connected
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950'
            }`}
          >
            {selectedDevice.connected ? 'Disconnect Sensor' : 'Pair & Connect Sensor'}
          </button>
        </div>
      </div>

      {/* Pair New Device Modal */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel-elevated rounded-3xl max-w-md w-full p-6 border border-cyan-500/30">
            <h3 className="text-lg font-bold text-white mb-1">Pair New Medical Sensor</h3>
            <p className="text-xs text-slate-400 mb-4">
              Hold the sensor in pairing mode within 1 meter of your mobile app or gateway.
            </p>

            <div className="space-y-2 mb-4">
              {['MedTech 3D Continuous Spirometer', 'Smart Glucose Tele-Sensor 4K', 'Sleep Apnea Nocturnal Oximeter'].map((dev, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowPairModal(false);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs font-semibold text-slate-200 flex items-center justify-between"
                >
                  <span>{dev}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Pair BLE</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPairModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
