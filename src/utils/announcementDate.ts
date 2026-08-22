/**
 * Works out when an announcement stops being relevant.
 *
 * Announcement dates are written by hand, so they vary a lot:
 *   "Saturday, August 22, 2026"
 *   "Friday – Saturday, September 4–5, 2026"   (multi-day: stays until the 5th)
 *   "Weekly Calendar"                          (recurring: never expires)
 *
 * Anything we cannot confidently parse is treated as still active, so a
 * typo never silently hides a real announcement from the ward.
 */

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  // Tagalog month names, in case dates are entered in Filipino
  enero: 0, pebrero: 1, marso: 2, abril: 3, mayo: 4, hunyo: 5,
  hulyo: 6, agosto: 7, setyembre: 8, oktubre: 9, nobyembre: 10, disyembre: 11,
};

/** Last calendar day an announcement is relevant, or null if undated. */
export function getAnnouncementEndDate(dateText?: string): { y: number; m: number; d: number } | null {
  if (!dateText || typeof dateText !== 'string') return null;
  const text = dateText.toLowerCase();

  const yearMatch = text.match(/\b(20\d{2})\b/);
  if (!yearMatch) return null; // e.g. "Weekly Calendar" — recurring, never expires
  const year = Number(yearMatch[1]);

  const monthKey = Object.keys(MONTHS).find((m) => text.includes(m));
  if (monthKey === undefined) return null;
  const month = MONTHS[monthKey];

  // Day numbers, ignoring the year. A range keeps the LAST day.
  const withoutYear = text.replace(yearMatch[1], ' ');
  const days = (withoutYear.match(/\d{1,2}/g) || [])
    .map(Number)
    .filter((n) => n >= 1 && n <= 31);

  // Month-only dates ("July 2026") stay up for the whole month
  if (days.length === 0) {
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return { y: year, m: month, d: lastDay };
  }

  return { y: year, m: month, d: Math.max(...days) };
}

/** Today's calendar date in Manila, where the ward actually is. */
export function getManilaToday(now: Date = new Date()): { y: number; m: number; d: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(now);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    return { y: get('year'), m: get('month') - 1, d: get('day') };
  } catch {
    return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  }
}

/**
 * True while the announcement should still be shown to the ward.
 * An event stays visible for the whole of its final day.
 */
export function isAnnouncementActive(dateText?: string, now: Date = new Date()): boolean {
  const end = getAnnouncementEndDate(dateText);
  if (!end) return true; // undated or unparseable — keep showing it
  const today = getManilaToday(now);
  return Date.UTC(end.y, end.m, end.d) >= Date.UTC(today.y, today.m, today.d);
}
