import { runtimeConfig } from '@/config/runtime';
import { useState, useEffect } from 'react';
import { getCategories, type CatalogCategory } from '@/repositories/portal/catalogRepository';

type Category = CatalogCategory;

const mockCategories: Category[] = [
  { id: 1, name: 'Femme' },
  { id: 2, name: 'Homme' },
  { id: 3, name: 'Enfant' },
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        const data = await getCategories(controller.signal);
        if (!controller.signal.aborted) setCategories(data);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        setError(runtimeConfig.enableApiMocks ? null : (err instanceof Error ? err.message : String(err)));
        setCategories(runtimeConfig.enableApiMocks ? mockCategories : []);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchCategories();
    return () => controller.abort();
  }, []);

  return { categories, loading, error } as const;
}
