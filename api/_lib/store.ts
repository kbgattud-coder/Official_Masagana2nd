/**
 * Shared content store backed by Upstash Redis (REST API).
 *
 * Holds the ward's admin-managed collections (announcements, gallery,
 * albums, articles) so edits publish globally instead of living in one
 * browser. Uses plain fetch against the Upstash REST endpoint — no SDK.
 *
 * When no Upstash env vars are present (e.g. local dev before setup),
 * falls back to an in-process memory map so the API still works; data
 * then resets whenever the dev server restarts.
 */

export const COLLECTIONS = ['announcements', 'gallery', 'albums', 'articles'] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

const KEY_PREFIX = 'masagana:';

function upstashConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  if (url && token) return { url: url.replace(/\/$/, ''), token };
  return null;
}

export function isStoreConfigured(): boolean {
  return upstashConfig() !== null;
}

// Dev-only fallback store (per server process)
const memoryStore = new Map<string, string>();

export async function readCollection(name: CollectionName): Promise<unknown[] | null> {
  const key = KEY_PREFIX + name;
  const cfg = upstashConfig();

  let raw: string | null = null;
  if (cfg) {
    const res = await fetch(`${cfg.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
    });
    if (!res.ok) {
      throw new Error(`Upstash read failed with status ${res.status}`);
    }
    const data = await res.json();
    raw = typeof data.result === 'string' ? data.result : null;
  } else {
    raw = memoryStore.get(key) ?? null;
  }

  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function writeCollection(name: CollectionName, items: unknown[]): Promise<void> {
  const key = KEY_PREFIX + name;
  const value = JSON.stringify(items);
  const cfg = upstashConfig();

  if (cfg) {
    // POST body form avoids URL-length limits on large payloads
    const res = await fetch(`${cfg.url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.token}` },
      body: value,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Upstash write failed with status ${res.status}: ${text.slice(0, 200)}`);
    }
  } else {
    memoryStore.set(key, value);
  }
}
