import { useState, useEffect } from 'react';
import type { Product, ProductFilter } from '../types';
import { getMockProducts } from '../utils/mockData';

interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: Error | null;
  filter: ProductFilter;
  setFilter: (filter: ProductFilter) => void;
  refetch: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<ProductFilter>('all');

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      
      setProducts(getMockProducts());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    refetch: fetchProducts
  };
};
