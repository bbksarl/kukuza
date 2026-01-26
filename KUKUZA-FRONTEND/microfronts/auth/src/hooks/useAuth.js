import { useState, useCallback } from 'react';
import { authService, tokenService } from '../../../../libs/api/AuthService';
import { ERROR_MESSAGES } from '../utils/messages';


export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      const errorMessage = err.message.includes('401') || err.message.includes('Invalid')
        ? ERROR_MESSAGES.INVALID_CREDENTIALS
        : ERROR_MESSAGES.LOGIN_FAILED;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(ERROR_MESSAGES.REGISTRATION_FAILED);
      throw new Error(ERROR_MESSAGES.REGISTRATION_FAILED);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    if (tokenService.isTokenValid()) {
      try {
        const user = await authService.getCurrentUser();
        setUser(user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
        tokenService.removeToken();
        setIsAuthenticated(false);
      }
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };
};
