import { User } from '../domain/auth/entities/User';
import type { AuthResult } from '../domain/auth/types';

const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_DEFAULT_ADMIN_EMAIL ?? '';
const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD ?? '';

/**
 * Development-only bootstrap account.
 * Production authentication must be handled by the C# identity service.
 */
export const getDevelopmentAdmin = (email: string, password: string): AuthResult | null => {
  if (!import.meta.env.DEV || !DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) return null;

  if (email.trim().toLowerCase() !== DEFAULT_ADMIN_EMAIL.toLowerCase() || password !== DEFAULT_ADMIN_PASSWORD) {
    return null;
  }

  return {
    user: new User(
      900000,
      'Admin KUKUZA',
      DEFAULT_ADMIN_EMAIL,
      'admin',
      '2026-01-01T00:00:00.000Z',
    ),
    role: 'admin',
    redirectUrl: '/admin/dashboard',
  };
};
