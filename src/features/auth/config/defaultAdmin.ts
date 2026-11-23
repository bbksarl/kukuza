import { environment } from '@/config/environment.generated';
import { User } from '../domain/auth/entities/User';
import type { AuthResult } from '../domain/auth/types';
import { runtimeConfig } from '@/config/runtime';

const DEFAULT_ADMIN_EMAIL = environment.VITE_DEFAULT_ADMIN_EMAIL ?? '';
const DEFAULT_ADMIN_PASSWORD = environment.VITE_DEFAULT_ADMIN_PASSWORD ?? '';

/** Compte local disponible en développement ou en mode démo explicite. */
export const getDevelopmentAdmin = (email: string, password: string): AuthResult | null => {
  if (!runtimeConfig.enableApiMocks || !DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) return null;

  if (
    email.trim().toLowerCase() !== DEFAULT_ADMIN_EMAIL.toLowerCase() ||
    password !== DEFAULT_ADMIN_PASSWORD
  ) {
    return null;
  }

  return {
    user: new User(900000, 'Admin KUKUZA', DEFAULT_ADMIN_EMAIL, 'admin', '2026-01-01T00:00:00.000Z'),
    role: 'admin',
    redirectUrl: '/admin/dashboard',
  };
};
