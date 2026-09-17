import React, { useState } from 'react';
import { ECGRecording } from '../types';
import { sendEmergencyEmailAlert, getGmailComposeUrl } from '../services/emailAlert';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  recording?: ECGRecording | null;
  isBatchReport?: boolean;
  emergencyContact?: string;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  recording,
  isBatchReport = false,
  emergencyContact = 'vivekchaurasiyax11@gmail.com',
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  const handleEmailReport = async () => {
    setEmailing(true);
    const summary = `CARDYCO CLINICAL TELEMETRY REPORT SUMMARY\nPatient: Sunita Sharma (62 yrs)\nRhythm: ${recording?.statusLabel || 'Batch Telemetry Analysis'}\nPeak HR: ${recording?.bpm || 148} BPM\nAttending: Dr. Rajesh Sharma (Apollo & AIIMS Network)\nStatus: Encrypted Telemetry Diagnostic Verified.`;
    await sendEmergencyEmailAlert({
      recipientEmail: emergencyContact,
      bpm: recording?.bpm || 148,
      eventType: recording?.statusLabel || 'Clinical Telemetry Report Export',
      customMessage: summary,
    });
    setEmailing(false);
    setEmailSuccess(true);
    setTimeout(() => setEmailSuccess(false), 3500);
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id="pdf-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="pdf-modal-content"
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-[22px]">
              picture_as_pdf
            </span>
            <span className="font-sans text-sm font-bold text-[#131b2e]">
              {isBatchReport
                ? 'Clinical Visit Package (12-Page Dossier)'
                : `CARDYCO Diagnostic Report • ${recording?.lead || 'Lead II'}`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Paper Document Preview */}
        <div className="p-4 sm:p-6 bg-[#faf8ff] flex flex-col gap-4">
          {/* Simulated Printed Sheet */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 text-xs font-sans text-slate-800">
            {/* Document Clinic Header (Indian Hospital & Lab) */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006194] text-[20px]">
                    local_hospital
                  </span>
                  <span className="font-bold text-sm text-[#006194]">
                    Apollo Hospitals & Heart Centre, New Delhi
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Department of Cardiac Electrophysiology & AIIMS Telemetry Network
                </span>
                <span className="text-[10px] text-slate-400">
                  NABL Accredited Cardiac Holter Lab • ICMR Reg. #DL-NABL-88491
                </span>
              </div>
              <div className="text-right flex flex-col">
                <span className="font-mono text-[10px] text-slate-400">DOC #IND-CARDYCO-9884</span>
                <span className="font-semibold text-[10px] text-slate-700">
                  {recording ? `${recording.date}` : currentDateFormatted}
                </span>
              </div>
            </div>

            {/* Patient & Device Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Patient</span>
                <span className="font-bold text-slate-900">Sunita Sharma</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">UHID / MRN</span>
                <span className="font-mono font-bold text-slate-800">#AP-82941-IN</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Age / Sex</span>
                <span className="font-medium text-slate-800">58 Y / Female</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Attending Cardiologist</span>
                <span className="font-bold text-[#006194]">Dr. Rajesh Sharma, MD, DM</span>
              </div>
            </div>

            {/* Emergency SOS Contact Information */}
            <div className="flex items-center justify-between p-2 rounded bg-[#fff0f0] border border-[#ffdad6] text-[11px]">
              <div className="flex items-center gap-1.5 text-[#93000a] min-w-0">
                <span className="material-symbols-outlined text-[15px]">mail</span>
                <span className="truncate">Emergency SOS Alert Email: <strong className="font-mono">{emergencyContact}</strong></span>
              </div>
              <span className="text-[10px] font-semibold text-[#006947] bg-[#6ffbbe]/40 px-1.5 py-0.5 rounded shrink-0">
                Auto-Alert Active
              </span>
            </div>

            {/* Diagnostic Impression */}
            <div className="flex flex-col gap-1 bg-[#f2f3ff] p-3 rounded-lg border border-[#cce5ff]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#001d31] uppercase tracking-wider">
                  Diagnostic Telemetry Finding
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    recording?.status === 'flagged' || isBatchReport
                      ? 'bg-[#ffdad6] text-[#93000a]'
                      : 'bg-[#6ffbbe] text-[#002113]'
                  }`}
                >
                  {recording?.statusLabel || 'TACHYCARDIA ALERT - MONITORED'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {recording?.status === 'flagged'
                  ? `Abrupt onset of rapid ventricular rhythm reaching 148 BPM peak. Sustained for 32 seconds meeting automated Ventricular Tachycardia protocol threshold. Automated email alert dispatched to emergency contact (${emergencyContact}) and encrypted telemetry transmitted to Dr. Rajesh Sharma.`
                  : 'Diagnostic continuous rhythm demonstrates normal sinus rhythm with physiologic rate variation. Stable ST segments and baseline continuity.'}
              </p>
            </div>

            {/* Simulated ECG Paper Strip */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Rhythm Strip: Lead II (25 mm/s, 10 mm/mV) • CARDYCO Patch V3</span>
                <span>F: 0.05-150 Hz</span>
              </div>
              <div className="relative w-full h-24 bg-[#faf8ff] rounded-lg overflow-hidden border border-slate-300">
                {/* SVG grid */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <pattern id="modal-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path
                        d="M 8 0 L 0 0 0 8"
                        fill="none"
                        stroke="rgba(244, 114, 182, 0.25)"
                        strokeWidth="0.75"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#modal-grid)" />
                </svg>

                <svg
                  className="w-full h-full absolute inset-0 fill-none"
                  preserveAspectRatio="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 320 40"
                >
                  <path
                    d={
                      recording?.pathData ||
                      'M0,20 L15,20 L18,17 L21,20 L28,20 L30,4 L33,36 L36,16 L38,20 L44,14 L50,20 L65,20 L68,17 L71,20 L77,4 L80,36 L83,16 L85,20 L91,14 L97,20 L112,20 L115,17 L118,20 L124,4 L127,36 L130,16 L132,20 L138,14 L144,20 L160,20 L163,17 L166,20 L172,4 L175,36 L178,16 L180,20 L186,14 L192,20 L208,20 L211,17 L214,20 L220,4 L223,36 L226,16 L228,20 L234,14 L240,20 L256,20 L259,17 L262,20 L268,4 L271,36 L274,16 L276,20 L282,14 L288,20 L305,20 L308,17 L311,20 L317,4 L320,20'
                    }
                    stroke={recording?.status === 'flagged' ? '#ba1a1a' : '#006194'}
                  />
                </svg>
              </div>
            </div>

            {/* Caliper Intervals Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[9px]">HR PEAK</span>
                <span className="font-bold text-slate-900">{recording?.bpm || 148} BPM</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">PR INTERVAL</span>
                <span className="font-bold text-slate-900">118 ms</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">QRS WIDTH</span>
                <span className="font-bold text-slate-900">
                  {recording?.status === 'flagged' ? '138 ms (Wide)' : '86 ms (Normal)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">QTC CALC</span>
                <span className="font-bold text-slate-900">412 ms</span>
              </div>
            </div>

            {/* Signature row (Indian Doctor) */}
            <div className="flex justify-between items-end border-t border-slate-200 pt-3">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400">ELECTRONICALLY SIGNED BY:</span>
                <span className="font-serif italic font-bold text-slate-800 text-sm">
                  Dr. Rajesh Sharma, MD, DM (Cardiology), FACC
                </span>
                <span className="text-[9px] text-slate-500">
                  Senior Consultant Interventional Cardiologist • Reg #MCI-29481
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified CARDYCO Telemetry
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            type="button"
            onClick={handleEmailReport}
            disabled={emailing}
            className="px-4 py-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#006194] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#cce5ff] transition-all cursor-pointer active:scale-95"
            title={`Email report directly to ${emergencyContact}`}
          >
            {emailing ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                <span>Sending to {emergencyContact}...</span>
              </>
            ) : emailSuccess ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-[#006947]">check_circle</span>
                <span>Dispatched to {emergencyContact}!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
                <span>Email Report to Contact</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2.5 rounded-xl bg-[#006194] hover:bg-[#007bb9] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            {downloading ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                <span>Generating Standardized PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Clinical PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
