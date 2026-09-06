import { useState, useCallback, useEffect, useRef } from 'react';
import { catalogService, Product } from '@/services/catalog/CatalogService';
import { getMarketplaceProducts, subscribeToMarketplaceProducts } from '@/services/products/marketplaceProductStore';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const lastFilters = useRef<{
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }>({});

  const getLocalProducts = useCallback((): Product[] => getMarketplaceProducts().map((product) => ({
    id: String(product.id),
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    image: product.image_url ?? product.image ?? '',
    categoryId: product.category ?? '',
    creatorId: product.boutiqueId == null ? String(product.creatorId ?? '') : String(product.boutiqueId),
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    boutiqueId: product.boutiqueId == null ? undefined : String(product.boutiqueId),
    boutiqueName: product.boutiqueName ?? product.creatorName ?? product.creator_name ?? product.brand,
  })), []);

  const fetchProducts = useCallback(async (filters?: {
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    lastFilters.current = filters ?? {};
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.getProducts(filters);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      const localProducts = getLocalProducts();
      setError(localProducts.length > 0 ? null : errorMessage);
      setProducts(localProducts);
      setTotal(localProducts.length);
    } finally {
      setLoading(false);
    }
  }, [getLocalProducts]);

  useEffect(() => subscribeToMarketplaceProducts(() => {
    void fetchProducts(lastFilters.current);
  }), [fetchProducts]);

  const fetchProductById = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const product = await catalogService.getProductById(productId);
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      const localProduct = getLocalProducts().find((item) => item.id === productId);

      if (localProduct) {
        setError(null);
        return localProduct;
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getLocalProducts]);

  const searchProducts = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.searchProducts(query);
      const localProducts = getLocalProducts().filter((product) =>
        `${product.name} ${product.description} ${product.boutiqueName ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()),
      );
      const remoteIds = new Set(data.map((product) => product.id));
      const productsWithLocal = [
        ...localProducts.filter((product) => !remoteIds.has(product.id)),
        ...data,
      ];
      setProducts(productsWithLocal);
      setTotal(productsWithLocal.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      const normalizedQuery = query.trim().toLowerCase();
      const localProducts = getLocalProducts().filter((product) =>
        `${product.name} ${product.description} ${product.boutiqueName ?? ''}`.toLowerCase().includes(normalizedQuery),
      );
      setError(localProducts.length > 0 ? null : errorMessage);
      setProducts(localProducts);
      setTotal(localProducts.length);
    } finally {
      setLoading(false);
    }
  }, [getLocalProducts]);

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
