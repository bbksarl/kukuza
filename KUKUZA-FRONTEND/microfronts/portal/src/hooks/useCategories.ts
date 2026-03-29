import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';

type Category = any;

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
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data) setCategories(data);
        else setCategories(mockCategories);
      } catch (err: any) {
        setError(err?.message ?? String(err));
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error } as const;
}
