import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Admin login — credentials are supplied via environment variables
 * (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SUPERADMIN_PASSWORD) so they
 * never ship in the client bundle or the repository.
 */
app.post('/api/auth/login', (req, res) => {
  const { type, email, password } = req.body || {};

  if (typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ success: false, error: 'Password is required.' });
  }

  if (type === 'admin') {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ success: false, error: 'Admin login is not configured on the server.' });
    }
    if (
      typeof email === 'string' &&
      email.trim().toLowerCase() === adminEmail &&
      password.trim() === adminPassword
    ) {
      return res.json({
        success: true,
        user: {
          email: adminEmail,
          name: process.env.ADMIN_NAME || 'Ward Admin',
          role: 'admin',
          lastLogin: new Date().toISOString(),
        },
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid email or password. Please check your credentials.' });
  }

  if (type === 'superadmin') {
    const superPassword = process.env.SUPERADMIN_PASSWORD || '';
    if (!superPassword) {
      return res.status(500).json({ success: false, error: 'Superadmin login is not configured on the server.' });
    }
    if (password.trim() === superPassword) {
      return res.json({
        success: true,
        user: {
          email: process.env.SUPERADMIN_EMAIL || 'superadmin@masagana2nd.org',
          name: 'Super Administrator',
          role: 'superadmin',
          lastLogin: new Date().toISOString(),
        },
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid Superadmin password.' });
  }

  return res.status(400).json({ success: false, error: 'Invalid login type.' });
});

/**
 * Helper to extract Google Drive Folder ID from link or raw ID
 */
function parseFolderId(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]{10,})/);
  if (folderMatch && folderMatch[1]) return folderMatch[1];

  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (dMatch && dMatch[1]) return dMatch[1];

  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Public Google Drive Folder Parser Endpoint
 * Resolves photos from shared Google Drive folders without requiring client OAuth login.
 */
app.get('/api/drive/folder-photos', async (req, res) => {
  const folderParam = req.query.folderId as string;
  if (!folderParam) {
    return res.status(400).json({ error: 'Missing folderId parameter' });
  }

  const folderId = parseFolderId(folderParam);
  if (!folderId) {
    return res.status(400).json({ error: 'Invalid Google Drive folder ID or URL' });
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '';

  // 1. If an API key is present, try Google Drive REST API
  if (apiKey) {
    try {
      const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType contains 'image/'`);
      const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink,webViewLink,webContentLink,createdTime,description,size)');
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100&orderBy=createdTime+desc&key=${encodeURIComponent(apiKey)}`;
      
      const apiRes = await fetch(apiUrl);
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.files && Array.isArray(data.files)) {
          const photos = data.files.map((file: any) => ({
            id: file.id,
            name: file.name ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Ward Photo',
            directImageUrl: `https://lh3.googleusercontent.com/d/${file.id}`,
            thumbnailUrl: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
            webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
            date: file.createdTime ? new Date(file.createdTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : undefined,
            caption: file.description || file.name,
            sizeBytes: file.size ? Number(file.size) : undefined,
          }));

          return res.json({
            source: 'api',
            folderId,
            count: photos.length,
            photos,
          });
        }
      }
    } catch (apiErr) {
      console.warn('Drive REST API failed, falling back to public HTML scraper:', apiErr);
    }
  }

  // 2. Fetch and parse public embedded folder view (No API key or OAuth required for public folders)
  try {
    const embeddedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    const folderViewUrl = `https://drive.google.com/drive/folders/${folderId}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    };

    const [embeddedRes, mainRes] = await Promise.allSettled([
      fetch(embeddedUrl, { headers }),
      fetch(folderViewUrl, { headers }),
    ]);

    const embeddedHtml = embeddedRes.status === 'fulfilled' && embeddedRes.value.ok ? await embeddedRes.value.text() : '';
    const mainHtml = mainRes.status === 'fulfilled' && mainRes.value.ok ? await mainRes.value.text() : '';
    const combinedHtml = `${embeddedHtml}\n${mainHtml}`;

    const extractedFilesMap = new Map<string, { id: string; name: string }>();

    // Extraction Pattern A: Embedded flip-entry structures
    // <div class="flip-entry" id="entry-FILE_ID">...<div class="flip-entry-title">TITLE</div>
    const entryRegex = /id="entry-([a-zA-Z0-9_-]{15,})"[\s\S]*?(?:class="flip-entry-title"[^>]*>([^<]+)<\/div>)?/g;
    let match;
    while ((match = entryRegex.exec(embeddedHtml)) !== null) {
      const fileId = match[1];
      const title = match[2] ? match[2].trim() : 'Ward Photo';
      if (fileId && fileId !== folderId) {
        extractedFilesMap.set(fileId, {
          id: fileId,
          name: title.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        });
      }
    }

    // Extraction Pattern B: File view URLs & Thumbnail IDs
    // href="https://drive.google.com/file/d/FILE_ID/view" or thumbnail?id=FILE_ID
    const idRegex = /(?:thumbnail\?id=|\/file\/d\/|data-id=")([a-zA-Z0-9_-]{15,})/g;
    while ((match = idRegex.exec(combinedHtml)) !== null) {
      const fileId = match[1];
      if (fileId && fileId !== folderId && !extractedFilesMap.has(fileId)) {
        extractedFilesMap.set(fileId, {
          id: fileId,
          name: 'Ward Photo',
        });
      }
    }

    // Extraction Pattern C: JSON-like data patterns in main page JS (_DRIVE_ivd data)
    const jsonMatch = combinedHtml.match(/_DRIVE_ivd\s*=\s*'(\[[^']+\])'/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const decoded = JSON.parse(jsonMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
        if (Array.isArray(decoded)) {
          for (const item of decoded) {
            if (Array.isArray(item) && item[0] && typeof item[0] === 'string' && item[0].length >= 15) {
              const fId = item[0];
              const fName = typeof item[1] === 'string' ? item[1] : 'Ward Photo';
              if (fId !== folderId && !extractedFilesMap.has(fId)) {
                extractedFilesMap.set(fId, {
                  id: fId,
                  name: fName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                });
              }
            }
          }
        }
      } catch (jsonErr) {
        // Ignore json parse error, regex fallback handles it
      }
    }

    const filesArray = Array.from(extractedFilesMap.values());

    const photos = filesArray.map((file, idx) => ({
      id: file.id,
      name: file.name === 'Ward Photo' ? `Ward Photo ${idx + 1}` : file.name,
      directImageUrl: `https://lh3.googleusercontent.com/d/${file.id}`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
      webViewLink: `https://drive.google.com/file/d/${file.id}/view`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      caption: file.name === 'Ward Photo' ? undefined : file.name,
    }));

    return res.json({
      source: 'public_folder',
      folderId,
      count: photos.length,
      photos,
      embeddedViewUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
    });
  } catch (err: any) {
    console.error('Error in /api/drive/folder-photos:', err);
    return res.status(500).json({
      error: 'Failed to parse Google Drive folder',
      message: err.message || 'Unknown error',
      folderId,
      embeddedViewUrl: `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
    });
  }
});

// Vite middleware & Static assets handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ward Website server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
