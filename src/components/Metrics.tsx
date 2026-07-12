"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** Grounded in her supplied content: 25+ years, 8 ventures, 7 industries. */
const STATS = [
  {
    value: 25,
    suffix: "+",
    pad: 0,
    label: "Years across luxury, beauty, technology & media",
  },
  { value: 8, suffix: "", pad: 2, label: "Ventures founded & scaled" },
  { value: 7, suffix: "", pad: 2, label: "Industries shaped" },
];

const fmt = (n: number, pad: number, suffix: string) =>
  (pad ? String(n).padStart(pad, "0") : String(n)) + suffix;

/**
 * "Signature Numbers" — an editorial credibility band (not part of the studied
 * template). Numbers count up once as they scroll into view; columns rise in
 * with a stagger. Static fallback under reduced-motion.
 */
export function Metrics() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".metric-num", section);

      if (reduced) {
        nums.forEach((el) => {
          el.textContent = fmt(
            Number(el.dataset.target),
            Number(el.dataset.pad || 0),
            el.dataset.suffix || "",
          );
        });
        return;
      }

      gsap.from(".metric-col", {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      nums.forEach((el) => {
        const target = Number(el.dataset.target);
        const pad = Number(el.dataset.pad || 0);
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = fmt(Math.round(obj.v), pad, suffix);
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="metrics" id="metrics" ref={ref}>
      <div className="metrics-inner">
        <p className="metrics-kicker">A quarter-century in motion</p>
        <div className="metrics-grid">
          {STATS.map((s) => (
            <div className="metric-col" key={s.label}>
              <span
                className="metric-num"
                data-target={s.value}
                data-pad={s.pad}
                data-suffix={s.suffix}
              >
                {s.pad ? "00" : "0"}
              </span>
              <span className="metric-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
