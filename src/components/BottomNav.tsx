import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  hasAlert?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  hasAlert = false,
}) => {
  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.04)] border-t border-[#e2e7ff]/60"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {/* Live Tab */}
        <button
          id="nav-tab-live"
          type="button"
          onClick={() => onSelectTab('live')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative ${
            activeTab === 'live'
              ? 'text-[#006194] font-bold'
              : 'text-[#3f4850] hover:text-[#131b2e]'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings: activeTab === 'live' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              ecg_heart
            </span>
            {hasAlert && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
            )}
          </div>
          <span className="font-sans text-[11px] font-bold tracking-wider">Live</span>
        </button>

        {/* History Tab */}
        <button
          id="nav-tab-history"
          type="button"
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative ${
            activeTab === 'history'
              ? 'text-[#006194] font-bold'
              : 'text-[#3f4850] hover:text-[#131b2e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: activeTab === 'history' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            history
          </span>
          <span className="font-sans text-[11px] font-bold tracking-wider">History</span>
        </button>

        {/* Settings Tab */}
        <button
          id="nav-tab-settings"
          type="button"
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative ${
            activeTab === 'settings'
              ? 'text-[#006194] font-bold'
              : 'text-[#3f4850] hover:text-[#131b2e]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: activeTab === 'settings' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            tune
          </span>
          <span className="font-sans text-[11px] font-bold tracking-wider">Settings</span>
        </button>
      </div>
    </nav>
  );
};
