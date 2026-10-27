import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCategories } from './useCategories';
import { useCreators } from './useCreators';

vi.mock('@/config/runtime', () => ({ runtimeConfig: { enableApiMocks: false } }));
vi.mock('@/repositories/portal/catalogRepository', () => ({
  getCategories: vi.fn().mockRejectedValue(new Error('API unavailable')),
  getCreators: vi.fn().mockRejectedValue(new Error('API unavailable')),
}));

describe('disabled catalogue mocks', () => {
  it('does not display fake categories or shops on an API failure', async () => {
    const { result } = renderHook(() => ({ categories: useCategories(), creators: useCreators() }));
    await waitFor(() => expect(result.current.categories.loading || result.current.creators.loading).toBe(false));
    expect(result.current.categories.categories).toEqual([]);
    expect(result.current.creators.creators).toEqual([]);
    expect(result.current.categories.error).toBe('API unavailable');
    expect(result.current.creators.error).toBe('API unavailable');
  });
});
