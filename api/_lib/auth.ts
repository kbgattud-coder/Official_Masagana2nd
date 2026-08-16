/**
 * Admin login — credentials are supplied via environment variables
 * (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SUPERADMIN_PASSWORD) so they
 * never ship in the client bundle or the repository.
 *
 * Shared by the local Express server (server.ts) and the Vercel
 * serverless function (api/auth/login.ts).
 */

export interface LoginResult {
  status: number;
  body: {
    success: boolean;
    error?: string;
    user?: {
      email: string;
      name: string;
      role: 'admin' | 'superadmin';
      lastLogin: string;
    };
  };
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
