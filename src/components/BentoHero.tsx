import React from 'react';
import { 
  ArrowUpRight,
  Clock, 
  MapPin, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface BentoHeroProps {
  onNavigate: (sectionId: string) => void;
  lang: Language;
}

const HERO_VIDEO_URL = "https://pub-5497f73b6290403fb534fbb3f47ef636.r2.dev/root/Clouds_drifting_behind_church_st%E2%80%A6_202608161412.mp4";

export const BentoHero: React.FC<BentoHeroProps> = ({
  onNavigate,
  lang,
}) => {
  const t = translations[lang];
  const hero = t.hero;

  return (
    <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      {/* Top Bento Row: Welcome Card (Left) & Video Hero Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Card 1: Warm Sand Hero Welcome */}
        <div 
          id="bento-welcome-card"
          className="lg:col-span-5 bg-[#F6EEDB] border border-[#EBE0C8] rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xs transition-all relative overflow-hidden group min-h-[380px] sm:min-h-[440px]"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#EFE3C7]/60 blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ECE0C6] text-[#554228] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hero.stakeBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] font-semibold text-[#1C2026] tracking-tight mb-4">
              {hero.title}
            </h1>

            <p className="text-[#555C66] text-base sm:text-lg leading-relaxed max-w-md">
              {hero.description}
            </p>
          </div>

          <div className="relative z-10 pt-8 flex flex-wrap items-center gap-3">
            <button
              id="hero-explore-bulletin-btn"
              onClick={() => onNavigate('bulletin')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1C2026] hover:bg-[#2C323B] text-[#FFFFFF] text-sm font-semibold transition-all group-hover:shadow-md cursor-pointer"
            >
              <span>{hero.viewBulletin}</span>
              <ChevronRight className="w-4 h-4 text-[#DFC8A4] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              id="hero-view-gallery-btn"
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#EFE3C7] hover:bg-[#E6D8B8] text-[#4F3C25] text-sm font-medium transition-colors cursor-pointer"
            >
              <span>{hero.exploreGallery}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Hero Video Card with Sacrament Schedule Only */}
        <div 
          id="bento-video-hero-card"
          className="lg:col-span-7 bg-[#14181F] border border-[#2D333D] rounded-3xl overflow-hidden relative shadow-md flex flex-col justify-start min-h-[380px] sm:min-h-[440px]"
        >
          {/* Direct Autoplaying Loop Video */}
          <video
            src={HERO_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Sacrament Schedule Pill Only */}
          <div className="relative z-10 p-6 flex justify-end">
            <div 
              id="hero-blinking-sacrament-schedule"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">{hero.blinkingSacrament}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bento Row: Balanced 12-Column Grid without Sanctuary Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Metric Stat Pill */}
        <div 
          id="bento-heritage-stat-card"
          className="md:col-span-3 bg-[#DEEAE0] border border-[#CDE0D0] rounded-3xl p-6 sm:p-7 flex flex-col justify-center items-center text-center shadow-xs hover:bg-[#D5E5D8] transition-colors"
        >
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#234A2C] tracking-tight">
            35+
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#3B6645] mt-1.5">
            {hero.yearsHeritage}
          </div>
          <p className="text-[12px] text-[#4F7358] mt-1">
            {hero.heritageSub}
          </p>
        </div>

        {/* Soft Lavender About Card with Top-Right Arrow */}
        <div 
          id="bento-about-card"
          onClick={() => onNavigate('history')}
          className="md:col-span-5 bg-[#DCE4F2] border border-[#CAD8EC] rounded-3xl p-7 flex flex-col justify-between shadow-xs hover:bg-[#D3DEEE] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#1F2A38] tracking-tight">
              {hero.aboutTitle}
            </h3>
            <div className="w-9 h-9 rounded-full bg-[#FFFFFF]/80 border border-[#BED0E8] flex items-center justify-center text-[#1F2A38] group-hover:bg-[#FFFFFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs sm:text-sm text-[#445366] leading-relaxed">
              {hero.aboutText}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#273B52]">
              <span>{hero.aboutAction}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Deep Slate Meeting Info Card */}
        <div 
          id="bento-schedule-contact-card"
          className="md:col-span-4 bg-[#1C2026] border border-[#2D333D] rounded-3xl p-7 flex flex-col justify-between shadow-md text-white"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#DFC8A4]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#DFC8A4]">
                {hero.scheduleTitle}
              </span>
            </div>
            <p className="text-sm font-medium text-white/95">
              {hero.sacramentTime}
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              {hero.sundaySchoolTime}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/60 mt-2">
              <MapPin className="w-3.5 h-3.5 text-[#DFC8A4] shrink-0" />
              <span className="truncate">{hero.chapelLocation}</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('bulletin')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#FAF4E8] hover:bg-[#FFFFFF] text-[#1C2026] text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>{hero.weeklyAnnouncementsBtn}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
