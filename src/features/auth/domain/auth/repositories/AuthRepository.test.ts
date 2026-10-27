import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { facadeClient, FacadeHttpError } from '@/api/client';
import { AUTH_USER_STORAGE_KEY, AUTH_TOKEN_STORAGE_KEY } from '@/core/auth/sessionStorage';
import { AuthRepository } from './AuthRepository';
import { Credentials } from '../entities/Credentials';

const user = { id: 12, username: 'amina', email: 'amina@example.com', role: 'brand', createdAt: '2026-10-26T00:00:00Z', brandId: 34 };

describe('C# authentication contract', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('loads the verified server session instead of a locally edited role', async () => {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify({ ...user, role: 'admin' }));
    const get = vi.spyOn(facadeClient, 'get').mockResolvedValue(user);
    const result = await new AuthRepository().getCurrentUser();
    expect(get).toHaveBeenCalledWith('/Auth/me', { skipRedirect: true });
    expect(result.role).toBe('creator');
    expect(result.toJSON().brandId).toBe(34);
  });

  it('allows an existing password through to the backend', async () => {
    const post = vi.spyOn(facadeClient, 'post').mockResolvedValue({ user });
    await new AuthRepository().login(new Credentials('amina', 'legacy'));
    expect(post).toHaveBeenCalledWith('/Auth/login', { username: 'amina', password: 'legacy' }, { skipRedirect: true });
  });

  it('submits every boutique field and the logo as ASP.NET multipart fields', async () => {
    const post = vi.spyOn(facadeClient, 'post').mockResolvedValue({ user });
    const logo = new File(['image'], 'logo.png', { type: 'image/png' });
    const boutique = { shopName: 'Atelier Amina', address: 'Dakar centre', postalCode: '10000', country: 'Sénégal', phoneNumber: '+221771234567', description: 'Une boutique artisanale', logo };
    await new AuthRepository().register({ username: 'amina', name: 'Amina', email: user.email, password: 'Example428!', isBoutique: true, boutique });
    const body = post.mock.calls[0][1] as FormData;
    for (const [key, value] of Object.entries(boutique)) expect(body.get(`boutique.${key}`)).toEqual(value);
    expect(body.get('role')).toBe('brand');
    expect(body.get('name')).toBe('Amina');
  });

  it('does not pretend to close a session when the logout endpoint fails', async () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'existing-token');
    const post = vi.spyOn(facadeClient, 'post').mockRejectedValue(new Error('offline'));
    await expect(new AuthRepository().logout()).rejects.toThrow('offline');
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe('existing-token');
    post.mockResolvedValue(undefined);
    await new AuthRepository().logout();
    expect(post).toHaveBeenCalledWith('/Auth/logout', undefined, { skipRedirect: true });
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('treats an already expired session as logged out', async () => {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    vi.spyOn(facadeClient, 'post').mockRejectedValue(new FacadeHttpError(401, 'Expired', null, 'test'));
    await new AuthRepository().logout();
    expect(localStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();
  });
});
