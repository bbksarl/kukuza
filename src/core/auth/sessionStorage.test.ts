import { beforeEach, describe, expect, it } from 'vitest';
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  clearStoredSession,
  getStoredBrandId,
  getStoredUserId,
  readStoredAuthUser,
} from './sessionStorage';

describe('sessionStorage', () => {
  beforeEach(() => window.localStorage.clear());

  it('reads valid user and boutique identifiers', () => {
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify({ id: 12, brandId: 34, role: 'creator' }));

    expect(getStoredUserId()).toBe(12);
    expect(getStoredBrandId()).toBe(34);
    expect(readStoredAuthUser()?.role).toBe('creator');
  });

  it('returns null-safe values for invalid storage data', () => {
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, '{invalid');

    expect(readStoredAuthUser()).toBeNull();
    expect(getStoredUserId()).toBeUndefined();
    expect(getStoredBrandId()).toBeUndefined();
  });

  it('clears the complete persisted session', () => {
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, '{}');
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'token');

    clearStoredSession();

    expect(window.localStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
  });
});
