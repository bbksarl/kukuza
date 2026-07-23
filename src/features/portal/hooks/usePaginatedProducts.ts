import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '@/repositories/portal/catalogRepository';
import { applyProductFilters, mockProducts, normalizeProduct, type PortalProduct, type ProductFilters } from '../data/catalog';

export function usePaginatedProducts(initialPage = 1, initialLimit = 12, filters: ProductFilters = {}) {
  const [allItems, setAllItems] = useState<PortalProduct[]>([]);
  const [page, setPage] = useState(initialPage);
  const limit = initialLimit;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        const res = await getProducts(1, 1000);
        if (res && Array.isArray(res.items)) {
          setAllItems(res.items.map((item: Record<string, unknown>) => normalizeProduct(item)));
        } else {
          setAllItems(mockProducts);
        }
      } catch {
        // Keep the catalogue usable while the BFF is unavailable. The UI can
        // still render the local catalogue and apply search/filter parameters.
        setError(null);
        setAllItems(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage, filters.search, filters.nav, filters.filter]);

  const filteredItems = useMemo(
    () => applyProductFilters(allItems, filters),
    [allItems, filters.search, filters.nav, filters.filter]
  );

  const items = useMemo(
    () => filteredItems.slice(0, page * limit),
    [filteredItems, page, limit]
  );

  const total = filteredItems.length;

  const loadMore = () => {
    if (items.length >= total) return;
    setPage((p) => p + 1);
  };

  const refresh = () => {
    setPage(initialPage);
  };

  return { items, loading, error, page, limit, total, loadMore, refresh } as const;
}
