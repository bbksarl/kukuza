import { useEffect, useState, RefObject } from 'react';

export function useCenterOffset(elementRef: RefObject<HTMLElement | null>) {
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let raf: number | null = null;

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
import { useEffect, useState, RefObject } from 'react';

export function useCenterOffset(elementRef: RefObject<HTMLElement>) {
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let raf: number | null = null;

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
