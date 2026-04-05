const DEFAULT_COOKIE_PATH = '/';

const isBrowser = () => typeof document !== 'undefined';

const getCookie = (name) => {
  if (!isBrowser()) {
    return null;
  }

  const encodedName = encodeURIComponent(name);
  const cookies = document.cookie ? document.cookie.split('; ') : [];

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf('=');
    const rawName = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie;

    if (rawName === encodedName) {
      const rawValue = separatorIndex >= 0 ? cookie.slice(separatorIndex + 1) : '';
      return decodeURIComponent(rawValue);
    }
  }

  return null;
};

const setCookie = (name, value, options = {}) => {
  if (!isBrowser()) {
    return;
  }

  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (typeof options.expires === 'number') {
    const expiresAt = new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000);
    parts.push(`Expires=${expiresAt.toUTCString()}`);
  }

  parts.push(`Path=${options.path || DEFAULT_COOKIE_PATH}`);

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
};

const removeCookie = (name) => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = [
    `${encodeURIComponent(name)}=`,
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    `Path=${DEFAULT_COOKIE_PATH}`,
  ].join('; ');
};

export const TOKEN_KEY = typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.TOKEN_KEY 
  ? window.__RUNTIME_CONFIG__.TOKEN_KEY 
  : 'kukuza_token';

export const tokenService = {

  setToken: (token) => {
    setCookie(TOKEN_KEY, token, {
      expires: 7,
      path: DEFAULT_COOKIE_PATH,
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:', 
      sameSite: 'strict'
    });
  },

  getToken: () => {
    return getCookie(TOKEN_KEY);
  },

  removeToken: () => {
    removeCookie(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!getCookie(TOKEN_KEY);
  },
  isTokenValid: () => {
    const token = getCookie(TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return false;
    }
  }
};
