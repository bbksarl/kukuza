import { inject, Injectable } from '@angular/core';
import { environment } from '@/config/environment.generated';
import { User } from '../domain/auth/entities/User';
import { Credentials } from '../domain/auth/entities/Credentials';
import type { AuthResult, RegisterData } from '../domain/auth/types';
import { ApiClient } from '@/app/core/api-client.service';
import { ApiError } from '@/app/core/api-error';
import { authResponseSchema, sessionUserSchema, type SessionUserDto } from '@/api/contracts/auth';
import { authApiConfig } from '../config/authApiConfig';
import { getDevelopmentAdmin } from '../config/defaultAdmin';
import { getDevelopmentBoutique } from '../config/defaultBoutique';
import { clearStoredSession, readStoredAuthUser } from '@/core/auth/sessionStorage';
import { runtimeConfig } from '@/config/runtime';

const toUser = (user: SessionUserDto): User =>
  new User(user.id, user.username, user.email, user.role, user.createdAt, user.brandId ?? undefined);

const getDevelopmentSession = (): User | null => {
  if (!runtimeConfig.enableApiMocks) return null;
  const stored = readStoredAuthUser();
  if (!stored) return null;
  const candidates = [
    getDevelopmentAdmin(
      environment.VITE_DEFAULT_ADMIN_EMAIL ?? '',
      environment.VITE_DEFAULT_ADMIN_PASSWORD ?? '',
    ),
    getDevelopmentBoutique(
      environment.VITE_DEFAULT_BOUTIQUE_EMAIL ?? '',
      environment.VITE_DEFAULT_BOUTIQUE_PASSWORD ?? '',
    ),
  ];
  return (
    candidates.find(
      (candidate) =>
        candidate != null &&
        candidate.user.id === stored.id &&
        candidate.user.email.toString() === stored.email &&
        candidate.user.role === stored.role,
    )?.user ?? null
  );
};

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private readonly api = inject(ApiClient);
  private toAuthResult(data: unknown): AuthResult {
    const parsed = authResponseSchema.parse(data);
    return { user: toUser(parsed.user), role: parsed.user.role };
  }

  async login(credentials: Credentials): Promise<AuthResult> {
    const username = credentials.username;
    const password = credentials.password;
    const development = getDevelopmentAdmin(username, password) ?? getDevelopmentBoutique(username, password);
    if (development) return development;
    return this.toAuthResult(
      await this.api.post(authApiConfig.endpoints.login, { username, password }, { skipRedirect: true }),
    );
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
    return this.toAuthResult(
      await this.api.post(authApiConfig.endpoints.register, payload, { skipRedirect: true }),
    );
  }

  async logout(): Promise<void> {
    if (!getDevelopmentSession()) {
      try {
        await this.api.post(authApiConfig.endpoints.logout, undefined, { skipRedirect: true });
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) throw error;
      }
    }
    clearStoredSession();
  }

  async getCurrentUser(): Promise<User> {
    const development = getDevelopmentSession();
    if (development) return development;
    const response = await this.api.get(authApiConfig.endpoints.me, { skipRedirect: true });
    return toUser(sessionUserSchema.parse(response));
  }
}
