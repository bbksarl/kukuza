import { useState, useEffect } from 'react';
import { getProducts } from '@/repositories/portal/catalogRepository';
import { mergeMarketplaceProducts, mockProducts, normalizeProduct, type PortalProduct } from '../data/catalog';
import { subscribeToMarketplaceProducts } from '@/services/products/marketplaceProductStore';

export function useProducts() {
  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(1, 1000); // fetch many for non-paginated use
        if (data && Array.isArray(data.items)) {
          setProducts(mergeMarketplaceProducts(data.items.map((item) => normalizeProduct(item))));
        } else if (Array.isArray(data)) {
          setProducts(mergeMarketplaceProducts((data as Record<string, unknown>[]).map((item) => normalizeProduct(item))));
        }
        else setProducts(mergeMarketplaceProducts(mockProducts));
      } catch (err: unknown) {
        // The local catalogue is an intentional fallback while the BFF is
        // unavailable, so it should remain usable instead of replacing the
        // product grid with an error state.
        setError(null);
        setProducts(mergeMarketplaceProducts(mockProducts));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
    return subscribeToMarketplaceProducts(() => {
      void fetchProducts();
    });
  }, []);

  return { products, loading, error } as const;
}
