import { useState, useEffect } from 'react';
import { getCreators, type CatalogCreator } from '@/repositories/portal/catalogRepository';

type Creator = CatalogCreator;

const mockCreators: Creator[] = [
  { id: 1, name: 'Boutique A', profile_image_url: '/assets/boutiques/shop1.png' },
  { id: 2, name: 'Boutique B', profile_image_url: '/assets/boutiques/shop2.png' },
  { id: 3, name: 'Boutique C', profile_image_url: '/assets/boutiques/shop3.png' },
  { id: 4, name: 'Boutique D', profile_image_url: '/assets/boutiques/shop4.png' },
  { id: 5, name: 'Boutique E', profile_image_url: '/assets/boutiques/shop5.png' },
  { id: 6, name: 'Boutique F', profile_image_url: '/assets/boutiques/shop6.png' },
];

export function useCreators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const data = await getCreators();
        if (data) setCreators(data);
        else setCreators(mockCreators);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        setCreators(mockCreators);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  return { creators, loading, error } as const;
}
