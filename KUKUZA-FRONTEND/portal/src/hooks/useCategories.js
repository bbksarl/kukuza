import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';

// Mock data for development
const mockCategories = [
  { id: 1, name: 'Femme' },
  { id: 2, name: 'Homme' },
  { id: 3, name: 'Enfant' },
];

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data) {
          setCategories(data);
        } else {
          // Fallback to mock data
          setCategories(mockCategories);
        }
      } catch (err) {
        setError(err.message);
        // Fallback to mock data on error
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}