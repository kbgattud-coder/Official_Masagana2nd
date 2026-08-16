import { handleDataGet, handleDataPut } from './_lib/data.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const result = await handleDataGet();
    return res.status(result.status).json(result.body);
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const result = await handleDataPut(req.headers['authorization'], req.body);
    return res.status(result.status).json(result.body);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
