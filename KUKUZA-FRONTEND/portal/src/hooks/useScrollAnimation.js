import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect when an element enters the viewport
 * and trigger animations
 * @param {Object} options - Intersection Observer options
 * @returns {Array} - [ref, isVisible]
 */
export function useScrollAnimation(options = {}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, keep it visible (no re-animation on scroll up)
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return [elementRef, isVisible];
}

/**
 * Hook for staggered animations of child elements
 * @param {number} childCount - Number of children to animate
 * @param {number} delay - Delay between each child animation (ms)
 * @returns {Array} - [containerRef, isVisible]
 */
export function useStaggerAnimation(childCount, delay = 100) {
  const [containerRef, isVisible] = useScrollAnimation();

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const children = containerRef.current.children;
    Array.from(children).forEach((child, index) => {
      child.style.animationDelay = `${index * delay}ms`;
    });
  }, [isVisible, childCount, delay]);

  return [containerRef, isVisible];
}