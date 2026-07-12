"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Bootstraps Lenis smooth scroll (lerp 0.06) wired to GSAP ScrollTrigger,
 * matching the original site's scroll architecture.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafCb = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const instance = new Lenis({ lerp: 0.06 });
    instance.on("scroll", ScrollTrigger.update);
    const cb = (time: number) => instance.raf(time * 1000);
    rafCb.current = cb;
    gsap.ticker.add(cb);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    // Harmless test hook (mirrors HeroCanvas's ?mx/?my) so headless QA can
    // drive the smooth scroller directly instead of fighting it.
    (window as unknown as { __lenis?: Lenis }).__lenis = instance;

    return () => {
      if (rafCb.current) gsap.ticker.remove(rafCb.current);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
