import React, { useState } from 'react';
import { getGmailComposeUrl } from '../services/emailAlert';

interface AlertScreenProps {
  onDismissAlert: () => void;
  onShareReport: () => void;
  onCall112: () => void;
  emergencyContact?: string;
}

export const AlertScreen: React.FC<AlertScreenProps> = ({
  onDismissAlert,
  onShareReport,
  onCall112,
  emergencyContact = 'vivekchaurasiyax11@gmail.com',
}) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleShareClick = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      onShareReport();
      setTimeout(() => {
        setTransmitted(false);
      }, 4000);
    }, 1200);
  };

  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div id="alert-screen-container" className="flex flex-col w-full gap-4 pb-24 animate-fadeIn">
      {/* High Alert Announcement Banner */}
      <div
        id="alert-banner"
        className="w-full bg-[#ffdad6] text-[#93000a] rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col gap-1 border border-[#ba1a1a]/20"
      >
        <div className="flex items-start gap-3 relative z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ba1a1a] text-white shrink-0 shadow-sm animate-pulse animate-pulseGlow">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-sans text-lg tracking-tight text-[#93000a] font-bold">
                Abnormal Heart Rhythm
              </span>
              <span className="bg-[#ba1a1a] text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                High Alert
              </span>
            </div>
            <p className="text-sm text-[#93000a]/90 mt-1 font-medium leading-snug">
              Sustained Ventricular Tachycardia tendency detected at{' '}
              <strong className="font-bold">148 BPM</strong> at {currentTimeStr}.
            </p>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#ba1a1a]/10 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Real-Time Abnormal Snapshot Card */}
      <div
        id="anomaly-snapshot-card"
        className="w-full bg-white rounded-xl p-4 shadow-md flex flex-col gap-3 border border-[#e2e8f0]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
            <span className="font-sans text-[11px] font-bold text-[#3f4850] uppercase tracking-wider">
              Live Anomaly Capture
            </span>
          </div>
          <span className="font-mono text-sm text-[#3f4850] font-semibold">Lead II • 25mm/s</span>
        </div>

        {/* Vital Metric Snapshot */}
        <div className="flex items-baseline justify-between bg-[#f2f3ff] px-4 py-2.5 rounded-lg border border-[#e2e7ff]">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-4xl sm:text-5xl text-[#ba1a1a] font-bold tracking-tight">
              148
            </span>
            <span className="font-sans text-sm text-[#ba1a1a] font-semibold">BPM</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full border border-[#ba1a1a]/20">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-sans text-[11px] font-bold">Critical High</span>
          </div>
        </div>

        {/* Flagged ECG Waveform Snippet */}
        <div className="relative w-full h-36 bg-slate-950 rounded-lg overflow-hidden p-2.5 flex flex-col justify-between border border-slate-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none"></div>

          <div className="absolute inset-y-0 right-3 w-40 bg-[#ba1a1a]/25 backdrop-blur-[0.5px] border-l border-[#ef4444]/60 flex items-start justify-end p-1.5 pointer-events-none">
            <span className="bg-[#ba1a1a] text-white font-sans text-[10px] px-1.5 py-0.5 rounded tracking-wide font-bold shadow-sm">
              Flagged Zone
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-400 z-10 font-mono text-[11px]">
            <span>10mm/mV • 0.05-150Hz</span>
            <span className="text-[#ffdad6] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span> Telemetry
              Sync Active
            </span>
          </div>

          <svg
            className="w-full h-20 text-[#39b8fd] z-10"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 340 70"
          >
            <path
              d="M0,35 L20,35 L24,30 L28,42 L32,18 L36,54 L40,35 L60,35 L64,31 L68,41 L72,19 L76,52 L80,35 L105,35 L110,32 L114,40 L118,20 L122,50 L126,35 L145,35"
              stroke="#38bdf8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M145,35 L150,12 L156,58 L163,8 L170,62 L178,10 L186,60 L194,9 L202,61 L210,11 L218,63 L226,10 L234,60 L242,12 L250,62 L258,9 L266,59 L274,11 L282,62 L290,10 L298,60 L306,12 L314,61 L322,10 L330,62 L340,35"
              stroke="#ef4444"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
            />
          </svg>

          <div className="flex justify-between items-center text-slate-400 z-10 font-mono text-[11px]">
            <span>T: 00:32s</span>
            <span className="text-amber-400 font-semibold">QRS Width: 138ms</span>
          </div>
        </div>
      </div>

      {/* Doctor / Caregiver Context (Indian Cardiologist) */}
      <div
        id="doctor-context-card"
        className="w-full bg-[#f2f3ff] rounded-xl p-4 flex items-center justify-between shadow-sm border border-[#e2e7ff]"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#006194] text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-white">
            DR
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-bold text-[#131b2e]">
              Dr. Rajesh Sharma, MD, DM
            </span>
            <span className="text-xs text-[#3f4850] font-medium">
              Senior Consultant Cardiologist (Apollo & AIIMS)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#6ffbbe] text-[#002113] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
          Online
        </div>
      </div>

      {/* AI First-Aid Advice Section */}
      <div
        id="ai-guidance-card"
        className="w-full bg-white rounded-xl p-4 shadow-md flex flex-col gap-3 border border-[#e2e8f0]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#006194] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </div>
          <div>
            <h3 className="font-sans text-base text-[#131b2e] font-bold">Immediate AI Guidance</h3>
            <p className="text-xs text-[#3f4850]">
              Follow these calming steps right away while remaining calm.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]/60">
            <div className="w-7 h-7 rounded-full bg-[#006194] text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-bold text-[#131b2e]">
                Sit down or recline immediately
              </span>
              <span className="text-xs text-[#3f4850] leading-relaxed">
                Do not stand, walk, or perform sudden movements. Let your muscles relax fully.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]/60">
            <div className="w-7 h-7 rounded-full bg-[#006194] text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-bold text-[#131b2e]">
                Take slow, deep breaths (Pranayama)
              </span>
              <span className="text-xs text-[#3f4850] leading-relaxed">
                Inhale gently through nose for 4s, exhale slowly for 6s to stimulate your vagal
                nerve.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]/60">
            <div className="w-7 h-7 rounded-full bg-[#006194] text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-bold text-[#131b2e]">
                Loosen tight clothing around neck & chest
              </span>
              <span className="text-xs text-[#3f4850] leading-relaxed">
                Unbutton collars or loosen waistbands to ensure unhindered airflow.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]/60">
            <div className="w-7 h-7 rounded-full bg-[#006194] text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">
              4
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-sm font-bold text-[#131b2e]">
                Keep CARDYCO sensor patch pressed against chest
              </span>
              <span className="text-xs text-[#3f4850] leading-relaxed">
                Maintain firm, steady skin contact so telemetry logging continues uninterrupted.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f3ff] border border-[#e2e7ff]/60">
            <div className="w-7 h-7 rounded-full bg-[#006194] text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">
              5
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-sm font-bold text-[#131b2e]">
                  Emergency contact notified
                </span>
                <a
                  href={getGmailComposeUrl(
                    emergencyContact,
                    '🚨 CARDYCO EMERGENCY ALERT: High Heart Rate (148 BPM)',
                    'CARDYCO emergency telemetry alert dispatched to your inbox.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded bg-white text-[#006194] text-[11px] font-bold border border-[#cce5ff] hover:bg-[#e2e7ff] transition-colors flex items-center gap-1"
                >
                  <span>Open Gmail</span>
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              </div>
              <span className="text-xs text-[#3f4850] leading-relaxed mt-0.5">
                Automated email alert was dispatched to <strong>{emergencyContact}</strong>. Dial 112 if dizziness or severe chest pain persists.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Relay Card (Indian Institution) */}
      <div
        id="hospital-relay-card"
        className="w-full bg-white rounded-xl p-4 shadow-md flex items-center gap-3.5 border border-[#e2e8f0]"
      >
        <div className="w-16 h-16 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[32px]">local_hospital</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-sans text-[11px] text-[#006591] font-bold uppercase tracking-wider">
            Automated Telemetry Relay
          </span>
          <span className="font-sans text-base font-bold text-[#131b2e] truncate">
            Apollo Hospitals & Heart Institute
          </span>
          <span className="text-xs text-[#3f4850] mt-0.5 leading-snug">
            AIIMS Telemetry Network • Encrypted direct transmission ready for Dr. Rajesh Sharma.
          </span>
        </div>
      </div>

      {/* Action CTA Buttons with Emergency 112 */}
      <div className="flex flex-col gap-2.5 mt-1">
        {/* Call 112 Direct Primary Urgent Action */}
        <button
          id="btn-call-112"
          type="button"
          onClick={onCall112}
          className="w-full h-14 rounded-lg bg-[#ba1a1a] hover:bg-[#ba1a1a]/90 active:scale-[0.98] text-white flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer font-sans text-lg font-bold tracking-wide"
        >
          <span className="material-symbols-outlined text-[26px]">call</span>
          <span>Call Emergency Services (112)</span>
        </button>

        {/* Share to Doctor PDF Transmission */}
        <button
          id="shareReportBtn"
          type="button"
          onClick={handleShareClick}
          disabled={isTransmitting}
          className={`w-full h-12 rounded-lg flex items-center justify-center gap-2 shadow-sm font-sans text-base font-bold transition-all cursor-pointer ${
            transmitted
              ? 'bg-[#006947] text-white'
              : 'bg-[#006194] hover:bg-[#007bb9] active:scale-[0.98] text-white'
          }`}
        >
          {isTransmitting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
              <span>Generating & Transmitting PDF...</span>
            </>
          ) : transmitted ? (
            <>
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
              <span>Transmitted to Dr. Rajesh Sharma!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
              <span>Share Telemetry to Dr. Rajesh Sharma (PDF)</span>
            </>
          )}
        </button>
      </div>

      {/* False Alarm / Calm Dismiss Link */}
      <div className="flex flex-col items-center justify-center pt-1 pb-2">
        <button
          id="dismissAlertBtn"
          type="button"
          onClick={onDismissAlert}
          className="text-[#3f4850] hover:text-[#131b2e] text-sm font-semibold underline underline-offset-4 decoration-[#bfc7d2] py-2 px-4 transition-colors cursor-pointer"
        >
          I feel fine (False Alarm / Re-check)
        </button>
        <span className="text-xs text-[#3f4850]/80 mt-0.5">
          CARDYCO telemetry will recalibrate baseline readings
        </span>
      </div>
    </div>
  );
};
