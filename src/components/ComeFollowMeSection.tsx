import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Calendar, 
  Compass, 
  Smartphone, 
  Library,
  Users,
  Download
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface ComeFollowMeSectionProps {
  lang: Language;
}

interface LiveLesson {
  lessonNumber: number;
  week: string;
  title: string;
  scriptures: string;
  book: string;
  url: string;
}

export const ComeFollowMeSection: React.FC<ComeFollowMeSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const cfm = t.cfm;
  const [liveLesson, setLiveLesson] = useState<LiveLesson | null>(null);

  // Load the current week's lesson from the self-updating endpoint.
  useEffect(() => {
    const apiLang = lang === 'tl' ? 'tgl' : 'eng';
    let cancelled = false;
    fetch(`/api/cfm-lesson?lang=${apiLang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && data.title && data.week && data.scriptures) {
          setLiveLesson(data);
        }
      })
      .catch(() => {
        // Endpoint unreachable — keep the built-in lesson.
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Live data wins; the hardcoded translation strings are the fallback.
  const week = liveLesson ? `${liveLesson.week}, ${new Date().getFullYear()}` : cfm.week;
  const lessonTitle = liveLesson?.title || cfm.lessonTitle;
  const scriptures = liveLesson?.scriptures || cfm.scriptures;
  const lessonUrl = liveLesson?.url || cfm.lessonUrl;
  // Show the curated quote and family prompt only while they match the
  // displayed lesson; once a new week rolls in they hide until updated.
  const staticLessonIsCurrent = !liveLesson || liveLesson.title === cfm.lessonTitle;

  return (
    <section id="curriculum" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8E2D5] text-[#554228] text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{cfm.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1C2026] tracking-tight">
            {cfm.title}
          </h2>
          <p className="text-sm sm:text-base text-[#616B77] mt-1">
            {cfm.subtitle}
          </p>
        </div>

        {/* Primary Link to Official Church Come Follow Me Website based on selected language */}
        <div>
          <a
            href={cfm.manualUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C2026] hover:bg-[#2C323B] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            id="cfm-official-website-btn"
          >
            <span>{cfm.openManualBtn}</span>
            <ExternalLink className="w-4 h-4 text-[#DFC8A4]" />
          </a>
        </div>
      </div>

      {/* Main Bento Grid for Come Follow Me: Active Lesson Hero (Left) & 3 Link Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Active Lesson Hero Card (7 Cols) */}
        <div 
          id="cfm-active-lesson-card"
          className="lg:col-span-7 bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden"
        >
          <div>
            {/* Week Badge & Scripture Reference */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF4E8] text-[#554228] text-xs font-bold border border-[#EADFCB]">
                <Calendar className="w-3.5 h-3.5 text-[#8A714E]" />
                <span>{week}</span>
              </div>

              <span className="text-xs font-semibold text-[#667280] tracking-wide">
                {cfm.focusBadge}
              </span>
            </div>

            {/* Active Lesson Title */}
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#1C2026] tracking-tight leading-snug mb-2">
              {lessonTitle}
            </h3>

            <div className="text-xs sm:text-sm font-medium text-[#4C5B6C] mb-5">
              {cfm.scripturesLabel}: <strong className="text-[#1C2026]">{scriptures}</strong>
            </div>

            {/* Key Snippet Quote (curated; shown while it matches the live lesson) */}
            {staticLessonIsCurrent && (
              <div className="bg-[#FAF8F5] border-l-3 border-[#C9B393] p-4 sm:p-5 rounded-r-2xl mb-6">
                <p className="text-xs sm:text-sm italic text-[#444E5B] leading-relaxed">
                  {cfm.readingSnippet}
                </p>
              </div>
            )}

            {/* Family Application Prompt */}
            <div className="flex items-start gap-3 bg-[#F4EFE6] border border-[#E7DECE] rounded-2xl p-4 mb-6">
              <Sparkles className="w-4 h-4 text-[#8C6D40] mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A4528] block mb-1">
                  {cfm.familyDiscussionTitle}
                </span>
                <p className="text-xs sm:text-sm text-[#3E4957] leading-relaxed">
                  {staticLessonIsCurrent ? cfm.familyPrompt : cfm.familyPromptGeneric}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#717E8C]">
              <Compass className="w-4 h-4 text-[#907A5E]" />
              <span>{cfm.availableBadge}</span>
            </div>

            <a
              href={lessonUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF4E8] hover:bg-[#F2E8D5] text-[#554228] text-xs font-bold transition-colors border border-[#E0D4BE] cursor-pointer"
            >
              <span>{cfm.readFullLessonBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Link Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Card 1: Official Come Follow Me Digital Portal */}
          <a 
            href={cfm.manualUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-5 sm:p-6 shadow-xs hover:border-[#D0C8BB] transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-2xl bg-[#FAF4E8] border border-[#EADFCB] flex items-center justify-center text-[#554228] group-hover:scale-105 transition-transform">
                  <Library className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#554228]">
                  <span>{cfm.portalCardLinkText}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <h4 className="text-base font-semibold text-[#1C2026] tracking-tight group-hover:text-[#554228] transition-colors">
                {cfm.portalCardTitle}
              </h4>
              <p className="text-xs text-[#636F7E] mt-1 leading-relaxed">
                {cfm.portalCardDesc}
              </p>
            </div>
          </a>

          {/* Card 2: Gospel Library Mobile App with Android & iOS Download Links */}
          <div className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-5 sm:p-6 shadow-xs hover:border-[#D0C8BB] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-2xl bg-[#DEEAE0] border border-[#CDE0D0] flex items-center justify-center text-[#234A2C] group-hover:scale-105 transition-transform">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DEEAE0] text-[#234A2C]">
                  {cfm.appCardBadge}
                </span>
              </div>
              <h4 className="text-base font-semibold text-[#1C2026] tracking-tight group-hover:text-[#234A2C] transition-colors">
                {cfm.appCardTitle}
              </h4>
              <p className="text-xs text-[#636F7E] mt-1 leading-relaxed">
                {cfm.appCardDesc}
              </p>
            </div>

            {/* Direct App Store Download Buttons */}
            <div className="pt-3.5 mt-3 border-t border-[#F2EDE5] flex flex-wrap items-center gap-2">
              <a
                href="https://play.google.com/store/apps/details?id=org.lds.ldssa&hl=en"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DEEAE0] hover:bg-[#D3E5D6] text-[#234A2C] text-xs font-bold transition-colors cursor-pointer"
                title="Download Gospel Library for Android on Google Play"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Android (Google Play)</span>
              </a>

              <a
                href="https://apps.apple.com/us/app/gospel-library/id598329798"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C2026] hover:bg-[#2C323B] text-white text-xs font-bold transition-colors cursor-pointer"
                title="Download Gospel Library for iOS on App Store"
              >
                <Download className="w-3.5 h-3.5 text-[#DFC8A4]" />
                <span>iOS (App Store)</span>
              </a>
            </div>
          </div>

          {/* Card 3: Church Scriptures Online */}
          <a 
            href="https://www.churchofjesuschrist.org/study/scriptures"
            target="_blank"
            rel="noreferrer"
            className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-5 sm:p-6 shadow-xs hover:border-[#D0C8BB] transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-2xl bg-[#DCE4F2] border border-[#CAD8EC] flex items-center justify-center text-[#1F2A38] group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#1F2A38]">
                  <span>{cfm.scripturesCardLinkText}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <h4 className="text-base font-semibold text-[#1C2026] tracking-tight group-hover:text-[#1F2A38] transition-colors">
                {cfm.scripturesCardTitle}
              </h4>
              <p className="text-xs text-[#636F7E] mt-1 leading-relaxed">
                {cfm.scripturesCardDesc}
              </p>
            </div>
          </a>

        </div>

      </div>
    </section>
  );
};
