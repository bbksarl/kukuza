
const getApiBaseUrl = (): string => {
  // Essayer d'abord les variables d'environnement injectées par webpack
  const envUrl = typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL;
  
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  return 'https://api.kukuza.com';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_URLS = {
  auth: `${API_BASE_URL}/auth`,
  user: `${API_BASE_URL}/users`,
  analytics: `${API_BASE_URL}/analytics`,
  admin: `${API_BASE_URL}/admin`,
};

export const HTTP_CONFIG = {
  timeout: 10000,
  retries: 1,
  headers: {
    'Content-Type': 'application/json',
  },
};

if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
  console.warn(
    '⚠️  API_BASE_URL is localhost. ' +
    'Ensure REACT_APP_API_BASE_URL is set for production.'
  );
}
