import React from 'react';

interface CardycoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  onClick?: () => void;
  isAlertMode?: boolean;
}

export const CardycoLogo: React.FC<CardycoLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  onClick,
  isAlertMode = false,
}) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div
      id="cardyco-logo-container"
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      title="CARDYCO Ambulatory ECG Telemetry"
    >
      {/* Brand Icon Emblem */}
      <div
        id="cardyco-logo-emblem"
        className={`relative ${iconSize} rounded-xl bg-gradient-to-br from-[#006194] via-[#004e77] to-[#002f4a] p-1.5 flex items-center justify-center shadow-sm border border-white/20 transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.03] group-active:scale-95 shrink-0 overflow-hidden`}
      >
        {/* Subtle background glow effect */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#6ffbbe]/25 rounded-full blur-xs pointer-events-none" />

        {/* ECG Heartbeat & Heart SVG Vector Icon */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Stylized Heart Outline */}
          <path
            d="M16 26.5C16 26.5 6 20.5 4.2 14.5C2.5 9 6.5 5 11.5 5C13.8 5 15.2 6.1 16 7C16.8 6.1 18.2 5 20.5 5C25.5 5 29.5 9 27.8 14.5C26 20.5 16 26.5 16 26.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.35"
          />

          {/* Sharp High-Precision ECG Telemetry Pulse Waveform */}
          <path
            d="M4 16.5H9L11.5 11.5L14.5 22L17.5 7.5L20.5 19L22.5 14L24 16.5H28"
            stroke={isAlertMode ? '#ff897d' : '#6ffbbe'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_2px_rgba(111,251,190,0.6)]"
          />

          {/* Pulse Signal Dot at R-Wave Peak */}
          <circle
            cx="17.5"
            cy="7.5"
            r="1.8"
            fill={isAlertMode ? '#ffdad6' : '#ffffff'}
            className="animate-ping origin-center"
            style={{ animationDuration: isAlertMode ? '0.7s' : '1.4s' }}
          />
          <circle
            cx="17.5"
            cy="7.5"
            r="1.4"
            fill={isAlertMode ? '#ba1a1a' : '#006194'}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            id="cardyco-brand-title"
            className={`font-sans ${titleSize} font-black tracking-tight leading-none text-[#131b2e] flex items-center`}
          >
            <span>CARDY</span>
            <span className="text-[#006194]">CO</span>
          </span>

          {isAlertMode ? (
            <span className="px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold uppercase tracking-wider animate-pulse leading-none shadow-xs">
              Alert
            </span>
          ) : (
            <span className="px-1 py-0.5 rounded bg-[#cce5ff]/60 text-[#004b73] text-[9px] font-mono font-bold tracking-tight leading-none border border-[#006194]/20">
              Patch V3
            </span>
          )}
        </div>

        {showSubtitle && (
          <span className="text-[10px] font-semibold text-[#5a626a] tracking-normal leading-tight mt-0.5 flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isAlertMode ? 'bg-[#ba1a1a] animate-ping' : 'bg-[#006947] animate-pulse'
              }`}
            />
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-slate-500">
              ECG Telemetry
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
