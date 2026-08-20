"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Home Section 6 "Selected Numbers" — the client's own approved figures from
 * the Website Copy Master, replacing the earlier inferred "08 ventures / 07
 * industries" (which contradicted the master: it deliberately says "Multiple").
 *
 * The master instructs: "Before final publishing, verify all figures with Paria
 * and update live social numbers. Do not publish unverified performance
 * claims." Four of these carry `pending` and MUST be confirmed before this site
 * goes public — see PENDING_VERIFICATION in src/data/content.ts.
 */
const STATS = [
  { value: 25, suffix: "+", pad: 0, label: "Years across entrepreneurship, luxury, technology, media, beauty, hospitality, and business." },
  { value: 500, suffix: "K+", pad: 0, label: "Global community reached through entrepreneurship, lifestyle, travel, business, and authentic storytelling.", pending: true },
  { value: 120, suffix: "+", pad: 0, label: "Brand collaborations across luxury, hospitality, beauty, technology, healthcare, travel, media, and lifestyle.", pending: true },
  { value: 15, suffix: "+", pad: 0, label: "Countries connected through collaborations, business activity, media, speaking, and brand partnerships.", pending: true },
  { value: 2.5, suffix: "M+", pad: 0, decimals: 1, label: "Content reach generated across original content, campaigns, partnerships, and media activity.", pending: true },
  { text: "Multiple", label: "Ventures founded, scaled, advised, represented, or accelerated." },
];

const fmt = (n: number, pad: number, suffix: string, decimals = 0) => {
  const v = decimals ? n.toFixed(decimals) : String(Math.round(n));
  return (pad ? v.padStart(pad, "0") : v) + suffix;
};

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
      const nums = gsap.utils
        .toArray<HTMLElement>(".metric-num", section)
        .filter((el) => el.dataset.target !== undefined);

      if (reduced) {
        nums.forEach((el) => {
          el.textContent = fmt(
            Number(el.dataset.target),
            Number(el.dataset.pad || 0),
            el.dataset.suffix || "",
            Number(el.dataset.decimals || 0),
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
        const decimals = Number(el.dataset.decimals || 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = fmt(obj.v, pad, suffix, decimals);
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="metrics" id="metrics" ref={ref}>
      <div className="metrics-inner">
        <p className="metrics-kicker">A Journey in Numbers</p>
        <div className="metrics-grid">
          {STATS.map((s) => (
            <div className="metric-col" key={s.label}>
              {"text" in s ? (
                <span className="metric-num">{s.text}</span>
              ) : (
                <span
                  className="metric-num"
                  data-target={s.value}
                  data-pad={s.pad}
                  data-suffix={s.suffix}
                  data-decimals={s.decimals ?? 0}
                >
                  {s.pad ? "00" : "0"}
                </span>
              )}
              <span className="metric-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
