import { useEffect, useRef, useState, RefObject } from 'react';

export function useScrollAnimation(options: { threshold?: number; rootMargin?: string } = {}) {
  const elementRef = useRef<HTMLElement | null>(null) as RefObject<HTMLElement>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options,
    } as IntersectionObserverInit;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return [elementRef, isVisible] as const;
}

export function useStaggerAnimation(childCount: number, delay = 100) {
  const [containerRef, isVisible] = useScrollAnimation();

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const children = containerRef.current.children;
    Array.from(children).forEach((child, index) => {
      (child as HTMLElement).style.animationDelay = `${index * delay}ms`;
    });
  }, [isVisible, childCount, delay]);

  return [containerRef, isVisible] as const;
}
