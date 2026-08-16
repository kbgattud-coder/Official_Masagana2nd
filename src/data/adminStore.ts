import { useState, useEffect } from 'react';
import { Announcement, GalleryItem, Album, BlogPost, AdminUser } from '../types';
import { WARD_ANNOUNCEMENTS, GALLERY_ITEMS, BLOG_POSTS } from './wardData';
import { idbService, STORES } from '../services/indexedDbService';

const STORAGE_KEYS = {
  ANNOUNCEMENTS: 'masagana_admin_announcements_v1',
  GALLERY: 'masagana_admin_gallery_v1',
  ALBUMS: 'masagana_admin_albums_v1',
  ARTICLES: 'masagana_admin_articles_v1',
  AUTH: 'masagana_admin_auth_user_v1',
};

const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb-1',
    title: 'Ward Activities & Fellowship 2026',
    category: 'Ward Activities',
    description: 'Moments from our ward salu-salo, sports fellowship, and family gatherings at Masagana Chapel.',
    coverImageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
    date: 'June 2026',
    itemCount: 1,
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'alb-2',
    title: 'Youth Mountain Trails & Sunrise Fireside',
    category: 'Youth',
    description: 'Masagana 2nd Ward Young Men and Young Women hiking through the Antipolo highlands.',
    coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    date: 'July 2026',
    itemCount: 1,
    createdAt: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 'alb-3',
    title: 'Helping Hands Watershed Tree Planting',
    category: 'Elders Quorum',
    description: 'Community service project planting 200 fruit-bearing trees along the Antipolo mountain watershed.',
    coverImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
    date: 'August 2026',
    itemCount: 1,
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'alb-4',
    title: 'Primary Art & Scripture Story Presentation',
    category: 'Primary',
    description: 'Primary children showcasing their illustrated Book of Mormon drawings and testimonies.',
    coverImageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?q=80&w=800&auto=format&fit=crop',
    date: 'April 2026',
    itemCount: 1,
    createdAt: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'alb-5',
    title: 'Antipolo Stake Conference & Multi-Ward Choir',
    category: 'Stake',
    description: 'Antipolo Philippines Stake conference gathering with sacred musical numbers and inspiring messages.',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    date: 'May 2026',
    itemCount: 1,
    createdAt: '2026-05-01T00:00:00.000Z',
  },
  {
    id: 'alb-6',
    title: 'Relief Society Ministering & Homemaking Workshop',
    category: 'Relief Society',
    description: 'Relief Society sisters gathering for food preparation, emergency preparedness, and sisterhood fellowship.',
    coverImageUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?q=80&w=800&auto=format&fit=crop',
    date: 'August 2026',
    itemCount: 1,
    createdAt: '2026-08-10T00:00:00.000Z',
  }
];

// Helper to safely read JSON from localStorage
function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

// In-Memory Active Cache for synchronous render performance
const _memoryCache = {
  announcements: getLocalItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, WARD_ANNOUNCEMENTS),
  gallery: getLocalItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, GALLERY_ITEMS),
  albums: getLocalItem<Album[]>(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS),
  articles: getLocalItem<BlogPost[]>(STORAGE_KEYS.ARTICLES, BLOG_POSTS),
  auth: getLocalItem<AdminUser | null>(STORAGE_KEYS.AUTH, null),
  isIdbLoaded: false,
};

// Asynchronously load & synchronize with IndexedDB on startup
async function initIndexedDbSync() {
  if (_memoryCache.isIdbLoaded || typeof window === 'undefined') return;

  try {
    const [idbAnn, idbGal, idbAlb, idbArt] = await Promise.all([
      idbService.getAll<Announcement>(STORES.ANNOUNCEMENTS),
      idbService.getAll<GalleryItem>(STORES.GALLERY),
      idbService.getAll<Album>(STORES.ALBUMS),
      idbService.getAll<BlogPost>(STORES.ARTICLES),
    ]);

    let hasUpdates = false;

    if (idbAnn && idbAnn.length > 0) {
      _memoryCache.announcements = idbAnn;
      hasUpdates = true;
    } else {
      idbService.setAll(STORES.ANNOUNCEMENTS, _memoryCache.announcements);
    }

    if (idbGal && idbGal.length > 0) {
      _memoryCache.gallery = idbGal;
      hasUpdates = true;
    } else {
      idbService.setAll(STORES.GALLERY, _memoryCache.gallery);
    }

    if (idbAlb && idbAlb.length > 0) {
      _memoryCache.albums = idbAlb;
      hasUpdates = true;
    } else {
      idbService.setAll(STORES.ALBUMS, _memoryCache.albums);
    }

    if (idbArt && idbArt.length > 0) {
      _memoryCache.articles = idbArt;
      hasUpdates = true;
    } else {
      idbService.setAll(STORES.ARTICLES, _memoryCache.articles);
    }

    _memoryCache.isIdbLoaded = true;

    if (hasUpdates) {
      window.dispatchEvent(new Event('masagana_data_updated'));
    }
  } catch (err) {
    console.warn('IndexedDB initial sync warning:', err);
  }
}

