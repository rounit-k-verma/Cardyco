import React, { useEffect, useState } from 'react';
import { ECGRecording } from '../types';
import { getRelativeDate } from '../data/mockRecordings';

interface RecordSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionRecorded: (newRecord: ECGRecording) => void;
}

export const RecordSessionModal: React.FC<RecordSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionRecorded,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(30);
      setIsCompleted(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndClose = () => {
    const newRecord: ECGRecording = {
      id: `rec-manual-${Date.now()}`,
      date: getRelativeDate(0),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bpm: 72,
      bpmType: 'REST',
      lead: 'Lead II Snapshot',
      duration: '30s',
      status: 'normal',
      statusLabel: 'NORMAL SINUS RHYTHM',
      rhythmDetail: 'QRS: 88ms',
      metaNote: 'Recorded via CARDYCO Patch V3',
      metaIcon: 'schedule',
      waveformVariant: 'resting-sinus',
      doctorReviewed: false,
      pathData:
        'M0,20 L30,20 L34,16 L38,20 L48,20 L51,3 L55,37 L59,17 L62,20 L70,14 L78,20 L135,20 L139,16 L143,20 L153,20 L156,3 L160,37 L164,17 L167,20 L175,14 L183,20 L240,20 L244,16 L248,20 L258,20 L261,3 L265,37 L269,17 L272,20 L280,14 L288,20 L320,20',
    };

    onSessionRecorded(newRecord);
    onClose();
  };

  return (
    <div
      id="record-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="record-modal-content"
        className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isCompleted ? 'bg-[#006947]' : 'bg-[#ba1a1a] animate-ping'
              }`}
            />
            <span className="font-sans text-sm font-bold text-[#131b2e]">
              {isCompleted ? 'Diagnostic Capture Completed' : 'Recording Diagnostic ECG...'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Circular Progress & Timer */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#e2e8f0"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke={isCompleted ? '#006947' : '#006194'}
                strokeWidth="7"
                fill="none"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * (30 - secondsRemaining)) / 30}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-bold text-[#131b2e]">
                {secondsRemaining}s
              </span>
              <span className="text-[10px] uppercase font-bold text-[#3f4850]">
                {isCompleted ? 'Ready' : 'Remaining'}
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-[#3f4850] mt-3 max-w-[240px]">
            {isCompleted
              ? 'Lead II 30-second high-resolution telemetry strip validated with zero baseline drift.'
              : 'Please stay seated and avoid moving during sampling to minimize EMG artifacts.'}
          </p>
        </div>

        {/* Sensor electrode indicators */}
        <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#e2e7ff] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006947] text-[18px]">sensors</span>
            <span className="text-[#131b2e] font-semibold">Sensor Electrode</span>
          </div>
          <span className="font-mono font-bold text-[#006947]">99% Contact (Optimal)</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {isCompleted ? (
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="w-full h-11 bg-[#006947] hover:bg-[#00855b] text-white rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Save Strip to History</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="w-full h-11 bg-[#006194] hover:bg-[#007bb9] text-white rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Finish Early & Save</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
