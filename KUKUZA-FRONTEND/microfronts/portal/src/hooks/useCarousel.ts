import { useState, useEffect, useRef, MutableRefObject } from 'react';

export function useCarousel<T>(items: T[], visibleCount = 5, autoPlayInterval = 2800) {
  const [index, setIndex] = useState(items.length);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(visibleCount);
  const [itemWidth, setItemWidth] = useState(0);
  const [gapPx, setGapPx] = useState(14);

  const viewportRef = useRef<HTMLElement | null>(null) as MutableRefObject<HTMLElement | null>;
  const trackRef = useRef<HTMLElement | null>(null) as MutableRefObject<HTMLElement | null>;
  const itemRef = useRef<HTMLElement | null>(null) as MutableRefObject<HTMLElement | null>;
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setVisible(2);
      else if (w < 1024) setVisible(3);
      else setVisible(visibleCount);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [visibleCount]);

  useEffect(() => {
    const resize = () => {
      if (!itemRef.current || !trackRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const trackStyle = window.getComputedStyle(trackRef.current);
      const gapValue = parseFloat(trackStyle.gap || trackStyle.columnGap || '0');
      setItemWidth(rect.width);
      setGapPx(gapValue || 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [visible]);

  useEffect(() => {
    const n = items.length;
    if (!trackRef.current || !itemWidth || n === 0) return;
    const node = trackRef.current;
    node.style.transition = 'none';
    const px = (itemWidth + gapPx) * index;
    node.style.transform = `translateX(-${px}px)`;
    void node.getBoundingClientRect();
    requestAnimationFrame(() => { node.style.transition = ''; });
  }, [itemWidth, gapPx, items.length]);

  useEffect(() => {
    if (!trackRef.current) return;
    const node = trackRef.current;
    const px = (itemWidth + gapPx) * index;
    node.style.transform = `translateX(-${px}px)`;
  }, [index, itemWidth, gapPx]);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const n = items.length;
    const onTransitionEnd = (ev: TransitionEvent) => {
      if ((ev as any).propertyName !== 'transform') return;
      const upperSafe = n * 2 - visible;
      if (index >= upperSafe) {
        const newIndex = index - n;
        node.style.transition = 'none';
        const px = (itemWidth + gapPx) * newIndex;
        node.style.transform = `translateX(-${px}px)`;
        void node.getBoundingClientRect();
        setIndex(newIndex);
        requestAnimationFrame(() => { node.style.transition = ''; });
      }
      if (index < 0) {
        const newIndex = index + n;
        node.style.transition = 'none';
        const px = (itemWidth + gapPx) * newIndex;
        node.style.transform = `translateX(-${px}px)`;
        void node.getBoundingClientRect();
        setIndex(newIndex);
        requestAnimationFrame(() => { node.style.transition = ''; });
      }
      isTransitioningRef.current = false;
    };
    node.addEventListener('transitionend', onTransitionEnd as EventListener);
    return () => node.removeEventListener('transitionend', onTransitionEnd as EventListener);
  }, [index, items.length, itemWidth, gapPx, visible]);

  useEffect(() => {
    if (paused || items.length === 0) return;
    const id = setInterval(() => {
      // @ts-ignore mutate ref
      isTransitioningRef.current = true;
      setIndex((i) => i + 1);
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [paused, items.length, autoPlayInterval]);

  const onPrev = () => {
    if (isTransitioningRef.current) return;
    // @ts-ignore
    isTransitioningRef.current = true;
    setIndex((i) => i - 1);
  };

  const onNext = () => {
    if (isTransitioningRef.current) return;
    // @ts-ignore
    isTransitioningRef.current = true;
    setIndex((i) => i + 1);
  };

  const translatePx = (itemWidth + gapPx) * index;

  return {
    index,
    paused,
    setPaused,
    visible,
    itemWidth,
    gapPx,
    viewportRef,
    trackRef,
    itemRef,
    isTransitioningRef,
    onPrev,
    onNext,
    translatePx,
  } as const;
}
import { useState, useEffect, useRef } from 'react';

export function useCarousel(items: any[], visibleCount = 5, autoPlayInterval = 2800) {
  const [index, setIndex] = useState(items.length);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(visibleCount);
  const [itemWidth, setItemWidth] = useState(0);
  const [gapPx, setGapPx] = useState(14);

  const viewportRef = useRef<any>(null);
  const trackRef = useRef<any>(null);
  const itemRef = useRef<any>(null);
  const isTransitioningRef = useRef<any>(false);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setVisible(2);
      else if (w < 1024) setVisible(3);
      else setVisible(visibleCount);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [visibleCount]);

  useEffect(() => {
    const resize = () => {
      if (!itemRef.current || !trackRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const trackStyle = window.getComputedStyle(trackRef.current);
      const gapValue = parseFloat(trackStyle.gap || trackStyle.columnGap || '0');
      setItemWidth(rect.width);
      setGapPx(gapValue || 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [visible]);

  useEffect(() => {
    const n = items.length;
    if (!trackRef.current || !itemWidth || n === 0) return;
    const node = trackRef.current;
    node.style.transition = 'none';
    const px = (itemWidth + gapPx) * index;
    node.style.transform = `translateX(-${px}px)`;
    void node.getBoundingClientRect();
    requestAnimationFrame(() => { node.style.transition = ''; });
  }, [itemWidth, gapPx, items.length]);

  useEffect(() => {
    if (!trackRef.current) return;
    const node = trackRef.current;
    const px = (itemWidth + gapPx) * index;
    node.style.transform = `translateX(-${px}px)`;
  }, [index, itemWidth, gapPx]);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const n = items.length;
    const onTransitionEnd = (ev: any) => {
      if (ev.propertyName !== 'transform') return;
      const upperSafe = n * 2 - visible;
      if (index >= upperSafe) {
        const newIndex = index - n;
        node.style.transition = 'none';
        const px = (itemWidth + gapPx) * newIndex;
        node.style.transform = `translateX(-${px}px)`;
        void node.getBoundingClientRect();
        setIndex(newIndex);
        requestAnimationFrame(() => { node.style.transition = ''; });
      }
      if (index < 0) {
        const newIndex = index + n;
        node.style.transition = 'none';
        const px = (itemWidth + gapPx) * newIndex;
        node.style.transform = `translateX(-${px}px)`;
        void node.getBoundingClientRect();
        setIndex(newIndex);
        requestAnimationFrame(() => { node.style.transition = ''; });
      }
      isTransitioningRef.current = false;
    };
    node.addEventListener('transitionend', onTransitionEnd);
    return () => node.removeEventListener('transitionend', onTransitionEnd);
  }, [index, items.length, itemWidth, gapPx, visible]);

  useEffect(() => {
    if (paused || items.length === 0) return;
    const id = setInterval(() => {
      isTransitioningRef.current = true;
      setIndex((i) => i + 1);
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [paused, items.length, autoPlayInterval]);

  const onPrev = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIndex((i) => i - 1);
  };

  const onNext = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIndex((i) => i + 1);
  };

  const translatePx = (itemWidth + gapPx) * index;

  return {
    index,
    paused,
    setPaused,
    visible,
    itemWidth,
    gapPx,
    viewportRef,
    trackRef,
    itemRef,
    isTransitioningRef,
    onPrev,
    onNext,
    translatePx,
  } as any;
}
