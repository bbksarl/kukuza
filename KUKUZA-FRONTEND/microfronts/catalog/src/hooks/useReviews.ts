import { useState, useCallback } from 'react';
import { catalogService, Review } from '../services/CatalogService';

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await catalogService.getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const addReview = useCallback(async (rating: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      const newReview = await catalogService.createReview(productId, {
        rating,
        content,
      });
      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    addReview,
  };
};
