import { useState, useEffect } from 'react';
import { getProducts } from '@/repositories/portal/catalogRepository';
import { mockProducts, normalizeProduct, type PortalProduct } from '../data/catalog';

export function useProducts() {
  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(1, 1000); // fetch many for non-paginated use
        if (data && Array.isArray(data.items)) {
          setProducts(data.items.map((item) => normalizeProduct(item)));
        } else if (Array.isArray(data)) {
          setProducts((data as Record<string, unknown>[]).map((item) => normalizeProduct(item)));
        }
        else setProducts(mockProducts);
      } catch (err: unknown) {
        // The local catalogue is an intentional fallback while the BFF is
        // unavailable, so it should remain usable instead of replacing the
        // product grid with an error state.
        setError(null);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error } as const;
}
