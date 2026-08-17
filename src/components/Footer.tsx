import React from 'react';
import {
  MapPin,
  Clock, 
  ExternalLink, 
  ArrowUp,
  Lock
} from 'lucide-react';
import { Language, translations } from '../data/translations';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAdmin,
}) => {
  const t = translations[lang];
  const footer = t.footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Bento Bottom Grid - Symmetrical 2-Column Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 w-full">
        
        {/* Card 1: Ward Info & Welcome */}
        <div className="bg-[#FFFFFF] border border-[#E4DFD5] rounded-3xl p-8 sm:p-9 shadow-xs flex flex-col justify-between w-full h-full">
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF4E8] border border-[#EADFCB] flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                <img src="/masagana_logo.svg" alt="Masagana 2nd Ward logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-[#1C2026] tracking-tight">Masagana 2nd Ward</h3>
                <p className="text-xs text-[#788492] mt-0.5">{t.nav.brandSubtitle}</p>
              </div>
            </div>

            <p className="text-sm text-[#555F6C] leading-relaxed">
              {footer.invitationText}
            </p>
          </div>

          <div className="pt-6 mt-8 border-t border-[#F2ECE3] flex flex-wrap items-center justify-between gap-3 text-xs text-[#7E8B99]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#554228]" />
              <span className="font-medium text-[#46505D]">{footer.sacramentSchedule}</span>
            </div>
            <span className="text-[#554228] font-bold bg-[#FAF4E8] px-3.5 py-1.5 rounded-full border border-[#EADFCB]">
              {footer.visitorsWelcome}
            </span>
          </div>
        </div>

        {/* Card 2: Location & Official Resources */}
        <div className="bg-[#1C2026] text-white border border-[#2D333D] rounded-3xl p-8 sm:p-9 shadow-md flex flex-col justify-between w-full h-full">
          <div>
            <div className="flex items-center gap-2 mb-3.5 text-[#DFC8A4]">
              <MapPin className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-bold">{footer.meetinghouseHeading}</span>
            </div>

            <p className="text-base font-semibold text-white/95">
              {footer.chapelName}
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              {footer.chapelAddress}
            </p>

            <div className="mt-6 space-y-2.5 text-xs">
              <a
                href="https://www.churchofjesuschrist.org"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all group"
              >
                <span className="font-medium">ChurchofJesusChrist.org</span>
                <ExternalLink className="w-4 h-4 text-[#DFC8A4] group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://www.familysearch.org"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all group"
              >
                <span className="font-medium">FamilySearch.org ({footer.genealogyLabel})</span>
                <ExternalLink className="w-4 h-4 text-[#DFC8A4] group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://maps.app.goo.gl/1m3MjVQw9f1G8Lnz6"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all group"
              >
                <span className="font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#DFC8A4]" />Google Maps</span>
                <ExternalLink className="w-4 h-4 text-[#DFC8A4] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span className="font-medium">Antipolo Philippines Stake</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer text-xs"
              title="Return to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#DFC8A4]" />
            </button>
          </div>
        </div>

      </div>

      {/* Reverent Disclaimer & Copyright Bar */}
      <div className="w-full px-5 py-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#808C99]">
        <div className="text-center sm:text-left">
          <p className="leading-relaxed">
            {footer.disclaimer}
          </p>
          <p className="text-[11px] mt-1 text-[#95A0AC]">
            © {new Date().getFullYear()} Masagana 2nd Ward. This is not an official website of The Church of Jesus Christ of Latter-day Saints.
          </p>
        </div>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            id="footer-admin-portal-link"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE4D9] hover:bg-[#DDD5C7] text-[#554228] font-bold text-[11px] transition-colors cursor-pointer shrink-0"
          >
            <Lock className="w-3 h-3 text-[#554228]" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>
    </footer>
  );
};
