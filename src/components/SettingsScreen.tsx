import React, { useState } from 'react';
import { getGmailComposeUrl } from '../services/emailAlert';

interface SettingsScreenProps {
  emergencyContact?: string;
  onUpdateEmergencyContact?: (newNumber: string) => void;
  onTestEmergencyAlert?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  emergencyContact = 'vivekchaurasiyax11@gmail.com',
  onUpdateEmergencyContact,
  onTestEmergencyAlert,
}) => {
  const [selectedLead, setSelectedLead] = useState('Lead II');
  const [sweepSpeed, setSweepSpeed] = useState('25 mm/s');
  const [gain, setGain] = useState('10 mm/mV');
  const [tachyThreshold, setTachyThreshold] = useState(140);
  const [bradyThreshold, setBradyThreshold] = useState(50);
  const [autoSyncEhr, setAutoSyncEhr] = useState(true);
  const [emergencyAutoPrompt, setEmergencyAutoPrompt] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactInput, setContactInput] = useState(emergencyContact);
  const [testSent, setTestSent] = useState(false);

  const handleSave = () => {
    if (onUpdateEmergencyContact && contactInput !== emergencyContact) {
      onUpdateEmergencyContact(contactInput);
    }
    setIsEditingContact(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTriggerTest = () => {
    setTestSent(true);
    if (onTestEmergencyAlert) {
      onTestEmergencyAlert();
    }
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div id="settings-screen-container" className="flex flex-col w-full gap-4 pb-28 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col gap-1 mt-1">
        <span className="font-sans text-[11px] font-bold text-[#006591] uppercase tracking-wider">
          System Configuration • CARDYCO
        </span>
        <h1 className="font-sans text-2xl font-bold text-[#131b2e] tracking-tight">
          Device & Telemetry Settings
        </h1>
        <p className="text-xs text-[#3f4850] font-medium leading-relaxed">
          Ambulatory Holter calibration, rhythm alert thresholds, Apollo/AIIMS EHR synchronization, and emergency contact protocol.
        </p>
      </div>

      {/* Device Hardware Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#cce5ff] text-[#006194] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">sensors</span>
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-[#131b2e]">CARDYCO IoT Patch V3</h3>
              <p className="text-xs text-[#3f4850]">Serial: CARDYCO-9884-TX • Firmware v2.14-IN</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#6ffbbe] text-[#002113] text-[10px] font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006947]"></span>
            Connected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f2f3ff] text-xs">
          <div className="flex flex-col bg-[#faf8ff] p-2 rounded-lg">
            <span className="text-[#3f4850] font-medium">Battery Capacity</span>
            <span className="font-mono text-sm font-bold text-[#006947]">98% (42h left)</span>
          </div>
          <div className="flex flex-col bg-[#faf8ff] p-2 rounded-lg">
            <span className="text-[#3f4850] font-medium">BLE Signal</span>
            <span className="font-mono text-sm font-bold text-[#006194]">-48 dBm (Optimal)</span>
          </div>
        </div>
      </div>

      {/* Telemetry Calibration Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-3">
        <h3 className="font-sans text-sm font-bold text-[#131b2e] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006194] text-[18px]">tune</span>
          <span>Ambulatory ECG Calibration</span>
        </h3>

        {/* Lead Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#3f4850]">Active Monitoring Lead</label>
          <div className="grid grid-cols-3 gap-2">
            {['Lead I', 'Lead II', 'Lead III'].map((lead) => (
              <button
                key={lead}
                type="button"
                onClick={() => setSelectedLead(lead)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedLead === lead
                    ? 'bg-[#006194] text-white shadow-sm'
                    : 'bg-[#eaedff] text-[#3f4850] hover:text-[#131b2e]'
                }`}
              >
                {lead}
              </button>
            ))}
          </div>
        </div>

        {/* Sweep speed & Gain */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3f4850]">Paper Sweep Speed</label>
            <select
              value={sweepSpeed}
              onChange={(e) => setSweepSpeed(e.target.value)}
              className="bg-[#f2f3ff] border border-[#e2e7ff] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#131b2e] focus:outline-none"
            >
              <option value="25 mm/s">25 mm/s (Standard)</option>
              <option value="50 mm/s">50 mm/s (Expanded)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3f4850]">Voltage Gain</label>
            <select
              value={gain}
              onChange={(e) => setGain(e.target.value)}
              className="bg-[#f2f3ff] border border-[#e2e7ff] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#131b2e] focus:outline-none"
            >
              <option value="5 mm/mV">5 mm/mV (0.5x)</option>
              <option value="10 mm/mV">10 mm/mV (1.0x)</option>
              <option value="20 mm/mV">20 mm/mV (2.0x)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Arrhythmia Alert Thresholds */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-3">
        <h3 className="font-sans text-sm font-bold text-[#131b2e] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">crisis_alert</span>
          <span>AI Arrhythmia Trigger Thresholds</span>
        </h3>

        {/* Tachycardia slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#3f4850]">Tachycardia Trigger Threshold</span>
            <span className="font-mono font-bold text-[#ba1a1a]">{tachyThreshold} BPM</span>
          </div>
          <input
            type="range"
            min={110}
            max={180}
            step={5}
            value={tachyThreshold}
            onChange={(e) => setTachyThreshold(Number(e.target.value))}
            className="w-full accent-[#ba1a1a] cursor-pointer"
          />
          <span className="text-[10px] text-[#3f4850]">
            Automatic alert email dispatched to <strong>{emergencyContact}</strong> when heart rate exceeds {tachyThreshold} BPM.
          </span>
        </div>

        {/* Bradycardia slider */}
        <div className="flex flex-col gap-1 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#3f4850]">Bradycardia Trigger Threshold</span>
            <span className="font-mono font-bold text-[#006591]">{bradyThreshold} BPM</span>
          </div>
          <input
            type="range"
            min={35}
            max={65}
            step={5}
            value={bradyThreshold}
            onChange={(e) => setBradyThreshold(Number(e.target.value))}
            className="w-full accent-[#006591] cursor-pointer"
          />
        </div>
      </div>

      {/* Emergency Protocol & Medical Provider */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] flex flex-col gap-3">
        <h3 className="font-sans text-sm font-bold text-[#131b2e] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006947] text-[18px]">
            local_hospital
          </span>
          <span>Medical Relay & Caregiver (India)</span>
        </h3>

        {/* EHR Auto Sync Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#131b2e]">Apollo Hospitals & AIIMS EHR Sync</span>
            <span className="text-[11px] text-[#3f4850]">
              Continuous telemetry encrypted transfer to Dr. Rajesh Sharma
            </span>
          </div>
          <input
            type="checkbox"
            checked={autoSyncEhr}
            onChange={(e) => setAutoSyncEhr(e.target.checked)}
            className="w-5 h-5 accent-[#006194] cursor-pointer rounded"
          />
        </div>

        {/* Emergency Prompt Toggle (112) */}
        <div className="flex items-center justify-between py-1 border-t border-[#f2f3ff]">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#131b2e]">Direct 112 Quick Action</span>
            <span className="text-[11px] text-[#3f4850]">
              Provide one-tap emergency call to National Emergency Response System (112)
            </span>
          </div>
          <input
            type="checkbox"
            checked={emergencyAutoPrompt}
            onChange={(e) => setEmergencyAutoPrompt(e.target.checked)}
            className="w-5 h-5 accent-[#ba1a1a] cursor-pointer rounded"
          />
        </div>

        {/* Emergency Contact Box */}
        <div className="flex flex-col gap-2 p-3 bg-[#faf8ff] rounded-xl border border-[#e2e7ff]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 flex-1 mr-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Emergency Alert Email
              </span>
              {!isEditingContact ? (
                <span className="font-mono text-xs sm:text-sm font-semibold text-[#131b2e] mt-0.5 truncate">
                  {emergencyContact}
                </span>
              ) : (
                <input
                  type="email"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder="e.g. vivekchaurasiyax11@gmail.com"
                  className="mt-1 font-mono text-xs sm:text-sm font-bold bg-white border border-[#006194] rounded px-2 py-1 text-slate-900 focus:outline-none w-full"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (isEditingContact) {
                  if (onUpdateEmergencyContact) onUpdateEmergencyContact(contactInput);
                  setIsEditingContact(false);
                } else {
                  setIsEditingContact(true);
                }
              }}
              className="text-xs font-bold text-[#006194] hover:underline cursor-pointer shrink-0"
            >
              {isEditingContact ? 'Done' : 'Edit'}
            </button>
          </div>

          <p className="text-[11px] text-slate-600 leading-snug">
            Whenever heart rate exceeds {tachyThreshold} BPM or Ventricular Tachycardia is detected, CARDYCO automatically dispatches an emergency telemetry email to <strong>{emergencyContact}</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/80">
            <button
              type="button"
              onClick={handleTriggerTest}
              className="px-3 py-1.5 rounded-lg bg-[#006194] hover:bg-[#004e77] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
              <span>Test Email Alert Now</span>
            </button>

            <a
              href={getGmailComposeUrl(
                emergencyContact,
                '🚨 CARDYCO EMERGENCY ALERT: Test Telemetry Ping',
                `CARDYCO Telemetry Monitor Test Alert.\nRecipient: ${emergencyContact}\nStatus: Signal Nominal.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#006194] text-xs font-bold flex items-center gap-1 border border-[#cce5ff] transition-all"
              title="Open pre-filled alert draft in Gmail web"
            >
              <span className="material-symbols-outlined text-[15px]">mail</span>
              <span>Open in Gmail</span>
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </a>

            {testSent && (
              <span className="text-[11px] font-bold text-[#006947] flex items-center gap-1 animate-fadeIn">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Dispatched!
              </span>
            )}
          </div>

          <div className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200/70 flex items-start gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#006194] shrink-0 mt-0.5">info</span>
            <span>
              <strong>Inbox Tip:</strong> Automated alert emails are dispatched to <strong>{emergencyContact}</strong>. If not visible in your Primary inbox, please check the <em>Spam</em>, <em>Updates</em>, or <em>Promotions</em> tab and select &quot;Report not spam&quot;.
            </span>
          </div>
        </div>
      </div>

      {/* Save action button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full h-12 bg-[#006194] hover:bg-[#007bb9] active:scale-[0.98] text-white rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">save</span>
        <span>{savedNotice ? 'Settings Saved Successfully!' : 'Save Calibration Settings'}</span>
      </button>
    </div>
  );
};
