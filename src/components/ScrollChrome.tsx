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

const SECTIONS: SectionDef[] = [
  { id: "about", name: "About" },
  { id: "projects", name: "Projects" },
  { id: "circle-gallery", name: "Gallery" },
  { id: "skills", name: "Skills" },
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

      st = ScrollTrigger.create({
        trigger: "#" + first.id,
        start: "top bottom",
        endTrigger: "#" + last.id,
        end: "bottom bottom",
        onUpdate: (self) => {
          const docH =
            document.documentElement.scrollHeight - window.innerHeight;
          const pctValue =
            docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0;
          pctEl.textContent = "(" + pctValue + ")";

          const progress = self.progress;
          if (progress <= 0 || progress >= 0.9) {
            timelineEl.classList.remove("visible");
            pctEl.classList.remove("visible");
            timelineEl.style.removeProperty("opacity");
            pctEl.style.removeProperty("opacity");
            return;
          }
          timelineEl.classList.add("visible");
          pctEl.classList.add("visible");

          let segStart = 0;
          let activeName = entries[0].name;
          for (let i = 0; i < entries.length; i++) {
            const ratio = ratios[i];
            const segEnd = segStart + ratio;
            if (progress < segEnd) {
              fills[i].style.height =
                clamp01((progress - segStart) / ratio) * 100 + "%";
              activeName = entries[i].name;
              for (let j = i + 1; j < entries.length; j++) {
                fills[j].style.height = "0%";
              }
              break;
            }
            fills[i].style.height = "100%";
            activeName = entries[i].name;
            segStart = segEnd;
          }

          labelEl.textContent = activeName;
          labelEl.style.top = (progress * 100).toFixed(1) + "%";
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
