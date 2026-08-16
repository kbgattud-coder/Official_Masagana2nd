import React, { useState } from 'react';
import { 
  Landmark, 
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Award,
  Scroll,
  CheckCircle2
} from 'lucide-react';
import { HISTORY_MILESTONES } from '../data/wardData';
import { HistoryMilestone } from '../types';
import { Language, translations } from '../data/translations';

interface HistorySectionProps {
  lang: Language;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ lang }) => {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'interactive' | 'chronicle'>('interactive');
  const t = translations[lang];
  const history = t.history;

  const activeMilestone: HistoryMilestone = HISTORY_MILESTONES[selectedMilestoneIndex] || HISTORY_MILESTONES[0];

  const handleNext = () => {
    setSelectedMilestoneIndex((prev) => (prev + 1) % HISTORY_MILESTONES.length);
  };

  const handlePrev = () => {
    setSelectedMilestoneIndex((prev) => (prev - 1 + HISTORY_MILESTONES.length) % HISTORY_MILESTONES.length);
  };

  return (
    <section id="history" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8E1D5] text-[#4F3C25] text-xs font-semibold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>{history.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1C2026] tracking-tight">
            {history.title}
          </h2>
          <p className="text-sm sm:text-base text-[#616B77] mt-1 max-w-2xl">
            {history.subtitle}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#E8E2D8] p-1 rounded-full border border-[#D9D1C3] self-start md:self-auto">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-[#1C2026] text-white shadow-xs'
                : 'text-[#5A6675] hover:text-[#1C2026]'
            }`}
          >
            {history.milestoneFocus}
          </button>
          <button
            onClick={() => setViewMode('chronicle')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'chronicle'
                ? 'bg-[#1C2026] text-white shadow-xs'
                : 'text-[#5A6675] hover:text-[#1C2026]'
            }`}
          >
            {history.fullTimeline}
          </button>
        </div>
      </div>

      {viewMode === 'interactive' ? (
        /* INTERACTIVE BENTO FOCUS MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left: Scrollable Timeline List (4 cols) */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between max-h-[640px]">
            <div className="overflow-hidden flex flex-col flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE2] mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[#768494] flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5 text-[#554228]" />
                  <span>Timeline Chronology ({HISTORY_MILESTONES.length} Events)</span>
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 scrollbar-thin">
                {HISTORY_MILESTONES.map((m, idx) => {
                  const isSelected = selectedMilestoneIndex === idx;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMilestoneIndex(idx)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C2026] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-[#333D48] hover:bg-[#F0EBE2] border border-[#EFE9DF]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${
                          isSelected ? 'bg-white/15 text-[#DFC8A4]' : 'bg-[#EAE4D9] text-[#554228]'
                        }`}>
                          {m.date}
                        </span>
                        <div className="truncate">
                          <span className="text-xs sm:text-sm font-semibold truncate block">
                            {m.title}
                          </span>
                          <span className={`text-[11px] block truncate ${isSelected ? 'text-white/70' : 'text-[#7A8694]'}`}>
                            {m.category}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-[#DFC8A4] translate-x-0.5' : 'text-gray-400 group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Archival Summary Stats */}
            <div className="pt-4 mt-4 border-t border-[#F0EBE2] grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FAF4E8] border border-[#EADFCB]">
                <span className="text-lg font-bold text-[#554228] block">10 Mar 1991</span>
                <span className="text-[11px] text-[#6B573D] font-medium">Branch Created</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#DEEAE0] border border-[#CDE0D0]">
                <span className="text-lg font-bold text-[#234A2C] block">14 Dec 1997</span>
                <span className="text-[11px] text-[#3B6645] font-medium">Ward Organized</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Historical Record Presentation (8 cols) */}
          <div 
            id="history-active-milestone-record"
            className="lg:col-span-8 bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-6 sm:p-9 shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Header Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#ECE7DE] mb-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF4E8] text-[#554228] text-xs font-bold border border-[#EADFCB]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeMilestone.date}</span>
                  </div>

                  <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[#F3EFE8] text-[#625340] border border-[#E3DACB]">
                    {activeMilestone.category}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#828F9E]">
                  Record {selectedMilestoneIndex + 1} of {HISTORY_MILESTONES.length}
                </div>
              </div>

              {/* Title & Narrative */}
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1C2026] tracking-tight mb-3">
                {activeMilestone.title}
              </h3>

              <div className="bg-[#FAF8F5] border-l-4 border-[#C7B59D] p-4 sm:p-5 rounded-r-2xl mb-6">
                <p className="text-sm sm:text-base text-[#343F4D] leading-relaxed">
                  {activeMilestone.description}
                </p>
              </div>

              {/* Leadership Roster Section (if present) */}
              {activeMilestone.leadership && (
                <div className="mb-6 bg-[#FDFBF7] border border-[#EAE3D6] rounded-2xl p-5 sm:p-6 shadow-2xs">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4 text-[#8A714E]" />
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#554228]">
                      Presiding Leadership
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Presiding Leader */}
                    <div className="bg-white border border-[#E9E1D2] rounded-xl p-3.5">
                      <span className="text-[11px] uppercase font-bold text-[#8C6D40] block mb-1">
                        {activeMilestone.leadership.presidingRole}
                      </span>
                      <span className="text-sm font-semibold text-[#1C2026] block">
                        {activeMilestone.leadership.leader}
                      </span>
                    </div>

                    {/* 1st Counselor */}
                    {activeMilestone.leadership.counselor1 && (
                      <div className="bg-white border border-[#E9E1D2] rounded-xl p-3.5">
                        <span className="text-[11px] uppercase font-bold text-[#6D7B8B] block mb-1">
                          1st Counselor
                        </span>
                        <span className="text-sm font-semibold text-[#1C2026] block">
                          {activeMilestone.leadership.counselor1}
                        </span>
                      </div>
                    )}

                    {/* 2nd Counselor */}
                    {activeMilestone.leadership.counselor2 && (
                      <div className="bg-white border border-[#E9E1D2] rounded-xl p-3.5">
                        <span className="text-[11px] uppercase font-bold text-[#6D7B8B] block mb-1">
                          2nd Counselor
                        </span>
                        <span className="text-sm font-semibold text-[#1C2026] block">
                          {activeMilestone.leadership.counselor2}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Statistics & Activity Data (if present) */}
              {activeMilestone.statistics && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#FAF4E8] border border-[#EADFCB] text-center">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#6C563A] block mb-0.5">
                      Unit Records
                    </span>
                    <span className="text-sm font-bold text-[#1C2026]">
                      {activeMilestone.statistics.members}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#DEEAE0] border border-[#CDE0D0] text-center">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#3B6645] block mb-0.5">
                      Attendance
                    </span>
                    <span className="text-sm font-bold text-[#1C2026]">
                      {activeMilestone.statistics.attendance}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#DCE4F2] border border-[#CAD8EC] text-center">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#33465D] block mb-0.5">
                      Activity
                    </span>
                    <span className="text-sm font-bold text-[#1C2026]">
                      {activeMilestone.statistics.activityRate}
                    </span>
                  </div>
                </div>
              )}

              {/* Key Note Banner (if present) */}
              {activeMilestone.keyNote && (
                <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#F4EFE6] border border-[#E5DBCA] mb-6">
                  <Sparkles className="w-4 h-4 text-[#8A714E] mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-[#4E4130] leading-relaxed">
                    {activeMilestone.keyNote}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Controls Bottom Bar */}
            <div className="pt-5 border-t border-[#ECE7DE] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  id="history-prev-milestone-btn"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#F0EBE2] border border-[#E2DAD0] text-xs font-semibold text-[#1C2026] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  id="history-next-milestone-btn"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C2026] hover:bg-[#2C323B] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Next Event</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DFC8A4]" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs text-[#808D9C]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Historical Record • Masagana 2nd Ward</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* FULL CHRONICLE DOCUMENT VIEW */
        <div className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center pb-6 border-b border-[#EAE4D9]">
              <h3 className="text-2xl font-serif-heading font-semibold text-[#1C2026]">
                Chronological Annals of Masagana 2nd Ward
              </h3>
              <p className="text-xs sm:text-sm text-[#667280] mt-1">
                A complete chronological record of leadership administrations, facilities, and congregation milestones.
              </p>
            </div>

            <div className="relative border-l-2 border-[#D9D0C3] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10">
              {HISTORY_MILESTONES.map((item, idx) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#554228] border-4 border-white shadow-xs" />

                  <div className="bg-[#FAF8F5] border border-[#EBE4D8] rounded-2xl p-5 sm:p-6 transition-all hover:border-[#CFC5B4]">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF4E8] text-[#554228] border border-[#EADFCB]">
                        {item.date}
                      </span>
                      <span className="text-[11px] font-semibold text-[#7A8795] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-semibold text-[#1C2026] mb-2">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#465362] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Leadership Roster Snippet */}
                    {item.leadership && (
                      <div className="bg-white border border-[#E6DEC2] rounded-xl p-3 text-xs space-y-1">
                        <div className="font-bold text-[#554228]">
                          {item.leadership.presidingRole}: <span className="text-[#1C2026] font-semibold">{item.leadership.leader}</span>
                        </div>
                        {item.leadership.counselor1 && (
                          <div className="text-[#55606E]">
                            1st Counselor: <span className="font-medium text-[#1C2026]">{item.leadership.counselor1}</span>
                          </div>
                        )}
                        {item.leadership.counselor2 && (
                          <div className="text-[#55606E]">
                            2nd Counselor: <span className="font-medium text-[#1C2026]">{item.leadership.counselor2}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Statistics Snippet */}
                    {item.statistics && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-[#FAF4E8] text-[#554228] font-medium border border-[#EADFCB]">
                          {item.statistics.members}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#DEEAE0] text-[#234A2C] font-medium border border-[#CDE0D0]">
                          {item.statistics.attendance}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#DCE4F2] text-[#1F2A38] font-medium border border-[#CAD8EC]">
                          {item.statistics.activityRate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
