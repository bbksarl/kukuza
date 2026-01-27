import Cookies from 'js-cookie';

export const TOKEN_KEY = typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.TOKEN_KEY 
  ? window.__RUNTIME_CONFIG__.TOKEN_KEY 
  : 'kukuza_token';

export const tokenService = {

  setToken: (token) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7,
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:', 
      sameSite: 'strict'
    });
  },

  getToken: () => {
    return Cookies.get(TOKEN_KEY) || null;
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_KEY);
  },
  isTokenValid: () => {
    const token = Cookies.get(TOKEN_KEY);
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
