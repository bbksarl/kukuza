import { useCallback, useEffect, useRef, useState } from 'react';
import { ZodError } from 'zod';
import { getProducts } from '@/repositories/portal/catalogRepository';
import { applyProductFilters, mergeMarketplaceProducts, mockProducts, normalizeProduct, type PortalProduct, type ProductFilters } from '../data/catalog';
import { subscribeToMarketplaceProducts } from '@/services/products/marketplaceProductStore';
import { runtimeConfig } from '@/config/runtime';

export function usePaginatedProducts(initialPage = 1, initialLimit = 12, filters: ProductFilters = {}) {
  const [items, setItems] = useState<PortalProduct[]>([]);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const nextPage = useRef(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const failedRequest = useRef<{ page: number; reset: boolean } | null>(null);
  const limit = Math.min(100, Math.max(1, initialLimit));
  const { search, gender, nav, filter } = filters;

  const fetchPage = useCallback(async (requestedPage: number, reset: boolean) => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    busy.current = true;
    setLoading(true);
    setError(null);
    failedRequest.current = null;
    if (reset) {
      setItems([]);
      setTotal(0);
      setPage(requestedPage);
    }
    try {
      let data;
      try {
        data = await getProducts(requestedPage, limit, request.signal, { search, gender, nav, filter });
      } catch (error) {
        if (request.signal.aborted || !runtimeConfig.enableApiMocks) throw error;
        const matching = applyProductFilters(mergeMarketplaceProducts(mockProducts), { search, gender, nav, filter });
        data = { items: matching.slice((requestedPage - 1) * limit, requestedPage * limit), total: matching.length, page: requestedPage, limit };
      }
      if (request.signal.aborted) return;
      const products = data.items.map((item) => normalizeProduct(item));
      setItems((previous) => {
        const combined = reset ? products : [...previous, ...products];
        return [...new Map(combined.map((product) => [String(product.id), product])).values()];
      });
      setTotal(data.total);
      setPage(data.page);
      nextPage.current = data.page + 1;
      setHasMore(data.items.length > 0 && data.page * data.limit < data.total);
    } catch (error) {
      if (!request.signal.aborted) {
        failedRequest.current = { page: requestedPage, reset };
        setError(error instanceof ZodError
          ? 'Les produits ne peuvent pas être affichés pour le moment.'
          : error instanceof Error ? error.message : 'Catalogue indisponible.');
      }
    } finally {
      if (!request.signal.aborted) { busy.current = false; setLoading(false); }
    }
  }, [limit, search, gender, nav, filter]);

  const refresh = useCallback(() => {
    nextPage.current = initialPage;
    setHasMore(true);
    void fetchPage(initialPage, true);
  }, [fetchPage, initialPage]);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToMarketplaceProducts(refresh);
    return () => { controller.current?.abort(); unsubscribe(); };
  }, [refresh]);

  const loadMore = () => {
    if (!busy.current && hasMore) void fetchPage(nextPage.current, false);
  };
  const retry = () => {
    const failed = failedRequest.current;
    if (!busy.current && failed) void fetchPage(failed.page, failed.reset);
  };
  return { items, allItems: items, loading, error, page, limit, total, hasMore, loadMore, refresh, retry } as const;
}
