/// <reference types="vite/client" />

/**
 * Google Drive Integration Service
 * Manages OAuth token, "Ward Website" root folder, per-album sub-folders, and photo uploads.
 */

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              expires_in?: number;
            }) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const TOKEN_STORAGE_KEY = 'ward_gdrive_token';
const EXPIRY_STORAGE_KEY = 'ward_gdrive_expires_at';
const MAIN_FOLDER_ID_KEY = 'ward_gdrive_main_folder_id';
const MAIN_FOLDER_URL_KEY = 'ward_gdrive_main_folder_url';
const CLIENT_ID_STORAGE_KEY = 'ward_gdrive_custom_client_id';

export interface DriveFolderInfo {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface DriveUploadResult {
  fileId: string;
  fileName: string;
  webViewLink: string;
  directImageUrl: string;
  thumbnailUrl?: string;
  folderId: string;
}

export interface DriveAuthState {
  isConnected: boolean;
  accessToken: string | null;
  expiresAt: number | null;
  mainFolderId: string | null;
  mainFolderUrl: string | null;
  clientId: string;
}

export interface DrivePhotoItem {
  id: string;
  name: string;
  directImageUrl: string;
  thumbnailUrl: string;
  webViewLink: string;
  date?: string;
  caption?: string;
  sizeBytes?: number;
}

export class GoogleDriveService {
  private static tokenClient: any = null;

