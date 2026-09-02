import React, { useState } from 'react';
import { VitalReading } from '../../types';
import { TrendingUp, Clock, Info, Calendar } from 'lucide-react';

interface VitalTrendChartProps {
  vitals: VitalReading[];
  selectedVital: 'heartRate' | 'bloodPressure' | 'spo2' | 'temperature';
  className?: string;
}

export const VitalTrendChart: React.FC<VitalTrendChartProps> = ({
  vitals,
  selectedVital,
  className = '',
}) => {
  const [timeframe, setTimeframe] = useState<'live' | '24h' | '7d' | '30d'>('24h');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Filter data based on timeframe
  const getDataForTimeframe = () => {
    if (!vitals || vitals.length === 0) return [];
    const sorted = [...vitals].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (timeframe === 'live') {
      return sorted.slice(-12);
    }
    if (timeframe === '24h') {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
      const filtered = sorted.filter(v => new Date(v.timestamp).getTime() >= dayAgo);
      return filtered.length > 0 ? filtered : sorted.slice(-16);
    }
    if (timeframe === '7d') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();
      const filtered = sorted.filter(v => new Date(v.timestamp).getTime() >= weekAgo);
      return filtered.length > 0 ? filtered : sorted.slice(-28);
    }
    // 30d
    return sorted.slice(-45);
  };

  const chartData = getDataForTimeframe();

  // Metrics definition
  const getVitalConfig = () => {
    switch (selectedVital) {
      case 'heartRate':
        return {
          title: 'Heart Rate Trend',
          unit: 'BPM',
          minY: 40,
          maxY: 160,
          normalLow: 60,
          normalHigh: 100,
          color: '#06b6d4',
          getValue: (v: VitalReading) => v.heartRate,
        };
      case 'bloodPressure':
        return {
          title: 'Blood Pressure Trend (Sys / Dia)',
          unit: 'mmHg',
          minY: 50,
          maxY: 200,
          normalLow: 80,
          normalHigh: 120,
          color: '#3b82f6',
          getValue: (v: VitalReading) => v.bloodPressureSys,
          getSecondary: (v: VitalReading) => v.bloodPressureDia,
        };
      case 'spo2':
        return {
          title: 'Blood Oxygen Saturation (SpO₂)',
          unit: '%',
          minY: 85,
          maxY: 100,
          normalLow: 95,
          normalHigh: 100,
          color: '#10b981',
          getValue: (v: VitalReading) => v.spo2,
        };
      case 'temperature':
        return {
          title: 'Body Temperature Trend',
          unit: '°C',
          minY: 35.0,
          maxY: 40.0,
          normalLow: 36.1,
          normalHigh: 37.2,
          color: '#f59e0b',
          getValue: (v: VitalReading) => v.temperature,
        };
    }
  };

  const config = getVitalConfig();

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const getYCoord = (val: number) => {
    const clamped = Math.max(config.minY, Math.min(config.maxY, val));
    const ratio = (clamped - config.minY) / (config.maxY - config.minY);
    return svgHeight - padding.bottom - ratio * graphHeight;
  };

  const getXCoord = (index: number, total: number) => {
    if (total <= 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (total - 1)) * graphWidth;
  };

  // Generate SVG path points
  const points = chartData.map((d, i) => ({
    x: getXCoord(i, chartData.length),
    y: getYCoord(config.getValue(d)),
    y2: config.getSecondary ? getYCoord(config.getSecondary(d)) : undefined,
    data: d,
  }));

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const secondaryPathD = config.getSecondary
    ? points.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y2}` : `${acc} L ${p.x} ${p.y2}`;
      }, '')
    : '';

  // Area fill under primary curve
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding.bottom} L ${points[0].x} ${svgHeight - padding.bottom} Z`
    : '';

  // Calculate summary stats
  const values = chartData.map(config.getValue);
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const avgVal = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

  return (
    <div className={`glass-panel rounded-2xl p-5 flex flex-col ${className}`}>
      {/* Header with Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">{config.title}</h4>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Target Range: {config.normalLow} - {config.normalHigh} {config.unit}</span>
              <span className="text-slate-600">•</span>
              <span>{chartData.length} records plotted</span>
            </div>
          </div>
        </div>

        {/* Timeframe buttons */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['live', '24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                timeframe === tf
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Stats Overview Row */}
      <div className="grid grid-cols-3 gap-3 my-3">
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Min:</span>
          <span className="font-mono text-sm font-bold text-white">{minVal} <span className="text-[10px] text-slate-500">{config.unit}</span></span>
        </div>
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Average:</span>
          <span className="font-mono text-sm font-bold text-cyan-300">{avgVal} <span className="text-[10px] text-slate-500">{config.unit}</span></span>
        </div>
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">Max:</span>
          <span className="font-mono text-sm font-bold text-white">{maxVal} <span className="text-[10px] text-slate-500">{config.unit}</span></span>
        </div>
      </div>

      {/* Main SVG Graph */}
      <div className="w-full relative flex-1 min-h-[220px] bg-slate-950/40 rounded-xl p-2 border border-slate-800/60 overflow-hidden">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No telemetry records available for this interval
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${selectedVital}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={config.color} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Target Normal Range Band */}
            <rect
              x={padding.left}
              y={getYCoord(config.normalHigh)}
              width={graphWidth}
              height={Math.abs(getYCoord(config.normalLow) - getYCoord(config.normalHigh))}
              fill="rgba(16, 185, 129, 0.06)"
              stroke="rgba(16, 185, 129, 0.2)"
              strokeDasharray="4 4"
            />

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
              const yVal = config.minY + frac * (config.maxY - config.minY);
              const y = getYCoord(yVal);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="rgba(56, 189, 248, 0.08)"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="rgba(148, 163, 184, 0.7)"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                  >
                    {Math.round(yVal)}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area Fill */}
            {areaD && <path d={areaD} fill={`url(#gradient-${selectedVital})`} />}

            {/* Primary Curve */}
            <path
              d={pathD}
              fill="none"
              stroke={config.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Secondary Curve (for Blood Pressure Diastolic) */}
            {secondaryPathD && (
              <path
                d={secondaryPathD}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            )}

            {/* Data Points */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoverIndex === idx ? 6 : 3.5}
                  fill={p.data.status === 'critical' ? '#ef4444' : p.data.status === 'warning' ? '#f59e0b' : config.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </g>
            ))}
          </svg>
        )}

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div
            className="absolute z-20 px-3 py-2 rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-xl backdrop-blur-md text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(points[hoverIndex].x / svgWidth) * 100}%`,
              top: `${(points[hoverIndex].y / svgHeight) * 100}%`,
            }}
          >
            <div className="text-[11px] text-slate-400 font-mono">
              {new Date(points[hoverIndex].data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
            </div>
            <div className="font-bold text-white text-sm font-mono mt-0.5">
              {config.getValue(points[hoverIndex].data)} {config.unit}
              {config.getSecondary && (
                <span className="text-blue-300 font-normal"> / {config.getSecondary(points[hoverIndex].data)}</span>
              )}
            </div>
            <div className={`text-[10px] font-semibold uppercase mt-0.5 ${
              points[hoverIndex].data.status === 'critical'
                ? 'text-rose-400'
                : points[hoverIndex].data.status === 'warning'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {points[hoverIndex].data.status} status
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
