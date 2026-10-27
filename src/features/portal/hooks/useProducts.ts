import { usePaginatedProducts } from './usePaginatedProducts';

/** Sélection d'accueil bornée ; le catalogue complet utilise la pagination serveur. */
export function useProducts() {
  const { items: products, loading, error } = usePaginatedProducts(1, 12);
  return { products, loading, error } as const;
}
