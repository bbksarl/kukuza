import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { facadeClient, FacadeHttpError } from '@/api/client';
import { AUTH_USER_STORAGE_KEY } from '@/core/auth/sessionStorage';
import { useAuth } from './useAuth';

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

it('rejects stale local sessions and ignores verification results arriving after logout', async () => {
  const user = { id: 12, username: 'amina', email: 'amina@example.com', role: 'customer', createdAt: '2026-10-26T00:00:00Z' };
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify({ ...user, role: 'admin' }));
  const get = vi.spyOn(facadeClient, 'get').mockRejectedValue(new FacadeHttpError(401, 'Expired', null, 'test'));
  const { result } = renderHook(() => useAuth());
  await waitFor(() => expect(result.current.checkingSession).toBe(false));
  expect(result.current.isAuthenticated).toBe(false);
  expect(localStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();

  vi.spyOn(facadeClient, 'post').mockResolvedValue({ user });
  await act(async () => { await result.current.login({ username: 'amina', password: 'Existing-password-428' }); });
  expect(result.current.isAuthenticated).toBe(true);
  let resolveCheck!: (value: unknown) => void;
  get.mockImplementationOnce(() => new Promise((resolve) => { resolveCheck = resolve; }));
  act(() => { void result.current.checkAuth(); });
  await act(async () => { await result.current.logout(); });
  await act(async () => resolveCheck(user));
  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.user).toBeNull();
  expect(localStorage.getItem(AUTH_USER_STORAGE_KEY)).toBeNull();
});
