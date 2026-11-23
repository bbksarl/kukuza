import { describe, expect, it } from 'vitest';
import { User } from './User';

describe('User', () => {
  it('normalizes email and exposes role checks', () => {
    const user = new User(7, 'Amina', 'AMINA@example.com', 'creator', '2026-01-01T00:00:00.000Z', 12);

    expect(user.email.toString()).toBe('amina@example.com');
    expect(user.isCreator()).toBe(true);
    expect(user.isAdmin()).toBe(false);
    expect(user.toJSON().brandId).toBe(12);
  });

  it('compares users by identity and rejects invalid email addresses', () => {
    expect(
      new User(7, 'Amina', 'a@example.com', 'customer', '2026-01-01T00:00:00.000Z').equals({ id: 7 }),
    ).toBe(false);
    expect(() => new User(8, 'Bad', 'not-an-email', 'customer', '2026-01-01T00:00:00.000Z')).toThrow();
  });
});
