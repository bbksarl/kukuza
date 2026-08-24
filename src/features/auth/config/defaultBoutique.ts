import { User } from '../domain/auth/entities/User';
import type { AuthResult } from '../domain/auth/types';

const DEFAULT_BOUTIQUE_EMAIL = import.meta.env.VITE_DEFAULT_BOUTIQUE_EMAIL ?? '';
const DEFAULT_BOUTIQUE_PASSWORD = import.meta.env.VITE_DEFAULT_BOUTIQUE_PASSWORD ?? '';

/**
 * Compte de démonstration local pour ouvrir l'espace boutique sans backend.
 *
 * Cette voie est désactivée dans les builds de production : le service C#
 * reste l'unique source d'authentification lorsqu'une application est publiée.
 */
export const getDevelopmentBoutique = (email: string, password: string): AuthResult | null => {
  if (!import.meta.env.DEV || !DEFAULT_BOUTIQUE_EMAIL || !DEFAULT_BOUTIQUE_PASSWORD) return null;

  if (
    email.trim().toLowerCase() !== DEFAULT_BOUTIQUE_EMAIL.toLowerCase()
    || password !== DEFAULT_BOUTIQUE_PASSWORD
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
