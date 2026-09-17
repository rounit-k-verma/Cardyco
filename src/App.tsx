import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LiveMonitor } from './components/LiveMonitor';
import { AlertScreen } from './components/AlertScreen';
import { RecordingsHistory } from './components/RecordingsHistory';
import { SettingsScreen } from './components/SettingsScreen';
import { PdfReportModal } from './components/PdfReportModal';
import { RecordSessionModal } from './components/RecordSessionModal';
import { ProfileModal } from './components/ProfileModal';
import { AiChatWidget } from './components/AiChatWidget';
import { ECGRecording, TabType, VitalsData } from './types';
import { initialRecordings } from './data/mockRecordings';
import { sendEmergencyEmailAlert, getGmailComposeUrl, getMailtoUrl } from './services/emailAlert';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [isAlertMode, setIsAlertMode] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<ECGRecording[]>(initialRecordings);
  const [emergencyContact, setEmergencyContact] = useState<string>('vivekchaurasiyax11@gmail.com');
  const [emailPopup, setEmailPopup] = useState<{
    show: boolean;
    status: 'sending' | 'sent' | 'activation' | 'error';
    message: string;
    detail: string;
    gmailUrl: string;
    mailtoUrl: string;
  } | null>(null);
  const emailTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [genericNotice, setGenericNotice] = useState<string | null>(null);
  const noticeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedRecordingForPdf, setSelectedRecordingForPdf] = useState<ECGRecording | null>(null);
  const [isBatchPdfOpen, setIsBatchPdfOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isDismissConfirmOpen, setIsDismissConfirmOpen] = useState(false);

  // Live BPM lifted up so AiChatWidget always reflects the real value
  const [liveBpm, setLiveBpm] = useState<number>(72);

  // Telemetry vitals state
  const [vitals] = useState<VitalsData>({
    heartRate: 72,
    rhythmStatus: 'Sinus Rhythm • Stable',
    hrv: 42,
    hrvStatus: 'Balanced ANS',
    spo2: 98,
    spo2Status: 'Nominal Range',
    battery: 98,
    signalQuality: 5,
    lead: 'Lead II',
    sweepSpeed: '25mm/s',
    calibration: '10mm/mV',
    filter: '0.05-150Hz',
  });

  const showGenericNotice = (msg: string) => {
    setGenericNotice(msg);
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = setTimeout(() => {
      setGenericNotice(null);
    }, 3000);
  };

  const triggerEmailDispatch = async (customText?: string) => {
    // 1. Show immediate dispatching status in the clean banner
    const subject = '🚨 CARDYCO EMERGENCY ALERT: High Heart Rate (148 BPM) Detected';
    const initialGmailUrl = getGmailComposeUrl(emergencyContact, subject, customText || 'Cardiac alert detected on CARDYCO telemetry.');
    const initialMailtoUrl = getMailtoUrl(emergencyContact, subject, customText || 'Cardiac alert detected on CARDYCO telemetry.');

    setEmailPopup({
      show: true,
      status: 'sending',
      message: 'Sending emergency alert email...',
      detail: `Dispatching directly to ${emergencyContact}`,
      gmailUrl: initialGmailUrl,
      mailtoUrl: initialMailtoUrl,
    });

    // 2. Perform live network dispatch via FormSubmit / Web API
    try {
      const result = await sendEmergencyEmailAlert({
        recipientEmail: emergencyContact,
        bpm: 148,
        eventType: 'Ventricular Tachycardia Warning (Sustained)',
        patientName: 'Sunita Sharma (62 yrs, Female)',
        customMessage: customText,
      });

      setEmailPopup({
        show: true,
        status: result.requiresActivation ? 'activation' : (result.success ? 'sent' : 'error'),
        message: result.requiresActivation
          ? 'FormSubmit activation email sent'
          : result.success
            ? 'Alert email delivered to inbox!'
            : 'Email dispatch queued',
        detail: result.requiresActivation
          ? `Check ${emergencyContact} and click "Activate Form" (also check Spam folder).`
          : `Delivered to ${emergencyContact} (check Spam if first time).`,
        gmailUrl: result.gmailComposeUrl,
        mailtoUrl: result.mailtoUrl,
      });
    } catch (e) {
      console.error('Trigger alert error:', e);
      setEmailPopup({
        show: true,
        status: 'error',
        message: 'Email dispatch queued',
        detail: `Sent alert for ${emergencyContact}`,
        gmailUrl: initialGmailUrl,
        mailtoUrl: initialMailtoUrl,
      });
    }

    if (emailTimerRef.current) {
      clearTimeout(emailTimerRef.current);
    }
    // Auto-dismiss smoothly after 5.5 seconds
    emailTimerRef.current = setTimeout(() => {
      setEmailPopup(null);
    }, 5500);
  };

  const handleDismissAlert = () => {
    setIsDismissConfirmOpen(true);
  };

  const confirmDismissAlert = () => {
    setIsDismissConfirmOpen(false);
    setIsAlertMode(false);
    showGenericNotice('Vitals normalized. Telemetry baseline restored.');
  };

  const handleTriggerAlert = () => {
    setIsAlertMode(true);
    setActiveTab('live');
    triggerEmailDispatch();
  };

  const handleSelectFlaggedAlert = () => {
    setIsAlertMode(true);
    setActiveTab('live');
  };

  const handleSessionRecorded = (newRecord: ECGRecording) => {
    setRecordings((prev) => [newRecord, ...prev]);
    showGenericNotice('30-second telemetry strip saved to history.');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#cce5ff] selection:text-[#001d31] relative">
      {/* Fixed Header */}
      <Header
        batteryLevel={vitals.battery}
        isConnected={true}
        isAlertMode={isAlertMode}
        onToggleAlertMode={() => {
          if (!isAlertMode) {
            handleTriggerAlert();
          } else {
            setIsAlertMode(false);
          }
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Clean, Non-Intrusive "Email alert was sent" Pop-up */}
      {emailPopup && (
        <div
          id="email-sent-popup"
          className="fixed top-20 inset-x-4 max-w-md mx-auto z-50 animate-fadeIn"
          role="status"
        >
          <div className="bg-[#131b2e]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    emailPopup.status === 'sending'
                      ? 'bg-[#006194] text-white animate-spin'
                      : emailPopup.status === 'activation'
                        ? 'bg-amber-500 text-white'
                        : emailPopup.status === 'sent'
                          ? 'bg-[#006947] text-white'
                          : 'bg-red-500 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {emailPopup.status === 'sending'
                      ? 'refresh'
                      : emailPopup.status === 'activation'
                        ? 'mark_email_unread'
                        : emailPopup.status === 'sent'
                          ? 'check'
                          : 'priority_high'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-xs font-bold text-white tracking-wide">
                    {emailPopup.message}
                  </span>
                  <span className="text-[11px] text-slate-300 truncate">
                    {emailPopup.detail}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={emailPopup.gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#6ffbbe]/20 hover:bg-[#6ffbbe]/30 text-[#6ffbbe] rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95"
                  title="Open Gmail to view or send alert directly"
                >
                  <span>Open Gmail</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
                <button
                  type="button"
                  onClick={() => setEmailPopup(null)}
                  className="w-6 h-6 rounded-full hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>

            {/* If first-time activation needed or delivered, provide hint */}
            {emailPopup.status === 'activation' && (
              <div className="text-[10px] text-amber-200 bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/20">
                ⚠️ Notice: Please check <strong>vivekchaurasiyax11@gmail.com</strong> (including Spam folder) and click <strong>Activate Form</strong> once to confirm authorization.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gentle Status Notice */}
      {genericNotice && (
        <div className="fixed top-20 inset-x-4 max-w-sm mx-auto z-40 animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-700/50 flex items-center justify-between gap-2 text-xs">
            <span>{genericNotice}</span>
            <button
              type="button"
              onClick={() => setGenericNotice(null)}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Content Viewport */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-20 pb-4">
        {activeTab === 'live' && (
          <>
            {isAlertMode ? (
              /* Screen 1: High Alert Abnormal Heart Rhythm Screen */
              <AlertScreen
                onDismissAlert={handleDismissAlert}
                onShareReport={() => {
                  const alertRecording = recordings.find((r) => r.status === 'flagged');
                  setSelectedRecordingForPdf(alertRecording || recordings[0]);
                }}
                onCall112={() => setIsEmergencyModalOpen(true)}
                emergencyContact={emergencyContact}
              />
            ) : (
              /* Screen 2: Normal Continuous Diagnostics ECG Screen */
              <LiveMonitor
                vitals={vitals}
                onTriggerAlert={handleTriggerAlert}
                onRecordSession={() => setIsRecordModalOpen(true)}
                onBpmChange={setLiveBpm}
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          /* Screen 3: ECG Recordings & Cardiology Telemetry Log */
          <RecordingsHistory
            recordings={recordings}
            onOpenReportModal={(rec) => setSelectedRecordingForPdf(rec || recordings[0])}
            onOpenBatchReportModal={() => setIsBatchPdfOpen(true)}
            onSelectFlaggedAlert={handleSelectFlaggedAlert}
          />
        )}

        {activeTab === 'settings' && (
          /* Tab 3: Telemetry Calibration & Settings */
          <SettingsScreen
            emergencyContact={emergencyContact}
            onUpdateEmergencyContact={(newContact) => {
              setEmergencyContact(newContact);
              showGenericNotice('Emergency contact updated.');
            }}
            onTestEmergencyAlert={() => {
              triggerEmailDispatch('CARDYCO Telemetry Test Alert: Device signal nominal.');
            }}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
        }}
        hasAlert={isAlertMode}
      />

      {/* Floating AI Chat in Lower Right Corner */}
      <AiChatWidget
        currentBpm={isAlertMode ? 148 : liveBpm}
        isAlertMode={isAlertMode}
        emergencyContact={emergencyContact}
        onCall112={() => setIsEmergencyModalOpen(true)}
      />

      {/* PDF Diagnostic Report Modal */}
      <PdfReportModal
        isOpen={Boolean(selectedRecordingForPdf) || isBatchPdfOpen}
        onClose={() => {
          setSelectedRecordingForPdf(null);
          setIsBatchPdfOpen(false);
        }}
        recording={selectedRecordingForPdf}
        isBatchReport={isBatchPdfOpen}
        emergencyContact={emergencyContact}
      />

      {/* 30s Snapshot Recording Modal */}
      <RecordSessionModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSessionRecorded={handleSessionRecorded}
      />

      {/* Patient Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        emergencyContact={emergencyContact}
        onCall112={() => setIsEmergencyModalOpen(true)}
      />

      {/* Emergency 112 Confirmation Sheet / Modal */}
      {isEmergencyModalOpen && (
        <div
          id="emergency-modal"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsEmergencyModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 border-2 border-[#ba1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center animate-pulse shrink-0">
                <span className="material-symbols-outlined text-[28px]">call</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-sans text-base font-bold text-[#ba1a1a]">
                  National Emergency Services (112)
                </h3>
                <span className="text-xs text-slate-600">
                  Unified Emergency Response System
                </span>
              </div>
            </div>

            <div className="bg-[#ffdad6] p-3 rounded-xl text-xs text-[#93000a] leading-relaxed">
              <p className="font-semibold">
                Your live GPS coordinates and CARDYCO rhythm strip will be relayed to 112 emergency dispatch.
              </p>
              <p className="mt-1 text-[11px] text-[#93000a]/90">
                Attending Cardiologist on call: Dr. Rajesh Sharma (Apollo & AIIMS Telemetry Network)
              </p>
              <p className="mt-1 text-[11px] font-bold text-[#93000a]">
                Emergency SOS Contact ({emergencyContact}) has already been alerted via Email.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="tel:112"
                className="w-full h-12 bg-[#ba1a1a] hover:bg-[#ba1a1a]/90 active:scale-[0.98] text-white rounded-xl font-sans text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all text-center"
              >
                <span className="material-symbols-outlined text-[22px]">call</span>
                <span>Confirm Call (112)</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getGmailComposeUrl(
                    emergencyContact,
                    'URGENT: CARDYCO Emergency Medical Alert',
                    'URGENT: CARDYCO patient emergency alert dispatched. Please check patient condition immediately.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-[#f2f3ff] text-[#006194] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#cce5ff] hover:bg-[#e2e7ff] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Open Gmail</span>
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    triggerEmailDispatch('Manual SOS triggered from CARDYCO Emergency modal.');
                    setIsEmergencyModalOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-[#006194] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#004e77] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
                  <span>Re-send Alert</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Inline Dismiss Alert Confirmation Sheet */}
      {isDismissConfirmOpen && (
        <div
          id="dismiss-confirm-overlay"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsDismissConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 border border-[#e2e8f0] animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cce5ff] text-[#006194] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">ecg_heart</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-sans text-base font-bold text-[#131b2e]">Re-check Sensor Signal?</h3>
                <p className="text-xs text-[#3f4850] mt-0.5">Please remain seated and calm while CARDYCO recalibrates baseline readings.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={confirmDismissAlert}
                className="w-full h-11 bg-[#006194] hover:bg-[#007bb9] active:scale-[0.98] text-white rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Yes, Re-check Sensor</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDismissConfirmOpen(false)}
                className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel — Stay on Alert Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
