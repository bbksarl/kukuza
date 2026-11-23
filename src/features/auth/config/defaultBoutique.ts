import { environment } from '@/config/environment.generated';
import { User } from '../domain/auth/entities/User';
import type { AuthResult } from '../domain/auth/types';
import { runtimeConfig } from '@/config/runtime';

const DEFAULT_BOUTIQUE_EMAIL = environment.VITE_DEFAULT_BOUTIQUE_EMAIL ?? '';
const DEFAULT_BOUTIQUE_PASSWORD = environment.VITE_DEFAULT_BOUTIQUE_PASSWORD ?? '';

/**
 * Compte local disponible en développement ou en mode démo explicite.
 */
export const getDevelopmentBoutique = (email: string, password: string): AuthResult | null => {
  if (!runtimeConfig.enableApiMocks || !DEFAULT_BOUTIQUE_EMAIL || !DEFAULT_BOUTIQUE_PASSWORD) return null;

  if (
    email.trim().toLowerCase() !== DEFAULT_BOUTIQUE_EMAIL.toLowerCase() ||
    password !== DEFAULT_BOUTIQUE_PASSWORD
  ) {
    return null;
  }

  return {
    user: new User(
      900001,
      'KUKUZA Boutique Démo',
      DEFAULT_BOUTIQUE_EMAIL,
      'creator',
      '2026-01-01T00:00:00.000Z',
    ),
    role: 'creator',
    redirectUrl: '/shop/dashboard',
  };
};
