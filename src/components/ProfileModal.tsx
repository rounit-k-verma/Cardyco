import React from 'react';
import { getGmailComposeUrl } from '../services/emailAlert';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyContact?: string;
  onCall112?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  emergencyContact = 'vivekchaurasiyax11@gmail.com',
  onCall112,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="profile-modal-content"
        className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-bold text-[#006591] uppercase tracking-wider">
            Patient Portal • CARDYCO
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#006194] text-white flex items-center justify-center font-bold text-xl ring-2 ring-[#006194]/30 shadow-sm">
            SS
          </div>
          <div className="flex flex-col">
            <h3 className="font-sans text-base font-bold text-[#131b2e]">Sunita Sharma</h3>
            <span className="text-xs text-[#3f4850]">UHID: #AP-82941-IN • Age: 58 Y</span>
            <span className="text-[11px] font-semibold text-[#006947] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006947]"></span>
              Active Ambulatory Monitoring
            </span>
          </div>
        </div>

        {/* Medical Demographics (Indian Doctors and Hospitals) */}
        <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#e2e7ff] flex flex-col gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#3f4850]">Assigned Cardiologist:</span>
            <span className="font-bold text-[#006194]">Dr. Rajesh Sharma, MD, DM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#3f4850]">Hospital Center:</span>
            <span className="font-bold text-[#131b2e]">Apollo Hospitals & Heart Centre</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#3f4850]">Monitoring Protocol:</span>
            <span className="font-bold text-[#131b2e]">CARDYCO 30-Day Ambulatory</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#3f4850]">Emergency Contact:</span>
            <span className="font-mono text-xs font-medium text-[#131b2e] truncate max-w-[180px]">{emergencyContact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#3f4850]">Assigned IoT Sensor:</span>
            <span className="font-mono font-bold text-[#131b2e]">CARDYCO-9884-TX (Patch V3)</span>
          </div>
        </div>

        {/* Emergency Call Shortcut (112) */}
        <div className="flex flex-col gap-2">
          <a
            href="tel:112"
            onClick={onCall112}
            className="w-full py-2.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-bold flex items-center justify-center gap-2 border border-[#ba1a1a]/20 hover:bg-[#ffdad6]/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Emergency Services (112)</span>
          </a>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={getGmailComposeUrl(
                emergencyContact,
                'URGENT: CARDYCO Emergency Medical Alert',
                'URGENT: CARDYCO patient telemetry alert.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 rounded-xl bg-[#f2f3ff] text-[#006194] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#cce5ff] hover:bg-[#e2e7ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">mail</span>
              <span>Open Gmail</span>
            </a>
            <a
              href={`mailto:${emergencyContact}?subject=${encodeURIComponent('URGENT: CARDYCO Emergency Medical Alert')}&body=${encodeURIComponent('URGENT: CARDYCO patient telemetry alert.')}`}
              className="py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>Mail App</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-center text-xs font-bold text-[#006194] hover:underline cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
