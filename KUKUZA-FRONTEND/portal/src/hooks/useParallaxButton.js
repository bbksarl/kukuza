import { useEffect, useRef } from 'react';

/**
 * Custom hook for parallax button effect on scroll
 * Moves buttons within product cards based on scroll position
 * @param {Array} items - Array of items with ids to apply effect to
 * @returns {Object} - Object containing refs for cards and offsets
 */
export function useParallaxButton(items) {
  const cardRefs = useRef({});
  const offsetRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      Object.keys(cardRefs.current).forEach((key) => {
        const card = cardRefs.current[key];
        if (!card) return;

        const button = card.querySelector('.shop-now-btn');
        if (!button) return;

        const cardRect = card.getBoundingClientRect();
        const cardHeight = cardRect.height;
        const viewportHeight = window.innerHeight;

        // Calculate scroll offset
        const cardTop = cardRect.top;
        const cardBottom = cardRect.bottom;

        let offset = 0;

        // When card is in viewport
        if (cardBottom > 0 && cardTop < viewportHeight) {
          // Calculate how much we've scrolled past the card's initial position
          if (cardTop < viewportHeight / 2) {
            // Card is scrolling up
            offset = Math.min(
              Math.abs(Math.min(0, cardTop)),
              cardHeight - 100 // Keep button 100px from top of card
            );
          }
        }

        // Apply smooth transform - negative value to move UP from the bottom (subtle parallax)
        const translate = offset ? -offset : 0;
        button.style.transform = `translateY(${translate}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  return { cardRefs, offsetRefs };
}