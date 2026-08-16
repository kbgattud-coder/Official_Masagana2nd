/**
 * Shared handlers for the public content API.
 * GET  -> all collections for site visitors (public read).
 * PUT  -> replace one collection (requires a valid admin session token).
 *
 * Used by both the Vercel function (api/data.ts) and the local Express
 * server (server.ts).
 */

import { verifySessionToken } from './auth.js';
import { COLLECTIONS, CollectionName, isStoreConfigured, readCollection, writeCollection } from './store.js';

export interface DataResult {
  status: number;
  body: any;
}

export async function handleDataGet(): Promise<DataResult> {
  try {
    const [announcements, gallery, albums, articles] = await Promise.all(
      COLLECTIONS.map((c) => readCollection(c))
    );
    return {
      status: 200,
      body: {
        configured: isStoreConfigured(),
        announcements,
        gallery,
        albums,
        articles,
      },
    };
  } catch (err: any) {
    return {
      status: 500,
      body: { error: 'Failed to load shared content', message: err.message || 'Unknown error' },
    };
  }
}

export async function handleDataPut(authHeader: string | undefined, reqBody: any): Promise<DataResult> {
  const token = (authHeader || '').replace(/^Bearer\s+/i, '');
  const session = verifySessionToken(token);
  if (!session) {
    return { status: 401, body: { error: 'Your session has expired. Please sign in again.' } };
  }

  const { collection, items } = reqBody || {};
  if (!COLLECTIONS.includes(collection)) {
    return { status: 400, body: { error: 'Unknown collection name.' } };
  }
  if (!Array.isArray(items)) {
    return { status: 400, body: { error: 'Items must be an array.' } };
  }

  try {
    await writeCollection(collection as CollectionName, items);
    return { status: 200, body: { success: true, collection, count: items.length } };
  } catch (err: any) {
    return {
      status: 500,
      body: { error: 'Failed to save shared content', message: err.message || 'Unknown error' },
    };
  }
}
