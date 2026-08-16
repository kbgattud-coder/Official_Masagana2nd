import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { handleLogin } from './api/_lib/auth.js';
import { fetchFolderPhotos } from './api/_lib/drive.js';
import { handleDataGet, handleDataPut } from './api/_lib/data.js';
import { handleCfmLesson } from './api/_lib/cfm.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin login — validated server-side against environment variables.
// Logic lives in api/_lib/auth.ts, shared with the Vercel function.
app.post('/api/auth/login', (req, res) => {
  const result = handleLogin(req.body);
  res.status(result.status).json(result.body);
});

// Shared content store — public read, token-authenticated write.
// Logic lives in api/_lib/data.ts, shared with the Vercel function.
app.get('/api/data', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const result = await handleDataGet();
  res.status(result.status).json(result.body);
});

app.put('/api/data', async (req, res) => {
  const result = await handleDataPut(req.headers['authorization'], req.body);
  res.status(result.status).json(result.body);
});

// Current week's Come, Follow Me lesson (self-updating).
app.get('/api/cfm-lesson', async (req, res) => {
  const result = await handleCfmLesson(req.query.lang as string | undefined, req.query.refresh === '1');
  res.status(result.status).json(result.body);
});

// Public Google Drive folder photo resolver.
// Logic lives in api/_lib/drive.ts, shared with the Vercel function.
app.get('/api/drive/folder-photos', async (req, res) => {
  const result = await fetchFolderPhotos(req.query.folderId as string | undefined);
  res.status(result.status).json(result.body);
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
