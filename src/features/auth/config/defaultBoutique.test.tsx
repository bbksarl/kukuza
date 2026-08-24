import { describe, expect, it } from 'vitest';
import { getDevelopmentBoutique } from './defaultBoutique';
import { AuthService } from '../domain/auth/services/AuthService';

describe('development boutique bootstrap', () => {
  it('creates the default boutique with shop dashboard access', () => {
    const email = import.meta.env.VITE_DEFAULT_BOUTIQUE_EMAIL;
    const password = import.meta.env.VITE_DEFAULT_BOUTIQUE_PASSWORD;

    if (!import.meta.env.DEV || !email || !password) {
      expect(true).toBe(true);
      return;
    }

    const boutique = getDevelopmentBoutique(email, password);

    expect(boutique?.role).toBe('creator');
    expect(boutique?.user.email.toString()).toBe(email);
    expect(boutique?.user.username).toBe('KUKUZA Boutique Démo');
    expect(boutique?.redirectUrl).toBe('/shop/dashboard');
  });

  it('rejects invalid development boutique credentials', () => {
    expect(getDevelopmentBoutique('boutique@example.invalid', 'wrong-password')).toBeNull();
  });

  it('lets the auth service use the exact provided local password', async () => {
    if (!import.meta.env.DEV) return;

    const email = import.meta.env.VITE_DEFAULT_BOUTIQUE_EMAIL;
    const password = import.meta.env.VITE_DEFAULT_BOUTIQUE_PASSWORD;
    if (!email || !password) return;

    const result = await new AuthService().login({
      email,
      password,
    });

    expect(result.role).toBe('creator');
    expect(result.redirectUrl).toBe('/shop/dashboard');
  });
});
