import React, { useEffect, useRef, useState } from 'react';
import { VitalsData } from '../types';

interface LiveMonitorProps {
  vitals: VitalsData;
  onTriggerAlert: () => void;
  onRecordSession: () => void;
  isRecordingSession?: boolean;
  onBpmChange?: (bpm: number) => void;
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({
  vitals,
  onTriggerAlert,
  onRecordSession,
  isRecordingSession = false,
  onBpmChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGCircleElement>(null);

  const [currentBpm, setCurrentBpm] = useState<number>(vitals.heartRate);
  const [bpmAnimKey, setBpmAnimKey] = useState<number>(0); // incremented to retrigger CSS animation

  // Animate the ECG sweep curtain across the canvas
  useEffect(() => {
    let animationFrameId: number;
    let currentX = 0;
    const speed = 1.6;

    const animateTrace = () => {
      if (containerRef.current && curtainRef.current) {
        const width = containerRef.current.clientWidth || 360;
        currentX = (currentX + speed) % width;
        curtainRef.current.style.left = `${currentX}px`;

        if (headRef.current) {
          const svgX = (currentX / width) * 500;
          headRef.current.setAttribute('cx', svgX.toString());
        }
      }
      animationFrameId = requestAnimationFrame(animateTrace);
    };

    animationFrameId = requestAnimationFrame(animateTrace);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Subtle natural physiological variation in heart rate (70 - 74)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBpm((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const nextVal = prev + delta;
        const clamped = nextVal < 69 ? 70 : nextVal > 75 ? 74 : nextVal;
        setBpmAnimKey((k) => k + 1); // trigger CSS tick animation
        onBpmChange?.(clamped);
        return clamped;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [onBpmChange]);

  return (
    <div id="live-monitor-container" className="flex flex-col w-full gap-4 pb-24 animate-fadeIn">
      {/* Telemetry Calibration & Lead Configuration Ribbon */}
      <section
        id="telemetry-ribbon"
        className="w-full bg-[#f2f3ff] rounded-xl p-2.5 shadow-sm flex items-center justify-between border border-[#e2e7ff]"
      >
        <div className="flex items-center gap-2 text-[#3f4850] min-w-0">
          <span className="material-symbols-outlined text-[#006194] text-[18px] shrink-0">
            vital_signs
          </span>
          <span className="font-mono text-xs font-semibold tracking-tight text-[#131b2e] truncate">
            {vitals.lead} • {vitals.sweepSpeed} • {vitals.calibration} • {vitals.filter}
          </span>
        </div>

        {/* Signal Quality Bar Group */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          <span className="font-sans text-[10px] font-bold text-[#006947] tracking-wider uppercase">
            SIGNAL {vitals.signalQuality}/5
          </span>
          <div className="flex items-end gap-[2.5px] h-3.5" title="Signal: Optimal 5/5">
            <span className="w-[3px] h-1.5 bg-[#006947] rounded-full"></span>
            <span className="w-[3px] h-2 bg-[#006947] rounded-full"></span>
            <span className="w-[3px] h-2.5 bg-[#006947] rounded-full"></span>
            <span className="w-[3px] h-3 bg-[#006947] rounded-full"></span>
            <span className="w-[3px] h-3.5 bg-[#006947] rounded-full"></span>
          </div>
        </div>
      </section>

      {/* Real-Time ECG Millimeter Telemetry Monitor */}
      <section
        id="ecg-monitor-card"
        className="w-full bg-white rounded-xl shadow-md overflow-hidden relative border border-[#e2e8f0]"
      >
        {/* Overlay Lead Telemetry & Real-Time Sweep Specs */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 z-10 relative bg-white/90 backdrop-blur-[2px]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#001d31] font-mono text-[11px] font-bold uppercase tracking-wider">
              LIVE II
            </span>
            <span className="text-[11px] font-semibold text-[#3f4850]">Continuous Diagnostics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#006194] animate-ping"></span>
            <span className="font-mono text-xs text-[#006194] font-bold">Sweep 25 mm/s</span>
          </div>
        </div>

        {/* ECG Paper Surface with Inset Millimeter Grid */}
        <div
          ref={containerRef}
          id="ecg-canvas-container"
          className="relative w-full aspect-[5/3] overflow-hidden select-none bg-[#faf8ff]"
        >
          {/* Authentic Pink / Cyan Medical Grid Layer via SVG Pattern */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* 1mm Minor Grid (Pink-tinted clinical line) */}
              <pattern id="ecg-grid-minor" width="8" height="8" patternUnits="userSpaceOnUse">
                <path
                  d="M 8 0 L 0 0 0 8"
                  fill="none"
                  stroke="rgba(244, 114, 182, 0.2)"
                  strokeWidth="0.75"
                />
              </pattern>
              {/* 5mm Major Grid (Cyan-tinted baseline rule) */}
              <pattern id="ecg-grid-major" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="url(#ecg-grid-minor)" />
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(14, 165, 233, 0.24)"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="rgba(250, 248, 255, 0.7)" />
            <rect width="100%" height="100%" fill="url(#ecg-grid-major)" />
          </svg>

          {/* Amplitude Calibrator Markings (Left) */}
          <div className="absolute left-2.5 top-2.5 bottom-6 flex flex-col justify-between pointer-events-none font-mono text-[10px] text-[#3f4850]/90 z-10 leading-none font-semibold">
            <span>+1.0 mV</span>
            <span className="text-[#006194] font-bold">0.0 mV</span>
            <span>-0.5 mV</span>
          </div>

          {/* Real-Time Waveform Strip */}
          <svg
            className="absolute inset-0 w-full h-full"
            id="ecg-trace-svg"
            preserveAspectRatio="none"
            viewBox="0 0 500 220"
          >
            <defs>
              <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Reference Path: P-Q-R-S-T complexes across 4 seconds */}
            <path
              className="text-[#006194]"
              d="
                M 0 120
                L 15 120 C 20 115, 25 115, 30 120 L 45 120
                L 48 126 L 54 35 L 60 148 L 65 120
                L 75 120 C 85 110, 95 110, 105 120 L 125 120
                
                L 140 120 C 145 115, 150 115, 155 120 L 170 120
                L 173 126 L 179 35 L 185 148 L 190 120
                L 200 120 C 210 110, 220 110, 230 120 L 250 120

                L 265 120 C 270 115, 275 115, 280 120 L 295 120
                L 298 126 L 304 35 L 310 148 L 315 120
                L 325 120 C 335 110, 345 110, 355 120 L 375 120

                L 390 120 C 395 115, 400 115, 405 120 L 420 120
                L 423 126 L 429 35 L 435 148 L 440 120
                L 450 120 C 460 110, 470 110, 480 120 L 500 120
              "
              fill="none"
              filter="url(#cyan-glow)"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
            />

            {/* Live Trace Sweep Head Marker */}
            <circle
              ref={headRef}
              id="live-ecg-head"
              cx="304"
              cy="35"
              r="4.5"
              className="fill-[#39b8fd] stroke-white stroke-2 shadow-sm"
            />
          </svg>

          {/* Sweep Shutter Bar (Simulated Active Phosphor Decay) */}
          <div
            ref={curtainRef}
            id="sweep-curtain"
            className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-[#faf8ff]/40 to-[#faf8ff]/85 pointer-events-none"
            style={{ left: '304px' }}
          />

          {/* Time Axis Scale Inscription (0.0s to 4.0s) */}
          <div className="absolute bottom-1.5 left-10 right-4 flex justify-between font-mono text-[10px] text-[#3f4850]/90 font-medium pointer-events-none">
            <span>0.0s</span>
            <span>1.0s</span>
            <span>2.0s</span>
            <span>3.0s</span>
            <span>4.0s</span>
          </div>
        </div>
      </section>

      {/* Primary Biometrics Bento Section */}
      <section id="biometrics-bento" className="grid grid-cols-2 gap-3 w-full">
        {/* Heart Rate Hero Card */}
        <div
          id="card-heart-rate"
          className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-[#e2e8f0] flex items-center justify-between"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[11px] font-bold uppercase text-[#3f4850] tracking-wider">
                Heart Rate
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#c9e6ff] text-[#001e2f] text-[10px] font-bold">
                Normal Resting
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                id="numeric-hr"
                key={bpmAnimKey}
                className="font-mono text-5xl text-[#131b2e] tracking-tight font-bold animate-bpmTick"
              >
                {currentBpm}
              </span>
              <span className="font-sans text-sm text-[#3f4850] font-semibold">BPM</span>
            </div>

            <p className="text-xs text-[#006591] font-semibold flex items-center gap-1.5 mt-1">
              <span
                className="material-symbols-outlined text-[16px] text-[#006947]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Sinus Rhythm • Stable
            </p>
          </div>

          {/* Animated Heart Rate Pulse Orb Indicator */}
          <div className="relative flex items-center justify-center w-16 h-16 shrink-0 mr-1">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#ffdad6] opacity-60 animate-ping" />
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#ffdad6] shadow-sm">
              <span
                className="material-symbols-outlined text-[#ba1a1a] text-[30px] animate-heartbeat"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
          </div>
        </div>

        {/* Metric Tile 1: HRV (RMSSD) */}
        <div
          id="card-hrv"
          className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-bold uppercase text-[#3f4850] tracking-wider">
              HRV (RMSSD)
            </span>
            <span className="material-symbols-outlined text-[#006194] text-[18px]">graphic_eq</span>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl text-[#131b2e] font-bold">{vitals.hrv}</span>
            <span className="text-xs text-[#3f4850] font-medium">ms</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
            <span className="text-xs text-[#006947] font-semibold">{vitals.hrvStatus}</span>
          </div>
        </div>

        {/* Metric Tile 2: Blood Oxygen (SpO2) */}
        <div
          id="card-spo2"
          className="bg-white rounded-xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-bold uppercase text-[#3f4850] tracking-wider">
              SpO2 Oxygen
            </span>
            <span className="material-symbols-outlined text-[#006194] text-[18px]">bloodtype</span>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl text-[#131b2e] font-bold">{vitals.spo2}</span>
            <span className="text-xs text-[#3f4850] font-medium">%</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
            <span className="text-xs text-[#006947] font-semibold">{vitals.spo2Status}</span>
          </div>
        </div>
      </section>

      {/* Automated Clinical AI Guardian Card */}
      <section
        id="card-ai-guardian"
        className="w-full bg-[#6ffbbe] rounded-xl p-4 shadow-sm border border-[#4edea3]/40 flex items-start gap-3.5"
      >
        <div className="w-10 h-10 rounded-full bg-[#006947] flex items-center justify-center shrink-0 text-white shadow-sm">
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-base text-[#002113] font-bold">AI Monitor: Normal</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#00855b] text-[#f5fff6] text-[10px] font-bold tracking-wider uppercase">
              Active
            </span>
          </div>
          <p className="text-xs text-[#005236] mt-1 leading-relaxed font-medium">
            AI Vitals engine is actively monitoring rhythm continuity. No arrhythmias or ectopic
            beats detected over the last 15 minutes.
          </p>
        </div>
      </section>

      {/* Clinical Snapshot Quick Action Buttons */}
      <section id="record-action-section" className="w-full flex flex-col gap-2.5 pt-1">
        <button
          id="record-session-btn"
          type="button"
          onClick={onRecordSession}
          disabled={isRecordingSession}
          className="w-full h-12 bg-[#006194] hover:bg-[#007bb9] active:scale-[0.98] text-white rounded-lg font-sans text-base font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
        >
          <span className="material-symbols-outlined text-[22px]">timer</span>
          <span>Record Session (30s Snapshot)</span>
        </button>

        {/* Arrhythmia Simulation Alert Trigger Bar */}
        <button
          id="btn-simulate-vt"
          type="button"
          onClick={onTriggerAlert}
          className="w-full py-2 px-3 rounded-lg border border-[#ffdad6] bg-[#faf8ff] hover:bg-[#ffdad6]/40 text-[#93000a] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">crisis_alert</span>
          <span>Simulate Abnormal Heart Rhythm (High Alert Screen)</span>
        </button>
      </section>
    </div>
  );
};
