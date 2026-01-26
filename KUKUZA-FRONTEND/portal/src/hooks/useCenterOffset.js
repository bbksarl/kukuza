import { useEffect, useState } from 'react';

/**
 * useCenterOffset(ref)
 * Returns the signed vertical offset (px) of element center relative to viewport center.
 * Positive means element center is below viewport center, negative means above.
 */
export function useCenterOffset(elementRef) {
  const [offset, setOffset] = useState(null);

  useEffect(() => {
    let mounted = true;
    let raf = null;

    function loop() {
      if (!mounted) return;
      const el = elementRef && elementRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        setOffset(centerY - viewportCenter);
      } else {
        setOffset(null);
      }
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    function onResize() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [elementRef]);

  return offset;
}
