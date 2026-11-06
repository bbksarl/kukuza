import { useState, useEffect } from 'react';
import type { Product, ProductEditInput, ProductFilter } from '../types';
import { shopService } from '@/services/shop';

interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: Error | null;
  filter: ProductFilter;
  setFilter: (filter: ProductFilter) => void;
  refetch: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProduct: (productId: string, changes: ProductEditInput) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<ProductFilter>('all');

  const fetchProducts = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await shopService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Impossible de charger les produits.'));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    await shopService.deleteProduct(productId);
    setProducts((current) => current.filter((product) => product.id !== productId));
  };

  const updateProduct = async (productId: string, changes: ProductEditInput): Promise<void> => {
    const current = products.find((product) => product.id === productId);
    if (!current) throw new Error('Produit introuvable.');
    const updated = await shopService.updateProduct(current, changes);
    setProducts((items) => items.map((product) => product.id === productId ? updated : product));
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  return {
    products,
    filteredProducts,
    isLoading,
    error,
    filter,
    setFilter,
    refetch: fetchProducts,
    deleteProduct,
    updateProduct,
  };
};
