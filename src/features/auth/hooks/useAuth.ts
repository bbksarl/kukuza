import { useState, useCallback, useMemo } from 'react';
import { AuthService } from '@/services/auth/AuthService';
import { ERROR_MESSAGES } from '../utils/messages';
import { User } from '../domain/auth/entities/User';
import type { AuthResult, RegisterData } from '../domain/auth/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  // Utiliser useMemo pour créer une seule instance d'AuthService
  const authService = useMemo(() => new AuthService(), []);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error && (err.message.includes('401') || err.message.includes('Invalid'))
        ? ERROR_MESSAGES.INVALID_CREDENTIALS
        : ERROR_MESSAGES.LOGIN_FAILED;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const register = useCallback(async (userData: RegisterData): Promise<AuthResult> => {
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
  }, [authService]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [authService]);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [authService]);

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
