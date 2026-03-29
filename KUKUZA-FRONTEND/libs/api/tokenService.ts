import Cookies from 'js-cookie';

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
      return Cookies.get(this.accessTokenKey) || null;
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      Cookies.set(this.accessTokenKey, token, {
        expires: 7,
        secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
        sameSite: 'strict'
      });
    } catch (error) {
      console.error('Failed to set token', error);
    }
  }

  removeToken(): void {
    try {
      Cookies.remove(this.accessTokenKey);
      Cookies.remove(this.refreshTokenKey);
    } catch (error) {
      console.error('Failed to remove token', error);
    }
  }

  isAuthenticated(): boolean {
    return !!Cookies.get(this.accessTokenKey);
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
