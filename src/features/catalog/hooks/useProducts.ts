import { useState, useCallback } from 'react';
import { catalogService, Product } from '@/services/catalog/CatalogService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async (filters?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.getProducts(filters);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const product = await catalogService.getProductById(productId);
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.searchProducts(query);
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    total,
    fetchProducts,
    fetchProductById,
    searchProducts,
  };
};
