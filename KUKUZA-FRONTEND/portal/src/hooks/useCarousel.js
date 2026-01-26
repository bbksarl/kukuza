import { useState, useEffect } from 'react';

/**
 * Custom hook for managing carousel state and auto-rotation
 * @param {Array} items - Array of carousel items
 * @param {number} interval - Auto-rotation interval in milliseconds (default: 3000)
 * @returns {Object} - { currentIndex, isPaused, setIsPaused, goToSlide }
 */
export function useCarousel(items, interval = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !items.length) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, items.length, interval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return {
    currentIndex,
    isPaused,
    setIsPaused,
    goToSlide,
  };
}