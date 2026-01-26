import { useEffect, useState } from 'react';

/**
 * useCenterTrigger(ref, { tolerance })
 * Returns true when the element's center is within viewport center +/- tolerance fraction
 */
export function useCenterTrigger(elementRef, options = {}) {
  const { tolerance = 0.08 } = options;
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    let mounted = true;
    let rafId = null;

    function check() {
      if (!mounted) return;
      const el = elementRef && elementRef.current;
      if (!el) {
        rafId = requestAnimationFrame(check);
        return;
      }

      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const allowed = Math.max(window.innerHeight * tolerance, 1);

      const centeredNow = Math.abs(centerY - viewportCenter) <= allowed;
      setIsCentered((prev) => (prev === centeredNow ? prev : centeredNow));

      rafId = requestAnimationFrame(check);
    }

    rafId = requestAnimationFrame(check);

    function onResize() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(check);
    }

    window.addEventListener('resize', onResize);
    // rely on rAF loop rather than scroll listener for smoother updates

    return () => {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [elementRef, tolerance]);

  return isCentered;
}
