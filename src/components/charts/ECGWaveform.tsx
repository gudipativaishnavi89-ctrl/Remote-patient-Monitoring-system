import React, { useEffect, useRef, useState } from 'react';
import { Activity, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface ECGWaveformProps {
  bpm: number;
  status: 'normal' | 'warning' | 'critical';
  className?: string;
  leadName?: string;
}

export const ECGWaveform: React.FC<ECGWaveformProps> = ({
  bpm,
  status,
  className = '',
  leadName = 'Lead II (Standard Rhythm)',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLead, setSelectedLead] = useState(leadName);
  const [speed, setSpeed] = useState<25 | 50>(25); // mm/s
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(status === 'critical' ? 880 : 587.33, ctx.currentTime); // D5 or A5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    let animationFrameId: number;
    let x = 0;
    let lastY = height / 2;
    let phase = 0;
    let lastBeatTime = 0;

    // Background color
    ctx.fillStyle = '#070c18';
    ctx.fillRect(0, 0, width, height);

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;

      // Small grid (12px)
      const gridSize = 12;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Major grid (60px)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
      for (let gx = 0; gx < width; gx += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }
    };

    drawGrid();

    // P-Q-R-S-T generator function
    const getECGValue = (p: number): number => {
      // p goes from 0 to 1 across one cardiac beat cycle
      const baseline = 0;
      
      // P wave: atrial depolarization (0.1 to 0.2)
      if (p >= 0.1 && p < 0.2) {
        return Math.sin((p - 0.1) * Math.PI / 0.1) * 0.18;
      }
      // PR segment: flat (0.2 to 0.3)
      if (p >= 0.2 && p < 0.3) return baseline;
      
      // Q wave: small downward deflection (0.3 to 0.34)
      if (p >= 0.3 && p < 0.34) {
        return -Math.sin((p - 0.3) * Math.PI / 0.04) * 0.15;
      }
      // R wave: sharp upward QRS spike (0.34 to 0.42)
      if (p >= 0.34 && p < 0.42) {
        return Math.sin((p - 0.34) * Math.PI / 0.08) * 1.0;
      }
      // S wave: downward deflection (0.42 to 0.48)
      if (p >= 0.42 && p < 0.48) {
        return -Math.sin((p - 0.42) * Math.PI / 0.06) * 0.35;
      }
      // ST segment: flat (0.48 to 0.58)
      if (p >= 0.48 && p < 0.58) return baseline;
      
      // T wave: ventricular repolarization (0.58 to 0.76)
      if (p >= 0.58 && p < 0.76) {
        return Math.sin((p - 0.58) * Math.PI / 0.18) * 0.28;
      }

      // Isoelectric baseline with subtle realistic baseline wander
      return baseline + (Math.sin(p * Math.PI * 4) * 0.015);
    };

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const stepSize = speed === 50 ? 3.2 : 2.0;
      const bps = Math.max(35, Math.min(200, bpm)) / 60;
      const cycleDuration = (1000 / bps); // ms

      const now = performance.now();
      const elapsedSinceBeat = (now - lastBeatTime) % cycleDuration;
      phase = elapsedSinceBeat / cycleDuration;

      if (phase < 0.05 && now - lastBeatTime > cycleDuration * 0.8) {
        lastBeatTime = now;
        playBeep();
      }

      // Calculate ECG amplitude
      const val = getECGValue(phase);
      const centerY = height / 2;
      const amplitudeScale = height * 0.38;
      const currentY = centerY - val * amplitudeScale;

      // Clear upcoming slice for continuous sweeping beam
      const clearWidth = 24;
      ctx.fillStyle = '#070c18';
      ctx.fillRect(x, 0, clearWidth, height);

      // Redraw grid on cleared section
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, clearWidth, height);
      ctx.clip();
      drawGrid();
      ctx.restore();

      // Draw active waveform segment
      ctx.beginPath();
      ctx.moveTo(x > stepSize ? x - stepSize : 0, lastY);
      ctx.lineTo(x, currentY);

      // Stroke Color
      if (status === 'critical') {
        ctx.strokeStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
      } else if (status === 'warning') {
        ctx.strokeStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
      } else {
        ctx.strokeStyle = '#06b6d4';
        ctx.shadowColor = '#38bdf8';
      }

      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw leading sweep dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, currentY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      lastY = currentY;
      x += stepSize;
      if (x >= width) {
        x = 0;
        lastY = centerY;
      }
    };

    render();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      ctx.fillStyle = '#070c18';
      ctx.fillRect(0, 0, width, height);
      drawGrid();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [bpm, status, speed, soundEnabled]);

  return (
    <div className={`glass-panel rounded-2xl p-4 flex flex-col relative overflow-hidden ${className}`}>
      {/* ECG Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{selectedLead}</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 font-mono">
                10 mm/mV
              </span>
            </div>
            <div className="text-[11px] text-slate-400">High-Resolution Biometric Waveform</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Lead Selector */}
          <select
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-cyan-400"
          >
            <option value="Lead II (Standard Rhythm)">Lead II (Standard Rhythm)</option>
            <option value="Lead V1 (Septal Rhythm)">Lead V1 (Septal)</option>
            <option value="Lead V5 (Lateral Rhythm)">Lead V5 (Lateral)</option>
            <option value="Lead aVR (Augmented)">Lead aVR</option>
          </select>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeed(s => (s === 25 ? 50 : 25))}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 font-mono text-[11px]"
            title="Toggle ECG paper sweep speed"
          >
            {speed} mm/s
          </button>

          {/* Audio Beep */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle cardiac acoustic beep telemetry"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Real-Time Canvas */}
      <div className="w-full flex-1 min-h-[160px] relative rounded-xl overflow-hidden border border-cyan-500/20 bg-[#070c18]">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Real-time stats overlay */}
        <div className="absolute top-2 right-3 flex items-center gap-3 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800/80 backdrop-blur-sm pointer-events-none text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">BPM:</span>
            <span className={`font-mono font-bold ${
              status === 'critical' ? 'text-rose-400' : status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
            }`}>{bpm}</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">QRS:</span>
            <span className="font-mono text-cyan-300 font-medium">84 ms</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">QTc:</span>
            <span className="font-mono text-cyan-300 font-medium">412 ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
