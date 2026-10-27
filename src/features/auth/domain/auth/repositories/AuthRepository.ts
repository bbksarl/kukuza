import { User } from '../entities/User';
import { Credentials } from '../entities/Credentials';
import type { AuthResult, RegisterData } from '../types';
import { facadeClient, FacadeHttpError } from '@/api/client';
import { authResponseSchema, sessionUserSchema, type SessionUserDto } from '@/api/contracts/auth';
import { authApiConfig } from '../../../config/authApiConfig';
import { getDevelopmentAdmin } from '../../../config/defaultAdmin';
import { getDevelopmentBoutique } from '../../../config/defaultBoutique';
import { clearStoredSession, readStoredAuthUser } from '@/core/auth/sessionStorage';

const toUser = (user: SessionUserDto): User => new User(
  user.id, user.username, user.email, user.role, user.createdAt, user.brandId ?? undefined,
);

/** Les comptes locaux restent limités au serveur de développement. */
const getDevelopmentSession = (): User | null => {
  if (!import.meta.env.DEV) return null;
  const stored = readStoredAuthUser();
  if (!stored) return null;
  const candidates = [
    getDevelopmentAdmin(import.meta.env.VITE_DEFAULT_ADMIN_EMAIL ?? '', import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD ?? ''),
    getDevelopmentBoutique(import.meta.env.VITE_DEFAULT_BOUTIQUE_EMAIL ?? '', import.meta.env.VITE_DEFAULT_BOUTIQUE_PASSWORD ?? ''),
  ];
  return candidates.find((candidate) => candidate != null && candidate.user.id === stored.id
    && candidate.user.email.toString() === stored.email && candidate.user.role === stored.role)?.user ?? null;
};

export class AuthRepository {
  private toAuthResult(data: unknown): AuthResult {
    const parsed = authResponseSchema.parse(data);
    return { user: toUser(parsed.user), role: parsed.user.role, token: parsed.token ?? undefined };
  }

  async login(credentials: Credentials): Promise<AuthResult> {
    const username = credentials.username;
    const password = credentials.password;
    const development = getDevelopmentAdmin(username, password) ?? getDevelopmentBoutique(username, password);
    if (development) return development;
    return this.toAuthResult(await facadeClient.post<unknown>(authApiConfig.endpoints.login,
      { username, password }, { skipRedirect: true }));
  }

  async register(userData: RegisterData): Promise<AuthResult> {
    const { boutique, ...account } = userData;
    if (account.isBoutique && !boutique) throw new Error('Les informations de boutique sont requises.');
    const payload = new FormData();
    payload.set('username', account.username?.trim() || account.name.trim());
    payload.set('name', account.name);
    payload.set('email', account.email);
    payload.set('password', account.password);
    payload.set('role', account.isBoutique ? 'brand' : 'customer');
    if (account.isBoutique && boutique) {
      const { logo, ...profile } = boutique;
      Object.entries(profile).forEach(([key, value]) => payload.set(`boutique.${key}`, value));
      if (logo) payload.set('boutique.logo', logo);
    }
    return this.toAuthResult(await facadeClient.post<unknown>(authApiConfig.endpoints.register,
      payload, { skipRedirect: true }));
  }

  async logout(): Promise<void> {
    if (!getDevelopmentSession()) {
      try {
        await facadeClient.post(authApiConfig.endpoints.logout, undefined, { skipRedirect: true });
      } catch (error) {
        if (!(error instanceof FacadeHttpError && error.status === 401)) throw error;
      }
    }
    clearStoredSession();
  }

  async getCurrentUser(): Promise<User> {
    const development = getDevelopmentSession();
    if (development) return development;
    const response = await facadeClient.get<unknown>(authApiConfig.endpoints.me, { skipRedirect: true });
    return toUser(sessionUserSchema.parse(response));
  }
}
