"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, isMobileViewport } from "@/lib/gsap";
import { useLenis } from "@/components/LenisProvider";

interface SectionDef {
  id: string;
  name: string;
}

interface SectionEntry extends SectionDef {
  el: HTMLElement;
}

/**
 * The homepage sections this timeline tracks, named for the content they now
 * carry (Website Copy Master S3-S11).
 *
 * ORDER IS NOT TAKEN FROM THIS ARRAY. The previous version hardcoded the old
 * page order and the segment maths walked it in list order, so after the
 * homepage was rebuilt the labels mapped onto the wrong scroll ranges — the
 * indicator read "Story" over Services, "Practice" over Clients and Collaborate,
 * and "Contact" over Media. Entries are sorted by document position at setup so
 * reordering sections cannot desynchronise this again.
 */
const SECTIONS: SectionDef[] = [
  { id: "manifesto", name: "Positioning" },
  { id: "skills", name: "Services" },
  { id: "about", name: "Story" },
  { id: "circle-gallery", name: "Experience" },
  { id: "metrics", name: "Numbers" },
  { id: "clients", name: "Clients" },
  { id: "projects", name: "Collaborate" },
  { id: "consultation-feature", name: "Consultation" },
  { id: "press", name: "Media" },
  { id: "contact", name: "Contact" },
];

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * Fixed scroll chrome: left-edge scroll percentage "(NN)" and right-edge
 * segmented section timeline with proportional fills, section label and
 * click-to-scroll (Lenis). Desktop only; built after the intro finishes.
 */
export function ScrollChrome() {
  const pctRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if (isMobileViewport()) return;

    let st: ScrollTrigger | null = null;
    const segs: HTMLDivElement[] = [];

    const setup = () => {
      const barEl = barRef.current;
      const timelineEl = timelineRef.current;
      const pctEl = pctRef.current;
      const labelEl = labelRef.current;
      if (!barEl || !timelineEl || !pctEl || !labelEl) return;

      const defs = isMobileViewport()
        ? SECTIONS.filter((s) => s.id !== "circle-gallery")
        : SECTIONS;

      const entries: SectionEntry[] = [];
      for (const def of defs) {
        const el = document.getElementById(def.id);
        if (el) entries.push({ ...def, el });
      }
      if (entries.length === 0) return;

      // Segment order must follow the document, not the array above.
      const docTop = (el: HTMLElement) =>
        el.getBoundingClientRect().top + window.scrollY;
      entries.sort((a, b) => docTop(a.el) - docTop(b.el));

      const first = entries[0];
      const last = entries[entries.length - 1];

      const scrollY0 = window.scrollY;
      const zoneTop = first.el.getBoundingClientRect().top + scrollY0;
      const zoneBottom =
        last.el.getBoundingClientRect().top + scrollY0 + last.el.offsetHeight;
      const zoneH = zoneBottom - zoneTop;
      if (zoneH <= 0) return;

      const ratios: number[] = [];
      const fills: HTMLDivElement[] = [];

      for (const entry of entries) {
        const ratio = entry.el.offsetHeight / zoneH;
        ratios.push(ratio);

        const seg = document.createElement("div");
        seg.className = "st-seg";
        seg.style.flex = ratio.toFixed(4);
        seg.title = entry.name;

        const fill = document.createElement("div");
        fill.className = "st-seg-fill";
        seg.appendChild(fill);
        fills.push(fill);

        seg.addEventListener("click", () => {
          const lenisInstance = lenisRef.current;
          if (lenisInstance) {
            lenisInstance.scrollTo("#" + entry.id, {
              offset: 0,
              duration: 1.2,
            });
          } else {
            entry.el.scrollIntoView({ behavior: "smooth" });
          }
        });

        barEl.appendChild(seg);
        segs.push(seg);
      }

      /**
       * Section bounds in document space, refreshed with ScrollTrigger.
       * The label is driven by what is actually on screen rather than by the
       * trigger's own progress: that progress reaches a section when its TOP
       * crosses the viewport BOTTOM, so the readout ran a full viewport ahead
       * of the reader — "Story" over Services, "Numbers" over Experience,
       * "Consultation" over Collaborate.
       */
      let bounds: { top: number; bottom: number }[] = [];
      const measure = () => {
        const sy = window.scrollY;
        bounds = entries.map((e) => {
          const top = e.el.getBoundingClientRect().top + sy;
          return { top, bottom: top + e.el.offsetHeight };
        });
      };
      measure();

      st = ScrollTrigger.create({
        trigger: "#" + first.id,
        start: "top bottom",
        endTrigger: "#" + last.id,
        end: "bottom bottom",
        onRefresh: measure,
        onUpdate: () => {
          const docH =
            document.documentElement.scrollHeight - window.innerHeight;
          const pctValue =
            docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0;
          pctEl.textContent = "(" + pctValue + ")";

          if (bounds.length === 0) return;

          // The section under the middle of the viewport is the one being read.
          const mid = window.scrollY + window.innerHeight / 2;
          const zoneStart = bounds[0].top;
          const zoneEnd = bounds[bounds.length - 1].bottom;

          if (mid < zoneStart || mid > zoneEnd) {
            timelineEl.classList.remove("visible");
            pctEl.classList.remove("visible");
            timelineEl.style.removeProperty("opacity");
            pctEl.style.removeProperty("opacity");
            return;
          }
          timelineEl.classList.add("visible");
          pctEl.classList.add("visible");

          let active = 0;
          for (let i = 0; i < bounds.length; i++) {
            if (mid >= bounds[i].top) active = i;
          }

          for (let i = 0; i < bounds.length; i++) {
            if (i < active) {
              fills[i].style.height = "100%";
            } else if (i > active) {
              fills[i].style.height = "0%";
            } else {
              const h = bounds[i].bottom - bounds[i].top;
              fills[i].style.height =
                (h > 0 ? clamp01((mid - bounds[i].top) / h) : 0) * 100 + "%";
            }
          }

          labelEl.textContent = entries[active].name;
          labelEl.style.top =
            (clamp01((mid - zoneStart) / (zoneEnd - zoneStart)) * 100).toFixed(
              1,
            ) + "%";
        },
      });
    };

    window.addEventListener("intro:done", setup, { once: true });

    return () => {
      window.removeEventListener("intro:done", setup);
      if (st) st.kill();
      for (const seg of segs) seg.remove();
    };
  }, []);

  return (
    <>
      <div className="scroll-pct" id="scroll-pct" ref={pctRef}>
        (0)
      </div>
      <div className="scroll-timeline" id="scroll-timeline" ref={timelineRef}>
        <span className="st-label" id="st-label" ref={labelRef}></span>
        <div className="st-bar" id="st-bar" ref={barRef}></div>
      </div>
    </>
  );
}