// Start IDB synchronization in background
if (typeof window !== 'undefined') {
  initIndexedDbSync();
}

// Helper to safely write to localStorage with quota-overflow protection
function setLocalItemSafe<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    // If quota exceeded, optimize/prune localStorage to prevent app crashes
    console.warn(`LocalStorage quota reached for key "${key}". Preserving full data in IndexedDB.`);
    try {
      // If it's the gallery, try saving a compact version (or clear the oversized key)
      if (key === STORAGE_KEYS.GALLERY && Array.isArray(value)) {
        // Keep non-base64 items in localStorage cache to save space
        const lightweight = value.map(item => {
          if (item.imageUrl && item.imageUrl.startsWith('data:')) {
            return {
              ...item,
              imageUrl: item.driveFileUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
            };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(lightweight));
      }
    } catch {
      // If still full, safely remove just the oversized cache key; memory & IDB remain intact
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  }

  window.dispatchEvent(new Event('masagana_data_updated'));
}

// Auth methods
async function requestLogin(payload: {
  type: 'admin' | 'superadmin';
  email?: string;
  password: string;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success && data.user) {
      const user: AdminUser = data.user;
      _memoryCache.auth = user;
      setLocalItemSafe(STORAGE_KEYS.AUTH, user);
      return { success: true, user };
    }
    return { success: false, error: data?.error || 'Login failed. Please try again.' };
  } catch {
    return { success: false, error: 'Could not reach the login server. Please try again.' };
  }
}

export const AdminAuth = {
  loginAdmin(email: string, pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    return requestLogin({ type: 'admin', email: email.trim(), password: pass.trim() });
  },

  loginSuperAdmin(pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    return requestLogin({ type: 'superadmin', password: pass.trim() });
  },

  getCurrentUser(): AdminUser | null {
    return _memoryCache.auth || getLocalItem<AdminUser | null>(STORAGE_KEYS.AUTH, null);
  },

  logout(): void {
    _memoryCache.auth = null;
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      window.dispatchEvent(new Event('masagana_data_updated'));
    } catch {
      // Ignored
    }
  }
};

