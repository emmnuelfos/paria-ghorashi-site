"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Subtle scroll reveal — a fade and short rise, nothing more.
 *
 * The brief asks for fades, image reveals and slow zooms and explicitly rules
 * out flashy movement, so this deliberately uses IntersectionObserver rather
 * than the homepage's scrubbed GSAP timelines: inner pages should read as
 * calm editorial, and it keeps these routes light on mobile.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Already in view on load (or no observer): show immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      // threshold 0, not a ratio: the -12% bottom margin already holds the
      // reveal back until the block is properly in view. Requiring a visible
      // fraction on top of that can strand a block that loads parked inside
      // the excluded band (deep link, or a browser-restored scroll position)
      // with opacity 0 and no scroll event to release it.
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`pg-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
