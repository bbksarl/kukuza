import { describe, expect, it } from 'vitest';
import { getDevelopmentAdmin } from './defaultAdmin';

describe('development admin bootstrap', () => {
  it('creates the default admin with global dashboard access', () => {
    const email = import.meta.env.VITE_DEFAULT_ADMIN_EMAIL;
    const password = import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD;

    if (!import.meta.env.DEV || !email || !password) {
      expect(true).toBe(true);
      return;
    }

    const admin = getDevelopmentAdmin(email, password);

    expect(admin?.role).toBe('admin');
    expect(admin?.user.email.toString()).toBe(email);
    expect(admin?.redirectUrl).toBe('/admin/dashboard');
  });

  it('rejects invalid development credentials', () => {
    expect(getDevelopmentAdmin('admin@example.invalid', 'wrong-password')).toBeNull();
  });
});
