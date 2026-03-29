import { useState, useEffect } from 'react';
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
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(1, 1000); // fetch many for non-paginated use
        if (data && Array.isArray((data as any).items)) setProducts((data as any).items);
        else if (Array.isArray(data)) setProducts(data as any);
        else setProducts(mockProducts);
      } catch (err: any) {
        setError(err?.message ?? String(err));
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error } as const;
}
