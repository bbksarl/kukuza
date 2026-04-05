interface CookieOptions {
  expires?: number;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
}

const DEFAULT_COOKIE_PATH = '/';

const isBrowser = (): boolean => typeof document !== 'undefined';

const getCookie = (name: string): string | null => {
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

const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  if (!isBrowser()) {
    return;
  }

  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (typeof options.expires === 'number') {
    const expiresAt = new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000);
    parts.push(`Expires=${expiresAt.toUTCString()}`);
  }

  parts.push(`Path=${options.path ?? DEFAULT_COOKIE_PATH}`);

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    parts.push('Secure');
  }

  document.cookie = parts.join('; ');
};

const removeCookie = (name: string): void => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = [
    `${encodeURIComponent(name)}=`,
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    `Path=${DEFAULT_COOKIE_PATH}`,
  ].join('; ');
};

export const TOKEN_KEY = typeof window !== 'undefined' && (window as any).__RUNTIME_CONFIG__?.TOKEN_KEY 
  ? (window as any).__RUNTIME_CONFIG__.TOKEN_KEY
  : 'kukuza_access_token';

export const REFRESH_TOKEN_KEY = 'kukuza_refresh_token';

export interface TokenPayload {
  sub?: string;
  email?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  [key: string]: any;
}

class TokenService {
  private readonly accessTokenKey: string = TOKEN_KEY;
  private readonly refreshTokenKey: string = REFRESH_TOKEN_KEY;

  getToken(): string | null {
    try {
      return getCookie(this.accessTokenKey);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      setCookie(this.accessTokenKey, token, {
        expires: 7,
        path: DEFAULT_COOKIE_PATH,
        secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
        sameSite: 'strict'
      });
    } catch (error) {
      console.error('Failed to set token', error);
    }
  }

  removeToken(): void {
    try {
      removeCookie(this.accessTokenKey);
      removeCookie(this.refreshTokenKey);
    } catch (error) {
      console.error('Failed to remove token', error);
    }
  }

  isAuthenticated(): boolean {
    return !!getCookie(this.accessTokenKey);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1])) as TokenPayload;
      const currentTime = Date.now() / 1000;
      return (payload.exp || 0) > currentTime;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return false;
    }
  }

  getTokenPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1])) as TokenPayload;
    } catch (error) {
      console.error('Failed to parse token', error);
      return null;
    }
  }
}

export const tokenService = new TokenService();
export { TokenService };
