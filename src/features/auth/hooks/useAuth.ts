import { useEffect, useSyncExternalStore } from 'react';
import { AuthService } from '@/services/auth/AuthService';
import { FacadeHttpError } from '@/api/client';
import { ERROR_MESSAGES } from '../utils/messages';
import type { User } from '../domain/auth/entities/User';
import type { AuthResult, RegisterData } from '../domain/auth/types';
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY, clearStoredSession } from '@/core/auth/sessionStorage';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  checkingSession: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthSnapshot = Pick<UseAuthReturn, 'isAuthenticated' | 'user' | 'loading' | 'checkingSession' | 'error'>;
const authService = new AuthService();
let snapshot: AuthSnapshot = { isAuthenticated: false, user: null, loading: false, checkingSession: true, error: null };
const subscribers = new Set<() => void>();
let initialized = false;
let revision = 0;
let pendingCheck: Promise<void> | null = null;

const publish = (next: AuthSnapshot): void => {
  snapshot = next;
  subscribers.forEach((listener) => listener());
};
const subscribe = (listener: () => void): (() => void) => {
  subscribers.add(listener);
  return () => { subscribers.delete(listener); };
};
const getSnapshot = (): AuthSnapshot => snapshot;

const persistUser = (user: User): void => {
  try { window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user.toJSON())); }
  catch { /* La session distante reste utilisable sans stockage local. */ }
};
const persistToken = (token?: string): void => {
  try {
    if (token) window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    else window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch { /* Le BFF peut utiliser uniquement un cookie HttpOnly. */ }
};

const checkAuth = (): Promise<void> => {
  if (snapshot.loading) return Promise.resolve();
  if (pendingCheck) return pendingCheck;
  const currentRevision = revision;
  publish({ ...snapshot, checkingSession: true, error: null });
  const request = (async () => {
    try {
      const user = await authService.getCurrentUser();
      if (revision !== currentRevision) return;
      persistUser(user);
      publish({ ...snapshot, user, isAuthenticated: true, checkingSession: false, error: null });
    } catch (error) {
      if (revision !== currentRevision) return;
      const expired = error instanceof FacadeHttpError && error.status === 401;
      if (expired) clearStoredSession();
      publish({ ...snapshot, user: null, isAuthenticated: false, checkingSession: false,
        error: expired ? null : 'Impossible de vérifier votre session. Réessayez.' });
    }
  })();
  pendingCheck = request;
  void request.finally(() => { if (pendingCheck === request) pendingCheck = null; });
  return request;
};

const authenticate = async (request: () => Promise<AuthResult>, fallback: string): Promise<AuthResult> => {
  const currentRevision = ++revision;
  pendingCheck = null;
  publish({ ...snapshot, loading: true, checkingSession: false, error: null });
  try {
    const result = await request();
    if (revision === currentRevision) {
      persistToken(result.token);
      persistUser(result.user);
      publish({ user: result.user, isAuthenticated: true, loading: false, checkingSession: false, error: null });
    }
    return result;
  } catch (error) {
    const message = error instanceof FacadeHttpError && error.status === 401
      ? ERROR_MESSAGES.INVALID_CREDENTIALS : fallback;
    if (revision === currentRevision) publish({ ...snapshot, loading: false, error: message });
    throw new Error(message, { cause: error });
  }
};
const login: UseAuthReturn['login'] = (credentials) => authenticate(() => authService.login(credentials), ERROR_MESSAGES.LOGIN_FAILED);
const register: UseAuthReturn['register'] = (data) => authenticate(() => authService.register(data), ERROR_MESSAGES.REGISTRATION_FAILED);
const logout = async (): Promise<void> => {
  ++revision;
  pendingCheck = null;
  publish({ ...snapshot, loading: true, checkingSession: false, error: null });
  try {
    await authService.logout();
    clearStoredSession();
    publish({ user: null, isAuthenticated: false, loading: false, checkingSession: false, error: null });
  } catch (error) {
    const message = 'Déconnexion impossible. Réessayez pour fermer votre session.';
    publish({ ...snapshot, loading: false, error: message });
    throw new Error(message, { cause: error });
  }
};

export const useAuth = (): UseAuthReturn => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    if (!initialized) {
      initialized = true;
      void checkAuth();
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === AUTH_USER_STORAGE_KEY || event.key === AUTH_TOKEN_STORAGE_KEY) {
        void checkAuth();
      }
    };
    const onRedirect = (event: Event) => {
      if ((event as CustomEvent<{ status: number }>).detail.status !== 401) return;
      ++revision;
      pendingCheck = null;
      clearStoredSession();
      publish({ user: null, isAuthenticated: false, loading: false, checkingSession: false, error: null });
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('kukuza:facade-redirect', onRedirect);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('kukuza:facade-redirect', onRedirect);
    };
  }, []);
  return { ...state, login, register, logout, checkAuth };
};
