/**
 * Admin login — credentials are supplied via environment variables
 * (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SUPERADMIN_PASSWORD) so they
 * never ship in the client bundle or the repository.
 *
 * Shared by the local Express server (server.ts) and the Vercel
 * serverless function (api/auth/login.ts).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export interface LoginResult {
  status: number;
  body: {
    success: boolean;
    error?: string;
    token?: string;
    user?: {
      email: string;
      name: string;
      role: 'admin' | 'superadmin';
      lastLogin: string;
    };
  };
}

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function signingSecret(): string {
  // Dedicated AUTH_SECRET wins; otherwise derive from the credential env
  // vars, which are already required for login to be configured at all.
  return (
    process.env.AUTH_SECRET ||
    `${process.env.ADMIN_PASSWORD || ''}|${process.env.SUPERADMIN_PASSWORD || ''}`
  );
}

function hmac(payload: string): string {
  return createHmac('sha256', signingSecret()).update(payload).digest('base64url');
}

export function createSessionToken(email: string, role: 'admin' | 'superadmin'): string {
  const payload = Buffer.from(
    JSON.stringify({ e: email, r: role, x: Date.now() + TOKEN_TTL_MS })
  ).toString('base64url');
  return `${payload}.${hmac(payload)}`;
}

export function verifySessionToken(token: string | undefined): { email: string; role: 'admin' | 'superadmin' } | null {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  try {
    const expected = hmac(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof decoded.x !== 'number' || decoded.x < Date.now()) return null;
    if (decoded.r !== 'admin' && decoded.r !== 'superadmin') return null;
    return { email: String(decoded.e || ''), role: decoded.r };
  } catch {
    return null;
  }
}

export function handleLogin(reqBody: any): LoginResult {
  const { type, email, password } = reqBody || {};

  if (typeof password !== 'string' || !password.trim()) {
    return { status: 400, body: { success: false, error: 'Password is required.' } };
  }

  if (type === 'admin') {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    if (!adminEmail || !adminPassword) {
      return { status: 500, body: { success: false, error: 'Admin login is not configured on the server.' } };
    }
    if (
      typeof email === 'string' &&
      email.trim().toLowerCase() === adminEmail &&
      password.trim() === adminPassword
    ) {
      return {
        status: 200,
        body: {
          success: true,
          token: createSessionToken(adminEmail, 'admin'),
          user: {
            email: adminEmail,
            name: process.env.ADMIN_NAME || 'Ward Admin',
            role: 'admin',
            lastLogin: new Date().toISOString(),
          },
        },
      };
    }
    return { status: 401, body: { success: false, error: 'Invalid email or password. Please check your credentials.' } };
  }

  if (type === 'superadmin') {
    const superPassword = process.env.SUPERADMIN_PASSWORD || '';
    if (!superPassword) {
      return { status: 500, body: { success: false, error: 'Superadmin login is not configured on the server.' } };
    }
    if (password.trim() === superPassword) {
      return {
        status: 200,
        body: {
          success: true,
          token: createSessionToken(process.env.SUPERADMIN_EMAIL || 'superadmin@masagana2nd.org', 'superadmin'),
          user: {
            email: process.env.SUPERADMIN_EMAIL || 'superadmin@masagana2nd.org',
            name: 'Super Administrator',
            role: 'superadmin',
            lastLogin: new Date().toISOString(),
          },
        },
      };
    }
    return { status: 401, body: { success: false, error: 'Invalid Superadmin password.' } };
  }

  return { status: 400, body: { success: false, error: 'Invalid login type.' } };
}
