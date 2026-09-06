import React, { useEffect, useState, useCallback } from 'react';
import { X, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAdminData } from '../data/adminStore';
import { isPopupWindowOpen } from '../utils/announcementDate';
import { normalizeImageUrl } from '../utils/imageUtils';
import { Language, translations } from '../data/translations';
import { Announcement } from '../types';

interface ActivityPopupProps {
  lang: Language;
  onViewDetails: () => void;
}

const SEEN_KEY_PREFIX = 'masagana_popup_seen_';

/** Local YYYY-MM-DD, used to show the reminder at most once per day. */
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const ActivityPopup: React.FC<ActivityPopupProps> = ({ lang, onViewDetails }) => {
  const { announcements } = useAdminData();
  const [active, setActive] = useState<Announcement | null>(null);
  const t = translations[lang];
  const copy = t.popup;

  // Pick the first announcement whose popup window is open and that this
  // browser has not already seen today.
  useEffect(() => {
    const candidate = announcements.find(
      (a) => a.showAsPopup && isPopupWindowOpen(a.date, a.popupDaysBefore ?? 7)
    );
    if (!candidate) return;

    let seen: string | null = null;
    try {
      seen = localStorage.getItem(SEEN_KEY_PREFIX + candidate.id);
    } catch {
      // Private browsing — just show it
    }
    if (seen === todayKey() || seen === 'dismissed') return;

    // Let the page settle before interrupting the visitor
    const timer = setTimeout(() => setActive(candidate), 1200);
    return () => clearTimeout(timer);
  }, [announcements]);

  const close = useCallback((permanent = false) => {
    if (active) {
      try {
        localStorage.setItem(SEEN_KEY_PREFIX + active.id, permanent ? 'dismissed' : todayKey());
      } catch {
        // Ignore storage failures
      }
    }
    setActive(null);
  }, [active]);

  // Escape to close, and stop the page behind from scrolling
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close]);

  if (!active) return null;

  const poster = active.posterImageUrl ? normalizeImageUrl(active.posterImageUrl) : '';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-popup-title"
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md my-auto shadow-2xl border border-[#D5CEC2] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#F0EAE1] bg-[#FAF8F5]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#554228]">
            {copy.upcoming}
          </span>
          <button
            onClick={() => close()}
            aria-label={copy.close}
            className="w-8 h-8 rounded-full bg-[#EFE9E1] hover:bg-[#E2DACD] flex items-center justify-center text-[#554228] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Poster */}
        {poster && (
          <div className="bg-[#F3EFE9]">
            <img
              src={poster}
              alt={active.title}
              className="w-full h-auto max-h-[55vh] object-contain mx-auto"
            />
          </div>
        )}

        {/* Details */}
        <div className="p-5">
          <h2 id="activity-popup-title" className="text-lg font-semibold text-[#1C2026] leading-snug">
            {active.title}
          </h2>

          <div className="mt-3 space-y-1.5 text-xs text-[#5C6672]">
            {active.date && (
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#8C6D40] shrink-0" />
                <span>{active.date}</span>
              </p>
            )}
            {active.time && (
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#8C6D40] shrink-0" />
                <span>{active.time}</span>
              </p>
            )}
            {active.location && (
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8C6D40] shrink-0" />
                <span>{active.location}</span>
              </p>
            )}
          </div>

          {!poster && active.description && (
            <p className="mt-3 text-xs text-[#4C5B6C] leading-relaxed">{active.description}</p>
          )}

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => {
                close();
                onViewDetails();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#1C2026] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>{copy.viewDetails}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DFC8A4]" />
            </button>
            <button
              onClick={() => close()}
              className="px-4 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#EFE9E1] text-[#5C6672] border border-[#E6E1D8] text-xs font-semibold transition-colors cursor-pointer"
            >
              {copy.close}
            </button>
          </div>

          <button
            onClick={() => close(true)}
            className="mt-3 w-full text-center text-[11px] text-[#8C97A4] hover:text-[#554228] transition-colors cursor-pointer"
          >
            {copy.dontShowAgain}
          </button>
        </div>
      </div>
    </div>
  );
};