  /**
   * Extract folder ID from various Google Drive URL formats or raw ID string.
   */
  static extractFolderId(input: string): string | null {
    if (!input || typeof input !== 'string') return null;
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Pattern 1: /folders/FOLDER_ID
    const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]{10,})/);
    if (folderMatch && folderMatch[1]) return folderMatch[1];

    // Pattern 2: id=FOLDER_ID
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

    // Pattern 3: /d/FOLDER_ID
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
    if (dMatch && dMatch[1]) return dMatch[1];

    // Pattern 4: Plain Folder ID (alphanumeric, underscores, hyphens, min 10 chars)
    if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
      return trimmed;
    }

    return null;
  }

  /**
   * Format Google Drive URL from folder ID
   */
  static formatFolderUrl(folderId: string): string {
    return `https://drive.google.com/drive/folders/${folderId}`;
  }

  /**
   * Direct high-resolution image URL resolver for Google Drive file IDs
   */
  static getDirectImageUrl(fileId: string): string {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  /**
   * Fast thumbnail URL resolver for Google Drive file IDs
   */
  static getThumbnailUrl(fileId: string, size = 600): string {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  }

  /**
   * Fetch image files inside a Google Drive folder.
   * Uses backend /api/drive/folder-photos resolver (supporting public shared folders),
   * with fallbacks for OAuth access tokens and API keys.
   */
  static async fetchPhotosFromFolder(folderIdOrUrl: string, apiKey?: string): Promise<DrivePhotoItem[]> {
    const folderId = this.extractFolderId(folderIdOrUrl);
    if (!folderId) {
      throw new Error('Invalid Google Drive folder link or folder ID.');
    }

    // 1. Primary Method: Query backend resolver endpoint
    try {
      const serverRes = await fetch(`/api/drive/folder-photos?folderId=${encodeURIComponent(folderId)}`);
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data && Array.isArray(data.photos)) {
          return data.photos;
        }
      }
    } catch (serverErr) {
      console.warn('Backend /api/drive/folder-photos request failed or unavailable:', serverErr);
    }

    // 2. Secondary Method: If OAuth token or API key is present, try Google Drive REST API
    const token = this.getAccessToken();
    const envApiKey = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';
    const keyToUse = apiKey || envApiKey;

    if (token || keyToUse) {
      const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType contains 'image/'`);
      const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink,webViewLink,webContentLink,createdTime,description,size)');
      let url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100&orderBy=createdTime+desc`;

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (keyToUse) {
        url += `&key=${encodeURIComponent(keyToUse)}`;
      }

      try {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.files && Array.isArray(data.files)) {
            return data.files.map((file: any) => ({
              id: file.id,
              name: file.name ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Ward Photo',
              directImageUrl: this.getDirectImageUrl(file.id),
              thumbnailUrl: file.thumbnailLink || this.getThumbnailUrl(file.id, 600),
              webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
              date: file.createdTime ? new Date(file.createdTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : undefined,
              caption: file.description || file.name,
              sizeBytes: file.size ? Number(file.size) : undefined,
            }));
          }
        }
      } catch (directApiErr) {
        console.warn('Direct Google Drive REST API attempt failed:', directApiErr);
      }
    }

    // 3. Fallback: Return empty array instead of crashing
    return [];
  }

  // Retrieve configured Google OAuth Client ID
  static getClientId(): string {
    const custom = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (custom && custom.trim()) return custom.trim();
    return (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
  }

  static setCustomClientId(clientId: string): void {
    if (clientId && clientId.trim()) {
      localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId.trim());
    } else {
      localStorage.removeItem(CLIENT_ID_STORAGE_KEY);
    }
  }

  // Get current active access token (checking expiry)
  static getAccessToken(): string | null {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const expiresAt = Number(localStorage.getItem(EXPIRY_STORAGE_KEY) || '0');
    if (!token) return null;
    if (Date.now() > expiresAt) {
      this.disconnect();
      return null;
    }
    return token;
  }

  static getAuthState(): DriveAuthState {
    const token = this.getAccessToken();
    const expiresAt = Number(localStorage.getItem(EXPIRY_STORAGE_KEY) || '0');
    const mainFolderId = localStorage.getItem(MAIN_FOLDER_ID_KEY);
    const mainFolderUrl = localStorage.getItem(MAIN_FOLDER_URL_KEY);

    return {
      isConnected: !!token,
      accessToken: token,
      expiresAt: expiresAt || null,
      mainFolderId: mainFolderId || null,
      mainFolderUrl: mainFolderUrl || null,
      clientId: this.getClientId(),
    };
  }

  // Request OAuth Access Token from Google
  static async requestDriveAccess(): Promise<string> {
    return new Promise((resolve, reject) => {
      const clientId = this.getClientId();
      if (!clientId) {
        reject(
          new Error(
            'Google OAuth Client ID is not configured. Please provide a Google Client ID in settings or .env.example.'
          )
        );
        return;
      }

      if (!window.google?.accounts?.oauth2) {
        reject(
          new Error(
            'Google Identity Services library is still loading. Please check your internet connection and retry.'
          )
        );
        return;
      }

      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: DRIVE_SCOPE,
          callback: (response) => {
            if (response.error) {
              reject(new Error(response.error));
              return;
            }
            if (response.access_token) {
              const expiresInMs = (response.expires_in || 3600) * 1000;
              const expiresAt = Date.now() + expiresInMs;
              localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
              localStorage.setItem(EXPIRY_STORAGE_KEY, expiresAt.toString());
              resolve(response.access_token);
            } else {
              reject(new Error('No access token received from Google'));
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to initialize Google OAuth client'));
      }
    });
  }

  static disconnect(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(EXPIRY_STORAGE_KEY);
  }

  // Get or Create the main "Ward Website" root folder in user's Google Drive
  static async getOrCreateMainFolder(): Promise<DriveFolderInfo> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Please connect your Google Drive account first.');
    }

    // Check cached ID
    const cachedId = localStorage.getItem(MAIN_FOLDER_ID_KEY);
    const cachedUrl = localStorage.getItem(MAIN_FOLDER_URL_KEY);
    if (cachedId) {
      try {
        const checkRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${cachedId}?fields=id,name,webViewLink,trashed`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (checkRes.ok) {
          const folderData = await checkRes.json();
          if (!folderData.trashed) {
            return {
              id: folderData.id,
              name: folderData.name,
              webViewLink: folderData.webViewLink || cachedUrl || `https://drive.google.com/drive/folders/${folderData.id}`,
            };
          }
        }
      } catch {
        // Fallback to search
      }
    }

    // Search for existing "Ward Website" folder in root
    const query = encodeURIComponent("name = 'Ward Website' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const folder = searchData.files[0];
        localStorage.setItem(MAIN_FOLDER_ID_KEY, folder.id);
        if (folder.webViewLink) localStorage.setItem(MAIN_FOLDER_URL_KEY, folder.webViewLink);
        return {
          id: folder.id,
          name: folder.name,
          webViewLink: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
        };
      }
    }

    // Create "Ward Website" folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Ward Website',
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Main storage repository for Masagana 2nd Ward website photos and album assets.',
      }),
    });

    if (!createRes.ok) {
      const errBody = await createRes.json().catch(() => ({}));
      throw new Error(errBody.error?.message || 'Failed to create "Ward Website" folder in Google Drive.');
    }

    const newFolder = await createRes.json();
    localStorage.setItem(MAIN_FOLDER_ID_KEY, newFolder.id);
    if (newFolder.webViewLink) localStorage.setItem(MAIN_FOLDER_URL_KEY, newFolder.webViewLink);

    // Make folder contents shareable as public reader so image links work in web gallery
    await this.setPublicReaderPermission(newFolder.id, token).catch(() => {});

    return {
      id: newFolder.id,
      name: newFolder.name,
      webViewLink: newFolder.webViewLink || `https://drive.google.com/drive/folders/${newFolder.id}`,
    };
  }

  // Get or Create subfolder for a specific album inside "Ward Website" main folder
  static async getOrCreateAlbumSubFolder(
    albumTitle: string,
    mainFolderId: string
  ): Promise<DriveFolderInfo> {
    const token = this.getAccessToken();
    if (!token) throw new Error('Please connect your Google Drive account first.');

    const cleanTitle = (albumTitle.trim() || 'General Photos').replace(/'/g, "\\'");

    // Search for existing subfolder inside main folder
    const query = encodeURIComponent(
      `name = '${cleanTitle}' and '${mainFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );

    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const folder = searchData.files[0];
        return {
          id: folder.id,
          name: folder.name,
          webViewLink: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
        };
      }
    }

    // Create subfolder inside "Ward Website" parent
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: albumTitle.trim() || 'General Photos',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [mainFolderId],
      }),
    });

    if (!createRes.ok) {
      const errBody = await createRes.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `Failed to create album folder "${albumTitle}" in Google Drive.`);
    }

    const subFolder = await createRes.json();
    await this.setPublicReaderPermission(subFolder.id, token).catch(() => {});

    return {
      id: subFolder.id,
      name: subFolder.name,
      webViewLink: subFolder.webViewLink || `https://drive.google.com/drive/folders/${subFolder.id}`,
    };
  }

  // Upload an image file directly to the album subfolder in Google Drive
  static async uploadPhotoToAlbum(
    file: File | Blob,
    fileName: string,
    albumFolderId: string,
    description?: string
  ): Promise<DriveUploadResult> {
    const token = this.getAccessToken();
    if (!token) throw new Error('Please connect your Google Drive account first.');

    const metadata = {
      name: fileName,
      parents: [albumFolderId],
      description: description || 'Photo uploaded from Masagana 2nd Ward Website',
      mimeType: file.type || 'image/jpeg',
    };

    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    formData.append('file', file);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to upload image "${fileName}" to Google Drive.`);
    }

    const fileData = await uploadRes.json();

    // Set permission to anyone with link can view so the image tag works in web gallery
    await this.setPublicReaderPermission(fileData.id, token).catch(() => {});

    // Direct image CDN link
    const directImageUrl = `https://lh3.googleusercontent.com/d/${fileData.id}`;

    return {
      fileId: fileData.id,
      fileName: fileData.name,
      webViewLink: fileData.webViewLink || `https://drive.google.com/file/d/${fileData.id}/view`,
      directImageUrl,
      thumbnailUrl: fileData.thumbnailLink || directImageUrl,
      folderId: albumFolderId,
    };
  }

  // Helper to set public reader permission on a drive file/folder
  private static async setPublicReaderPermission(fileId: string, token: string): Promise<void> {
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });
    } catch {
      // Non-blocking
    }
  }
}
