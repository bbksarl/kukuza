import { useState, useEffect } from 'react';
import { getBestSellers } from '../services/api';

// Mock data for development
const mockBestSellers = [
  {
    id: 1,
    src: '/assets/mVentes/im2.png',
    alt: 'Tenue streetwear noir et blanc'
  },
  {
    id: 2,
    src: '/assets/mVentes/im1.png',
    alt: 'Robe rouge élégante',
    featured: true
  },
  {
    id: 3,
    src: '/assets/mVentes/im3.png',
    alt: 'Caftan rayé multicolore'
  }
];

export function useBestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await getBestSellers();
        if (data) {
          setBestSellers(data);
        } else {
          // Fallback to mock data
          setBestSellers(mockBestSellers);
        }
      } catch (err) {
        setError(err.message);
        // Fallback to mock data on error
        setBestSellers(mockBestSellers);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return { bestSellers, loading, error };
}