// Data Store API
export const AdminStore = {
  // Announcements
  getAnnouncements(): Announcement[] {
    return _memoryCache.announcements || WARD_ANNOUNCEMENTS;
  },

  saveAnnouncement(ann: Announcement): void {
    const items = AdminStore.getAnnouncements();
    const existingIdx = items.findIndex(i => i.id === ann.id);
    let updated: Announcement[];
    if (existingIdx >= 0) {
      updated = [...items];
      updated[existingIdx] = { ...ann };
    } else {
      updated = [{ ...ann, id: ann.id || `ann-${Date.now()}` }, ...items];
    }
    _memoryCache.announcements = updated;
    idbService.setAll(STORES.ANNOUNCEMENTS, updated);
    setLocalItemSafe(STORAGE_KEYS.ANNOUNCEMENTS, updated);
  },

  deleteAnnouncement(id: string): void {
    const items = AdminStore.getAnnouncements().filter(i => i.id !== id);
    _memoryCache.announcements = items;
    idbService.deleteItem(STORES.ANNOUNCEMENTS, id);
    setLocalItemSafe(STORAGE_KEYS.ANNOUNCEMENTS, items);
  },

  togglePinAnnouncement(id: string): void {
    const items = AdminStore.getAnnouncements().map(i => {
      if (i.id === id) {
        return { ...i, isPinned: !i.isPinned };
      }
      return i;
    });
    _memoryCache.announcements = items;
    idbService.setAll(STORES.ANNOUNCEMENTS, items);
    setLocalItemSafe(STORAGE_KEYS.ANNOUNCEMENTS, items);
  },

  // Albums
  getAlbums(): Album[] {
    return _memoryCache.albums || INITIAL_ALBUMS;
  },

  saveAlbum(album: Album): void {
    const items = AdminStore.getAlbums();
    const existingIdx = items.findIndex(i => i.id === album.id);
    let updated: Album[];
    if (existingIdx >= 0) {
      updated = [...items];
      updated[existingIdx] = { ...album };
    } else {
      updated = [{ ...album, id: album.id || `alb-${Date.now()}` }, ...items];
    }
    _memoryCache.albums = updated;
    idbService.setAll(STORES.ALBUMS, updated);
    setLocalItemSafe(STORAGE_KEYS.ALBUMS, updated);
  },

  deleteAlbum(id: string): void {
    const items = AdminStore.getAlbums().filter(i => i.id !== id);
    _memoryCache.albums = items;
    idbService.deleteItem(STORES.ALBUMS, id);
    setLocalItemSafe(STORAGE_KEYS.ALBUMS, items);
  },

  // Gallery Items (High capacity with IndexedDB backend)
  getGalleryItems(): GalleryItem[] {
    return _memoryCache.gallery || GALLERY_ITEMS;
  },

  saveGalleryItem(item: GalleryItem): void {
    const items = AdminStore.getGalleryItems();
    const existingIdx = items.findIndex(i => i.id === item.id);
    let updated: GalleryItem[];
    if (existingIdx >= 0) {
      updated = [...items];
      updated[existingIdx] = { ...item };
    } else {
      updated = [{ ...item, id: item.id || `gal-${Date.now()}` }, ...items];
    }
    _memoryCache.gallery = updated;
    
    // Save to IndexedDB (virtually unlimited quota)
    idbService.setAll(STORES.GALLERY, updated);
    setLocalItemSafe(STORAGE_KEYS.GALLERY, updated);

    // Update album item count if linked
    if (item.albumId) {
      const albums = AdminStore.getAlbums().map(alb => {
        if (alb.id === item.albumId) {
          return { ...alb, itemCount: (alb.itemCount || 0) + 1 };
        }
        return alb;
      });
      _memoryCache.albums = albums;
      idbService.setAll(STORES.ALBUMS, albums);
      setLocalItemSafe(STORAGE_KEYS.ALBUMS, albums);
    }
  },

  saveMultipleGalleryItems(newItems: GalleryItem[]): void {
    if (!newItems || newItems.length === 0) return;
    const currentItems = AdminStore.getGalleryItems();
    const preparedItems = newItems.map((item, idx) => ({
      ...item,
      id: item.id || `gal-${Date.now()}-${idx}`,
    }));
    const updated = [...preparedItems, ...currentItems];
    _memoryCache.gallery = updated;

    // Save to IndexedDB immediately
    idbService.setAll(STORES.GALLERY, updated);
    setLocalItemSafe(STORAGE_KEYS.GALLERY, updated);

    // Update album counts
    const albumCounts: Record<string, number> = {};
    for (const it of preparedItems) {
      if (it.albumId) {
        albumCounts[it.albumId] = (albumCounts[it.albumId] || 0) + 1;
      }
    }

    if (Object.keys(albumCounts).length > 0) {
      const albums = AdminStore.getAlbums().map(alb => {
        if (albumCounts[alb.id]) {
          return { ...alb, itemCount: (alb.itemCount || 0) + albumCounts[alb.id] };
        }
        return alb;
      });
      _memoryCache.albums = albums;
      idbService.setAll(STORES.ALBUMS, albums);
      setLocalItemSafe(STORAGE_KEYS.ALBUMS, albums);
    }
  },

  deleteGalleryItem(id: string): void {
    const items = AdminStore.getGalleryItems().filter(i => i.id !== id);
    _memoryCache.gallery = items;
    idbService.deleteItem(STORES.GALLERY, id);
    setLocalItemSafe(STORAGE_KEYS.GALLERY, items);
  },

  // Articles / Blog Posts
  getArticles(): BlogPost[] {
    return _memoryCache.articles || BLOG_POSTS;
  },

  saveArticle(article: BlogPost): void {
    const items = AdminStore.getArticles();
    const existingIdx = items.findIndex(i => i.id === article.id);
    let updated: BlogPost[];
    if (existingIdx >= 0) {
      updated = [...items];
      updated[existingIdx] = { ...article };
    } else {
      updated = [{ ...article, id: article.id || `post-${Date.now()}` }, ...items];
    }
    _memoryCache.articles = updated;
    idbService.setAll(STORES.ARTICLES, updated);
    setLocalItemSafe(STORAGE_KEYS.ARTICLES, updated);
  },

  deleteArticle(id: string): void {
    const items = AdminStore.getArticles().filter(i => i.id !== id);
    _memoryCache.articles = items;
    idbService.deleteItem(STORES.ARTICLES, id);
    setLocalItemSafe(STORAGE_KEYS.ARTICLES, items);
  },

  toggleFeaturedArticle(id: string): void {
    const items = AdminStore.getArticles().map(i => {
      if (i.id === id) {
        return { ...i, featured: !i.featured };
      }
      return i;
    });
    _memoryCache.articles = items;
    idbService.setAll(STORES.ARTICLES, items);
    setLocalItemSafe(STORAGE_KEYS.ARTICLES, items);
  },

  // Manual Quota Cleanup & Cache Optimization
  cleanLocalQuotaCache(): void {
    try {
      // Clear oversized localStorage keys; memory and IndexedDB retain all data
      localStorage.removeItem(STORAGE_KEYS.GALLERY);
      setLocalItemSafe(STORAGE_KEYS.ANNOUNCEMENTS, _memoryCache.announcements);
      setLocalItemSafe(STORAGE_KEYS.ALBUMS, _memoryCache.albums);
      setLocalItemSafe(STORAGE_KEYS.ARTICLES, _memoryCache.articles);
      window.dispatchEvent(new Event('masagana_data_updated'));
    } catch (err) {
      console.warn('Quota cache clean error:', err);
    }
  },

  // Reset to default seed
  async resetToDefaults(): Promise<void> {
    _memoryCache.announcements = WARD_ANNOUNCEMENTS;
    _memoryCache.gallery = GALLERY_ITEMS;
    _memoryCache.albums = INITIAL_ALBUMS;
    _memoryCache.articles = BLOG_POSTS;

    await Promise.all([
      idbService.setAll(STORES.ANNOUNCEMENTS, WARD_ANNOUNCEMENTS),
      idbService.setAll(STORES.GALLERY, GALLERY_ITEMS),
      idbService.setAll(STORES.ALBUMS, INITIAL_ALBUMS),
      idbService.setAll(STORES.ARTICLES, BLOG_POSTS),
    ]);

    setLocalItemSafe(STORAGE_KEYS.ANNOUNCEMENTS, WARD_ANNOUNCEMENTS);
    setLocalItemSafe(STORAGE_KEYS.GALLERY, GALLERY_ITEMS);
    setLocalItemSafe(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
    setLocalItemSafe(STORAGE_KEYS.ARTICLES, BLOG_POSTS);
  }
};

// React Hook for dynamic, real-time subscription
export function useAdminData() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => AdminStore.getAnnouncements());
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => AdminStore.getGalleryItems());
  const [albums, setAlbums] = useState<Album[]>(() => AdminStore.getAlbums());
  const [articles, setArticles] = useState<BlogPost[]>(() => AdminStore.getArticles());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => AdminAuth.getCurrentUser());

  useEffect(() => {
    const handleUpdate = () => {
      setAnnouncements(AdminStore.getAnnouncements());
      setGalleryItems(AdminStore.getGalleryItems());
      setAlbums(AdminStore.getAlbums());
      setArticles(AdminStore.getArticles());
      setCurrentUser(AdminAuth.getCurrentUser());
    };

    window.addEventListener('masagana_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('masagana_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    currentUser,
    announcements,
    galleryItems,
    albums,
    articles,
    // Methods
    saveAnnouncement: AdminStore.saveAnnouncement,
    deleteAnnouncement: AdminStore.deleteAnnouncement,
    togglePinAnnouncement: AdminStore.togglePinAnnouncement,
    saveAlbum: AdminStore.saveAlbum,
    deleteAlbum: AdminStore.deleteAlbum,
    saveGalleryItem: AdminStore.saveGalleryItem,
    saveMultipleGalleryItems: AdminStore.saveMultipleGalleryItems,
    deleteGalleryItem: AdminStore.deleteGalleryItem,
    saveArticle: AdminStore.saveArticle,
    deleteArticle: AdminStore.deleteArticle,
    toggleFeaturedArticle: AdminStore.toggleFeaturedArticle,
    cleanLocalQuotaCache: AdminStore.cleanLocalQuotaCache,
    logout: AdminAuth.logout,
    resetToDefaults: AdminStore.resetToDefaults,
  };
}

