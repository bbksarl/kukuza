import { useState, useCallback, useEffect, useRef } from 'react';
import { catalogService, type Product } from '@/services/catalog/CatalogService';
import type { ProductQuery } from '@/api/contracts/catalog';

type Filters = ProductQuery & { page?: number; limit?: number };
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const start = useCallback(() => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError(null);
    return request.signal;
  }, []);

  const fetchProducts = useCallback(async (filters: Filters = {}) => {
    const signal = start();
    try {
      const data = await catalogService.getProducts(filters, signal);
      if (signal.aborted) return;
      setProducts(data.products);
      setTotal(data.total);
      setLimit(data.limit);
    } catch (error) {
      if (signal.aborted) return;
      setError(error instanceof Error ? error.message : 'Catalogue indisponible.');
      setProducts([]);
      setTotal(0);
    } finally { if (!signal.aborted) setLoading(false); }
  }, [start]);

  const fetchProductById = useCallback(async (id: string) => {
    const signal = start();
    try {
      const product = await catalogService.getProductById(id, signal);
      return signal.aborted ? null : product;
    } catch (error) {
      if (!signal.aborted) setError(error instanceof Error ? error.message : 'Produit indisponible.');
      return null;
    } finally { if (!signal.aborted) setLoading(false); }
  }, [start]);

  const searchProducts = useCallback((search: string) => fetchProducts({ search }), [fetchProducts]);
  return { products, loading, error, total, limit, fetchProducts, fetchProductById, searchProducts };
};
