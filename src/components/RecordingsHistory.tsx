import React, { useState, useMemo } from 'react';
import { ECGRecording } from '../types';
import { getCurrentMonthYear } from '../data/mockRecordings';

interface RecordingsHistoryProps {
  recordings: ECGRecording[];
  onOpenReportModal: (recording?: ECGRecording) => void;
  onOpenBatchReportModal: () => void;
  onSelectFlaggedAlert?: () => void;
}

type FilterOption = 'all' | '7days' | 'flagged' | 'reviewed';

export const RecordingsHistory: React.FC<RecordingsHistoryProps> = ({
  recordings,
  onOpenReportModal,
  onOpenBatchReportModal,
  onSelectFlaggedAlert,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Telemetry up to date with Holter Cloud (42 records)');
    }, 900);
  };

  const filteredRecordings = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return recordings.filter((item) => {
      // Filter tab logic
      if (activeFilter === 'flagged' && item.status !== 'flagged') return false;
      if (activeFilter === 'reviewed' && !item.doctorReviewed) return false;
      if (activeFilter === '7days') {
        // Parse the date label — handles 'Today, ...', 'Yesterday, ...' and direct date strings
        const rawDate = item.date.replace(/^(Today|Yesterday),\s*/i, '');
        const parsed = new Date(rawDate);
        if (isNaN(parsed.getTime())) return true; // keep if unparseable
        if (parsed < sevenDaysAgo) return false;
      }

      // Search query logic
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDate = item.date.toLowerCase().includes(query);
        const matchesNote = item.metaNote.toLowerCase().includes(query);
        const matchesStatus = item.statusLabel.toLowerCase().includes(query);
        const matchesLead = item.lead.toLowerCase().includes(query);
        const matchesBpm = item.bpm.toString().includes(query);
        return matchesDate || matchesNote || matchesStatus || matchesLead || matchesBpm;
      }

      return true;
    });
  }, [recordings, activeFilter, searchQuery]);

  const flaggedCount = recordings.filter((r) => r.status === 'flagged').length;
  const avgBpm = Math.round(
    recordings.reduce((sum, r) => sum + r.bpm, 0) / (recordings.length || 1),
  );

  return (
    <div id="recordings-history-container" className="flex flex-col w-full gap-4 pb-28 animate-fadeIn">
      {/* Top Title & Clinical Context Banner */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[11px] font-bold text-[#006591] uppercase tracking-wider">
              Cardiology Telemetry Log
            </span>
            <h1 className="font-sans text-2xl font-bold text-[#131b2e] tracking-tight">
              ECG Recordings
            </h1>
          </div>
          <button
            id="btn-sync"
            type="button"
            onClick={handleSync}
            aria-label="Sync with cloud database"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e2e7ff] text-[#006194] hover:bg-[#cce5ff] active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Sync with cloud telemetry"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isSyncing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
          </button>
        </div>
        <p className="text-xs text-[#3f4850] font-medium leading-relaxed">
          Validated 3-lead ambulatory Holter events & on-demand snapshots
        </p>
      </div>

      {/* Summary Metric Strip */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {/* Card 1: Total */}
        <div
          id="stat-card-total"
          className="flex flex-col p-3 bg-white rounded-xl shadow-sm border border-[#e2e8f0]"
        >
          <div className="flex items-center gap-1 text-[#3f4850]">
            <span className="material-symbols-outlined text-[14px]">data_table</span>
            <span className="font-sans text-[11px] font-bold uppercase">Total</span>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="font-mono text-3xl font-bold text-[#131b2e]">
              {recordings.length}
            </span>
          </div>
          <span className="text-xs text-[#3f4850] font-medium">Recordings</span>
        </div>

        {/* Card 2: Avg BPM */}
        <div
          id="stat-card-avg-hr"
          className="flex flex-col p-3 bg-white rounded-xl shadow-sm border border-[#e2e8f0]"
        >
          <div className="flex items-center gap-1 text-[#006591]">
            <span className="material-symbols-outlined text-[14px]">ecg_heart</span>
            <span className="font-sans text-[11px] font-bold uppercase">Avg HR</span>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="font-mono text-3xl font-bold text-[#131b2e]">{avgBpm || 74}</span>
          </div>
          <span className="text-xs text-[#3f4850] font-medium">BPM Mean</span>
        </div>

        {/* Card 3: Alerts */}
        <div
          id="stat-card-flagged"
          onClick={() => {
            setActiveFilter('flagged');
            if (onSelectFlaggedAlert) onSelectFlaggedAlert();
          }}
          className="flex flex-col p-3 bg-white rounded-xl shadow-sm border border-[#ffdad6] cursor-pointer hover:bg-[#ffdad6]/20 transition-colors"
          title="Click to view flagged arrhythmia events"
        >
          <div className="flex items-center gap-1 text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span className="font-sans text-[11px] font-bold uppercase">Flagged</span>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="font-mono text-3xl font-bold text-[#ba1a1a]">
              0{flaggedCount || 1}
            </span>
          </div>
          <span className="text-xs text-[#ba1a1a] font-bold">Needs Review</span>
        </div>
      </div>

      {/* Search & Date Range Trigger Bar */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-[#e2e8f0]">
        <div className="flex items-center gap-2 flex-1 px-2">
          <span className="material-symbols-outlined text-[#3f4850] text-[20px]">search</span>
          <input
            id="search-recordings-input"
            aria-label="Search recordings"
            className="w-full bg-transparent text-sm text-[#131b2e] placeholder:text-[#3f4850]/70 focus:outline-none font-medium"
            placeholder="Search rhythm, notes, tags..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#3f4850] hover:text-[#131b2e]"
            >
              Clear
            </button>
          )}
        </div>
        <button
          id="btn-date-filter"
          type="button"
          onClick={() => showToast(`Filtered date range: ${getCurrentMonthYear()}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#131b2e] text-xs font-semibold active:bg-[#e2e7ff] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#006194]">
            calendar_today
          </span>
          <span className="font-sans font-bold">{getCurrentMonthYear()}</span>
        </button>
      </div>

      {/* Filter Category Chips */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar"
        role="tablist"
      >
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`filter-tab px-4 py-1.5 rounded-full font-sans text-[11px] font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-[#eaedff] text-[#3f4850] hover:text-[#131b2e]'
          }`}
        >
          All ({recordings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('7days')}
          className={`filter-tab px-4 py-1.5 rounded-full font-sans text-[11px] font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === '7days'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-[#eaedff] text-[#3f4850] hover:text-[#131b2e]'
          }`}
        >
          Last 7 Days
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('flagged')}
          className={`filter-tab flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-[11px] font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'flagged'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-[#eaedff] text-[#3f4850] hover:text-[#131b2e]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
          Flagged / Alerts ({flaggedCount || 1})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('reviewed')}
          className={`filter-tab px-4 py-1.5 rounded-full font-sans text-[11px] font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'reviewed'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-[#eaedff] text-[#3f4850] hover:text-[#131b2e]'
          }`}
        >
          Doctor Reviewed
        </button>
      </div>

      {/* ECG Sessions List */}
      <div className="flex flex-col gap-3" id="recordings-list">
        {filteredRecordings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#e2e8f0] text-[#3f4850]">
            <p className="font-semibold text-sm">No recordings found matching criteria</p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-[#006194] underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredRecordings.map((recording) => {
            const isFlagged = recording.status === 'flagged';
            return (
              <div
                key={recording.id}
                id={`card-${recording.id}`}
                className={`flex flex-col p-4 bg-white rounded-2xl shadow-sm gap-3 border transition-all ${
                  isFlagged
                    ? 'border-[#ffdad6] hover:border-[#ba1a1a]/40 bg-gradient-to-b from-[#fff5f5] to-white'
                    : 'border-[#e2e8f0] hover:border-[#006194]/30'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-base font-bold text-[#131b2e]">
                        {recording.date}
                      </span>
                      <span className="font-sans text-[11px] font-semibold text-[#3f4850]">
                        {recording.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`font-mono text-xl font-bold ${
                          isFlagged ? 'text-[#ba1a1a]' : 'text-[#006947]'
                        }`}
                      >
                        {recording.bpm}
                      </span>
                      <span className="font-sans text-[11px] font-bold text-[#3f4850] uppercase">
                        BPM {recording.bpmType}
                      </span>
                      <span className="text-xs text-[#3f4850] font-medium">
                        • {recording.duration} {recording.lead}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      isFlagged
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : 'bg-[#6ffbbe] text-[#002113]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isFlagged ? 'warning' : 'check_circle'}
                    </span>
                    <span>{recording.statusLabel}</span>
                  </span>
                </div>

                {/* ECG Waveform Miniature */}
                <div
                  className={`w-full h-16 rounded-lg p-2 flex flex-col justify-between overflow-hidden relative cursor-pointer ${
                    isFlagged ? 'bg-[#ffdad6]/20' : 'bg-[#f2f3ff]'
                  }`}
                  onClick={() => {
                    if (isFlagged && onSelectFlaggedAlert) {
                      onSelectFlaggedAlert();
                    } else {
                      onOpenReportModal(recording);
                    }
                  }}
                  title="Click to inspect telemetry record"
                >
                  <div className="flex justify-between items-center z-10 px-1">
                    <span className="font-mono text-[10px] text-[#3f4850] font-semibold opacity-80">
                      25mm/s • 10mm/mV
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        isFlagged ? 'text-[#ba1a1a]' : 'text-[#006947]'
                      }`}
                    >
                      {recording.rhythmDetail}
                    </span>
                  </div>

                  <svg
                    className={`w-full h-10 fill-none absolute inset-x-0 bottom-0 pointer-events-none ${
                      isFlagged ? 'stroke-[#ba1a1a]' : 'stroke-[#006591]'
                    }`}
                    preserveAspectRatio="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isFlagged ? '2' : '1.8'}
                    viewBox="0 0 320 40"
                  >
                    <path d={recording.pathData} />
                  </svg>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[#3f4850]">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isFlagged ? 'text-[#006947]' : 'text-[#3f4850]'
                      }`}
                    >
                      {recording.metaIcon}
                    </span>
                    <span className="text-xs font-medium">{recording.metaNote}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Exporting ${recording.lead} strip...`);
                      onOpenReportModal(recording);
                    }}
                    className={`export-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer ${
                      isFlagged
                        ? 'bg-[#006194] text-white hover:bg-[#007bb9]'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dae2fd]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-current">
                      picture_as_pdf
                    </span>
                    <span>Export to PDF</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Medical Provider Context Card (Indian Institution) */}
      <div
        id="provider-link-card"
        className="flex items-center gap-3 p-3 bg-[#f2f3ff] rounded-xl border border-[#e2e7ff]"
      >
        <div className="w-10 h-10 rounded-full bg-[#c9e6ff] flex items-center justify-center text-[#001e2f] shrink-0">
          <span className="material-symbols-outlined text-[20px]">local_hospital</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-sans text-sm font-bold text-[#131b2e] truncate">
            Linked to Apollo & AIIMS Cardiology Portal
          </span>
          <span className="text-xs text-[#3f4850] truncate font-medium">
            EHR Auto-sync enabled for Dr. Rajesh Sharma & Dr. Priya Nair
          </span>
        </div>
        <span
          className="material-symbols-outlined text-[#006194] text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
      </div>

      {/* Clinical Visit Package Banner Card */}
      <div
        id="clinical-visit-package"
        className="flex flex-col p-4 bg-[#dae2fd] rounded-2xl shadow-md gap-3 border border-[#cce5ff]"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-base font-bold text-[#131b2e]">
              Clinical Visit Package
            </span>
            <span className="text-xs text-[#3f4850] font-medium leading-relaxed">
              Generate standardized 12-page PDF for your next appointment with Dr. Rajesh Sharma
            </span>
          </div>
          <span className="material-symbols-outlined text-[#006194] text-[28px]">
            medical_information
          </span>
        </div>

        {/* Date selector row within banner */}
        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#bfc7d2]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3f4850] text-[18px]">date_range</span>
            <span className="text-xs text-[#131b2e] font-semibold">
              Selected Period: {getCurrentMonthYear()} (Active Holter Cycle)
            </span>
          </div>
          <button
            id="btn-change-range"
            type="button"
            onClick={() => showToast(`Date range editor active: ${getCurrentMonthYear()}`)}
            className="font-sans text-[11px] font-bold text-[#006194] uppercase tracking-wider hover:underline"
          >
            Change
          </button>
        </div>

        {/* Main batch action button */}
        <button
          id="btn-export-full"
          type="button"
          onClick={onOpenBatchReportModal}
          className="w-full h-12 bg-[#006194] hover:bg-[#007bb9] active:scale-[0.98] text-white rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">print</span>
          <span>Export Full Doctor Report (PDF)</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#283044] text-[#eef0ff] px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 z-50 max-w-[90%] border border-slate-700 animate-fadeIn"
        >
          <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
          <span className="text-xs font-semibold truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
