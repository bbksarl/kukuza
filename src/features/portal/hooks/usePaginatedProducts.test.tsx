import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getProducts } from '@/repositories/portal/catalogRepository';
import { usePaginatedProducts } from './usePaginatedProducts';
import { runtimeConfig } from '@/config/runtime';

vi.mock('@/repositories/portal/catalogRepository', () => ({ getProducts: vi.fn() }));
vi.mock('@/config/runtime', () => ({ runtimeConfig: { enableApiMocks: false } }));
const product = (id: number) => ({ id, name: `Produit ${id}`, price: 10 });

describe('server pagination', () => {
  beforeEach(() => { vi.mocked(getProducts).mockReset(); });
  afterEach(() => { (runtimeConfig as { enableApiMocks: boolean }).enableApiMocks = false; });

  it('requests subsequent pages, preserves the server total, and forwards filters', async () => {
    vi.mocked(getProducts).mockResolvedValueOnce({ items: [product(1), product(2)], total: 5, page: 1, limit: 2 })
      .mockResolvedValueOnce({ items: [product(3), product(4)], total: 5, page: 2, limit: 2 })
      .mockResolvedValueOnce({ items: [product(5)], total: 5, page: 3, limit: 2 });
    const { result } = renderHook(() => usePaginatedProducts(1, 2, { search: 'robe', gender: 'Femme' }));
    await waitFor(() => expect(result.current.items).toHaveLength(2));
    expect(result.current.total).toBe(5);
    act(() => { result.current.loadMore(); result.current.loadMore(); });
    await waitFor(() => expect(result.current.items).toHaveLength(4));
    expect(getProducts).toHaveBeenLastCalledWith(2, 2, expect.any(AbortSignal), expect.objectContaining({ search: 'robe', gender: 'Femme' }));
    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(5));
    act(() => result.current.loadMore());
    expect(getProducts).toHaveBeenCalledTimes(3);
  });

  it('discards an old query that resolves after a new query and refetches on refresh', async () => {
    let resolveOld!: (value: Awaited<ReturnType<typeof getProducts>>) => void;
    vi.mocked(getProducts).mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }))
      .mockResolvedValue({ items: [product(20)], total: 1, page: 1, limit: 2 });
    const { result, rerender } = renderHook(({ search }) => usePaginatedProducts(1, 2, { search }), { initialProps: { search: 'old' } });
    const oldSignal = vi.mocked(getProducts).mock.calls[0][2];
    rerender({ search: 'new' });
    await waitFor(() => expect(result.current.items[0]?.id).toBe(20));
    expect(oldSignal?.aborted).toBe(true);
    await act(async () => resolveOld({ items: [product(1)], total: 1, page: 1, limit: 2 }));
    expect(result.current.items[0]?.id).toBe(20);
    act(() => result.current.refresh());
    await waitFor(() => expect(getProducts).toHaveBeenCalledTimes(3));
  });

  it('reports an unavailable API without inserting demo products', async () => {
    vi.mocked(getProducts).mockRejectedValue(new Error('API unavailable'));
    const { result } = renderHook(() => usePaginatedProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('API unavailable');
    expect(result.current.items).toEqual([]);
  });
});
