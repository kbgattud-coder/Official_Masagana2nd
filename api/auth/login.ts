import { handleLogin } from '../_lib/auth.js';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  const result = handleLogin(req.body);
  return res.status(result.status).json(result.body);
}
