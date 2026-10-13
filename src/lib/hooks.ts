"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once (or while, if `once` is false) the element intersects the viewport. */
export function useInView<T extends Element>(
  options: IntersectionObserverInit & { once?: boolean } = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { once = true, root, rootMargin, threshold } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, root, rootMargin, threshold]);

  return [ref, inView];
}

/**
 * 0 → 1 progress of an element through the viewport, written to a ref and passed
 * to `onProgress` on every animation frame it changes (no React re-render).
 * `start`/`end` are viewport fractions: progress is 0 when the element top hits
 * `start`, and 1 when the element bottom hits `end`.
 */
export function useScrollProgress<T extends HTMLElement>(
  onProgress: (p: number, el: T) => void,
  { start = 1, end = 0 }: { start?: number; end?: number } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = -1;
    let visible = false;

    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * start;
      const to = vh * end;
      const total = r.height + (from - to);
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, (from - r.top) / total));
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        cb.current(p, el);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: "20% 0px 20% 0px" });
    io.observe(el);
    const onScroll = () => visible && schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [start, end]);

  return ref;
}
