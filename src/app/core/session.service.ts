import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { AuthRepository } from '@/features/auth/data/auth.repository';
import { ApiError } from '@/app/core/api-error';
import { AUTH_USER_STORAGE_KEY, clearLegacyAuthToken, clearStoredSession } from '@/core/auth/sessionStorage';
import type { User } from '@/features/auth/domain/auth/entities/User';
import type { AuthResult, RegisterData } from '@/features/auth/domain/auth/types';
import { Credentials } from '@/features/auth/domain/auth/entities/Credentials';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly service = inject(AuthRepository);
  readonly user = signal<User | null>(null);
  readonly checking = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  private revision = 0;
  private pending: Promise<void> | null = null;
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    clearLegacyAuthToken();
    if (!this.browser) return;
    const listener = (event: StorageEvent) => {
      if (event.key === null || event.key === AUTH_USER_STORAGE_KEY) void this.check();
    };
    const view = this.document.defaultView;
    view?.addEventListener('storage', listener);
    inject(DestroyRef).onDestroy(() => view?.removeEventListener('storage', listener));
  }
  check(): Promise<void> {
    if (this.pending) return this.pending;
    if (this.busy()) return Promise.resolve();
    const revision = this.revision;
    this.checking.set(true);
    this.error.set('');
    const request = this.service
      .getCurrentUser()
      .then((user) => {
        if (revision !== this.revision) return;
        this.user.set(user);
        try {
          localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user.toJSON()));
        } catch {
          /* Cookie session remains usable. */
        }
      })
      .catch((error: unknown) => {
        if (revision !== this.revision) return;
        this.user.set(null);
        if (error instanceof ApiError && error.status === 401) clearStoredSession();
        else this.error.set('Impossible de vérifier votre session. Réessayez.');
      })
      .finally(() => {
        if (revision === this.revision) this.checking.set(false);
        if (this.pending === request) this.pending = null;
      });
    this.pending = request;
    return request;
  }
  private async authenticate(request: () => Promise<AuthResult>): Promise<AuthResult> {
    if (this.busy()) throw new Error('Une connexion est déjà en cours.');
    ++this.revision;
    this.pending = null;
    this.checking.set(false);
    this.busy.set(true);
    this.error.set('');
    try {
      const result = await request();
      this.user.set(result.user);
      try {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(result.user.toJSON()));
        clearLegacyAuthToken();
      } catch {
        /* Cookie session remains usable. */
      }
      return result;
    } catch (error) {
      this.error.set(
        error instanceof ApiError && error.status === 401
          ? 'Identifiants invalides'
          : 'Impossible de vous connecter. Réessayez.',
      );
      throw error;
    } finally {
      this.busy.set(false);
    }
  }
  login(value: { username: string; password: string }): Promise<AuthResult> {
    return this.authenticate(() => this.service.login(new Credentials(value.username, value.password)));
  }
  register(value: RegisterData): Promise<AuthResult> {
    return this.authenticate(() => this.service.register(value));
  }
  async logout(): Promise<void> {
    if (this.busy()) return;
    ++this.revision;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.service.logout();
      clearStoredSession();
      this.user.set(null);
    } catch {
      this.error.set('Déconnexion impossible. Réessayez pour fermer votre session.');
    } finally {
      this.busy.set(false);
    }
  }
}
