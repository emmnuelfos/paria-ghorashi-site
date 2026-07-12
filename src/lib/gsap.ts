"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const isMobileDevice = () =>
  typeof navigator !== "undefined" && navigator.maxTouchPoints > 1;

export const isMobileViewport = () =>
  typeof document !== "undefined" &&
  (document.documentElement.clientWidth || window.innerWidth) <= 768;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
