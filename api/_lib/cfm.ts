/**
 * Self-updating Come, Follow Me weekly lesson.
 *
 * Computes the current lesson number from the date (Asia/Manila weeks,
 * Monday-anchored), fetches that lesson's page from the official manual at
 * churchofjesuschrist.org in English and Tagalog, extracts the week range,
 * lesson title, and scripture references, and caches the result in the
 * shared store so the Church site is hit at most once per lesson/language.
 *
 * The Vercel cron (vercel.json) requests this every Monday 00:00 Manila
 * time to warm the new week's cache; ComeFollowMeSection falls back to its
 * built-in lesson if this endpoint is unreachable.
 */

const MANUAL_BASE =
  'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026';

// Anchor: lesson 34 covers Monday 2026-08-17 through Sunday 2026-08-23 (Manila).
const ANCHOR_LESSON = 34;
const ANCHOR_MONDAY_UTC_MS = Date.UTC(2026, 7, 16, 16, 0, 0); // 2026-08-17 00:00 Manila (UTC+8)
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
// The 2026 Old Testament manual has 52 lessons; after the final week the
// card holds on lesson 52 until the next year's manual is configured.
const MIN_LESSON = 1;
const MAX_LESSON = 52;

export type CfmLang = 'eng' | 'tgl';

export interface CfmLesson {
  lessonNumber: number;
  lang: CfmLang;
  week: string; // e.g. "August 17–23"
  title: string; // e.g. "“The Lord Is My Shepherd”"
  scriptures: string; // e.g. "Psalms 1–2; 8; 19–33; 40; 46"
  book: string; // e.g. "Psalms"
  url: string;
  fetchedAt: string;
}

export function computeLessonNumber(now: Date = new Date()): number {
  const weeks = Math.floor((now.getTime() - ANCHOR_MONDAY_UTC_MS) / WEEK_MS);
  const lesson = ANCHOR_LESSON + weeks;
  return Math.max(MIN_LESSON, Math.min(MAX_LESSON, lesson));
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchLessonFromChurch(lessonNumber: number, lang: CfmLang): Promise<CfmLesson | null> {
  const url = `${MANUAL_BASE}/${lessonNumber}?lang=${lang}`;
  const res = await fetch(url, {
    redirect: 'manual',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html',
    },
  });
  if (!res.ok) return null;
  const html = await res.text();

  // <p class="title-number">August 17–23: “The Lord Is My Shepherd”</p>
  const titleNumberMatch = html.match(/<p class="title-number"[^>]*>([\s\S]*?)<\/p>/);
  // <h1 ...>Psalms 1–2; 8; …</h1> (scripture links inside)
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!titleNumberMatch || !h1Match) return null;

  const titleNumber = stripTags(titleNumberMatch[1]); // "August 17–23: “The Lord Is My Shepherd”"
  const scriptures = stripTags(h1Match[1]);
  if (!titleNumber || !scriptures) return null;

  const colonIdx = titleNumber.indexOf(':');
  const week = colonIdx > 0 ? titleNumber.slice(0, colonIdx).trim() : titleNumber;
  const title = colonIdx > 0 ? titleNumber.slice(colonIdx + 1).trim() : '';

  // Book label = leading text before the first digit ("Psalms", "Mga Awit")
  const bookMatch = scriptures.match(/^([^\d]+)/);
  const book = bookMatch ? bookMatch[1].replace(/[;,\s]+$/, '').trim() : '';

  return {
    lessonNumber,
    lang,
    week,
    title,
    scriptures,
    book,
    url,
    fetchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Cached endpoint handler
// ---------------------------------------------------------------------------

import { readCacheKey, writeCacheKey } from './store.js';

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 8; // a lesson stays valid for its week

export interface CfmResult {
  status: number;
  body: any;
}

export async function handleCfmLesson(langParam: string | undefined, forceRefresh = false): Promise<CfmResult> {
  const lang: CfmLang = langParam === 'tgl' ? 'tgl' : 'eng';
  const lessonNumber = computeLessonNumber();
  const cacheKey = `cfm:${lessonNumber}:${lang}`;

  if (!forceRefresh) {
    const cached = await readCacheKey<CfmLesson>(cacheKey).catch(() => null);
    if (cached && cached.title) {
      return { status: 200, body: { source: 'cache', ...cached } };
    }
  }

  try {
    const lesson = await fetchLessonFromChurch(lessonNumber, lang);
    if (lesson) {
      await writeCacheKey(cacheKey, lesson, CACHE_TTL_SECONDS);
      return { status: 200, body: { source: 'live', ...lesson } };
    }
  } catch (err: any) {
    console.warn('CFM lesson fetch failed:', err?.message || err);
  }

  // Fetch failed — serve stale cache if present, else 502 so the client
  // falls back to its built-in lesson.
  const stale = await readCacheKey<CfmLesson>(cacheKey).catch(() => null);
  if (stale && stale.title) {
    return { status: 200, body: { source: 'stale-cache', ...stale } };
  }
  return { status: 502, body: { error: 'Could not load this week\'s lesson' } };
}
