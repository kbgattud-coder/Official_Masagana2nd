/**
 * IndexedDB Persistent Storage Service
 * Provides gigabyte-scale storage capacity for photos, albums, announcements, and articles,
 * completely preventing browser localStorage 5MB quota exhaustion errors.
 */

const DB_NAME = 'MasaganaWardDB';
const DB_VERSION = 1;

export const STORES = {
  GALLERY: 'gallery',
  ALBUMS: 'albums',
  ANNOUNCEMENTS: 'announcements',
  ARTICLES: 'articles',
  SETTINGS: 'settings',
} as const;

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if not existing
        if (!db.objectStoreNames.contains(STORES.GALLERY)) {
          db.createObjectStore(STORES.GALLERY, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.ALBUMS)) {
          db.createObjectStore(STORES.ALBUMS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.ANNOUNCEMENTS)) {
          db.createObjectStore(STORES.ANNOUNCEMENTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.ARTICLES)) {
          db.createObjectStore(STORES.ARTICLES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`IndexedDB getAll(${storeName}) failed:`, err);
      return [];
    }
  }

  async setAll<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        // Clear existing and replace with new batch
        const clearReq = store.clear();
        clearReq.onsuccess = () => {
          for (const item of items) {
            store.put(item);
          }
        };

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn(`IndexedDB setAll(${storeName}) failed:`, err);
    }
  }

  async putItem<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn(`IndexedDB putItem(${storeName}) failed:`, err);
    }
  }

  async deleteItem(storeName: string, id: string): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn(`IndexedDB deleteItem(${storeName}, ${id}) failed:`, err);
    }
  }

  async clearStore(storeName: string): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn(`IndexedDB clearStore(${storeName}) failed:`, err);
    }
  }
}

export const idbService = new IndexedDbService();
