"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

const LenisContext = createContext<{ current: Lenis | null }>({ current: null });

let lenisInstance: Lenis | null = null;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
    ref.current = lenis;
    lenisInstance = lenis;
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      ref.current = null;
      lenisInstance = null;
    };
  }, []);

  return <LenisContext.Provider value={ref}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}

/** Lock/unlock page scroll (mobile menu). */
export function setScrollLocked(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Smooth-scroll to `#id`, a number, or an element. Falls back to native scrolling. */
export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  const reduced = prefersReducedMotion();
  if (lenisInstance && !reduced) {
    lenisInstance.scrollTo(target, { offset, duration: 1.2 });
    return;
  }
  let top = 0;
  if (typeof target === "number") top = target;
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY + offset;
  }
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
