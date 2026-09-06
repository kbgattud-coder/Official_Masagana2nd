/**
 * Identifies the current Come, Follow Me study week (Monday-anchored,
 * Asia/Manila) as a plain date string, e.g. "2026-09-07".
 *
 * The lesson endpoint is cached at the CDN edge by full URL. Without a
 * value that changes at the week boundary, the edge can keep serving the
 * previous week's lesson after Monday rolls over. Sending this stamp makes
 * each new week a distinct URL, so the first request of the week always
 * reaches the origin.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function getManilaWeekStamp(now: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila',
      year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
    }).formatToParts(now);
    const val = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    const y = Number(val('year'));
    const m = Number(val('month'));
    const d = Number(val('day'));
    const dayIndex = WEEKDAYS.indexOf(val('weekday'));
    if (!y || !m || !d || dayIndex < 0) throw new Error('unavailable');

    const monday = new Date(Date.UTC(y, m - 1, d) - dayIndex * DAY_MS);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${monday.getUTCFullYear()}-${pad(monday.getUTCMonth() + 1)}-${pad(monday.getUTCDate())}`;
  } catch {
    // Fall back to a daily stamp; still bounded and never stale for long
    return now.toISOString().slice(0, 10);
  }
}
