/**
 * Configuration de l'API Auth
 * À adapter selon votre environnement
 */

// URL par défaut en développement
const DEFAULT_API_BASE_URL = '/api';

// Obtenir l'URL depuis les variables d'environnement
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    const environment = (globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }).process?.env ?? (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
    return (environment.REACT_APP_API_BASE_URL || environment.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
  }
  // Server-side (SSR si besoin)
  const environment = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env ?? {};
  return (environment.API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
};

export const authApiConfig = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh', // Pour token refresh futur
  },
  timeout: 10000, // 10 secondes
  retries: 1,
} as const;

// Valider que l'URL est configurée
export default authApiConfig;
