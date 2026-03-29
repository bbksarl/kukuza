import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';

type Product = any;

const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', price: 50, image_url: '/assets/products/p1.png', brand: 'Boutique Premium' },
  { id: 2, name: 'Product 2', price: 75, image_url: '/assets/products/p2.png', brand: 'Style Collection' },
  { id: 3, name: 'Product 3', price: 100, image_url: '/assets/products/p3.png', brand: 'Fashion House' },
  { id: 4, name: 'Product 4', price: 120, image_url: '/assets/products/p4.png', brand: 'Luxury Brand' },
  { id: 5, name: 'Product 5', price: 90, image_url: '/assets/products/p5.png', brand: 'Elite Fashion' },
  { id: 6, name: 'Product 6', price: 85, image_url: '/assets/products/p6.png', brand: 'Trend Setters' },
  { id: 7, name: 'Product 7', price: 110, image_url: '/assets/products/p7.png', brand: 'Modern Style' },
  { id: 8, name: 'Product 8', price: 95, image_url: '/assets/products/p8.png', brand: 'Chic Boutique' },
  { id: 9, name: 'Product 9', price: 130, image_url: '/assets/products/p9.png', brand: 'Premium Line' },
  { id: 10, name: 'Product 10', price: 105, image_url: '/assets/products/p10.png', brand: 'Elegant Wear' },
  { id: 11, name: 'Product 11', price: 115, image_url: '/assets/products/p11.png', brand: 'Fashion Forward' },
  { id: 12, name: 'Product 12', price: 125, image_url: '/assets/products/p12.png', brand: 'Style Icon' },
  // additional mock to allow multiple pages
  { id: 13, name: 'Product 13', price: 130, image_url: '/assets/products/p13.png', brand: 'Brand X' },
  { id: 14, name: 'Product 14', price: 140, image_url: '/assets/products/p14.png', brand: 'Brand Y' },
];

export function usePaginatedProducts(initialPage = 1, initialLimit = 12) {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts(p, limit);
      if (res && Array.isArray(res.items)) {
        if (p === 1) setItems(res.items);
        else setItems((prev) => [...prev, ...res.items]);
        setTotal(res.total ?? null);
      } else {
        // fallback to local mock pagination
        const start = (p - 1) * limit;
        const slice = mockProducts.slice(start, start + limit);
        if (p === 1) setItems(slice);
        else setItems((prev) => [...prev, ...slice]);
        setTotal(mockProducts.length);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  const loadMore = () => {
    if (total !== null && items.length >= total) return;
    setPage((p) => p + 1);
  };

  const refresh = () => {
    setPage(1);
    setItems([]);
  };

  return { items, loading, error, page, limit, total, loadMore, refresh } as const;
}
