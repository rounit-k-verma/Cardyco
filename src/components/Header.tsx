import React from 'react';
import { CardycoLogo } from './CardycoLogo';

interface HeaderProps {
  batteryLevel?: number;
  isConnected?: boolean;
  isAlertMode?: boolean;
  onToggleAlertMode?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  batteryLevel = 98,
  isConnected = true,
  isAlertMode = false,
  onToggleAlertMode,
  onOpenProfile,
}) => {
  return (
    <header
      id="app-header"
      className="fixed top-0 left-0 right-0 w-full z-50 bg-[#faf8ff]/95 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e7ff]/50"
    >
      <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between gap-2">
        {/* Top-Left: Logo with CARDYCO */}
        <div className="flex items-center gap-2">
          <CardycoLogo
            size="md"
            isAlertMode={isAlertMode}
            onClick={onToggleAlertMode}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick simulation toggle button to readily switch between Normal and High Alert screens */}
          {onToggleAlertMode && (
            <button
              id="btn-quick-simulation"
              type="button"
              onClick={onToggleAlertMode}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border transition-all flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer ${
                isAlertMode
                  ? 'bg-[#cce5ff] text-[#004b73] border-[#93ccff]'
                  : 'bg-[#ffdad6] text-[#93000a] border-[#ffdad6] hover:bg-[#ffdad6]/80'
              }`}
              title="Toggle between Normal Live Monitor and Arrhythmia High Alert Screen"
            >
              <span className="material-symbols-outlined text-[15px]">
                {isAlertMode ? 'ecg_heart' : 'crisis_alert'}
              </span>
              <span>{isAlertMode ? 'Normal' : 'Simulate'}</span>
            </button>
          )}

          <button
            id="btn-user-avatar"
            type="button"
            onClick={onOpenProfile}
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#006194]/30 cursor-pointer active:scale-95 transition-transform"
            title="Patient Profile"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKOo0dyAuV89NU8Az_ocMLHm3EQNrJiLYnGdxw_O-brMLHRg5Cv2IvyvsvWinyClqSCXdoLlQkC31vbv9izYJ5k_8reV4WW2bJLSF1sMCiQf4yZdbJq5P0Za_2hJE25lkb0vHCnyOc7LN5cAj-qMN8PoIaeQsOfJvJ0jV9TZ0oco8y_5o4_NAy2SQdoPu1EbGV76J-qCeoNM3G3XuPPYuADRlBHjLPWzNE4i7U8Uzyd9g7iZwGzg"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
