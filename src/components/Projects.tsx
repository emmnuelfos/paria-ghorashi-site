"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/components/LenisProvider";
import { PROJECTS } from "@/data/site";
import type Lenis from "lenis";

/**
 * Projects section — scroll-PROXIMITY activation (not hover-driven): the item
 * nearest the viewport center becomes active and drives the fixed preview
 * card, items drift on x with distance, the card tilts toward the mouse and a
 * "See project" pill chases the cursor. A red fluid line draws itself behind
 * the list, scrubbed by scroll.
 */
export function Projects() {
  const lenis = useLenis();
  const lenisRef = useRef<Lenis | null>(null);
  const onScrollRef = useRef<(() => void) | null>(null);

  const pathRef = useRef<SVGPathElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const coverRef = useRef<HTMLImageElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const list = listRef.current;
    const preview = previewRef.current;
    const card = cardRef.current;
    const dateEl = dateRef.current;
    const cover = coverRef.current;
    const cursor = cursorRef.current;
    if (!path || !list || !preview || !card || !dateEl || !cover || !cursor) {
      return;
    }

    const items = Array.from(list.querySelectorAll<HTMLElement>(".proj-item"));
    const clamp = gsap.utils.clamp(-1, 1);
    const disposers: (() => void)[] = [];

    let activeIdx = -1;
    let projectsVisible = false;

    // Card tilt state (targets set on mousemove, lerped each tick).
    let targetRx = 0;
    let targetRy = 0;
    let curRx = 0;
    let curRy = 0;

    const ctx = gsap.context(() => {
      // 1. Fluid line self-draw, scrubbed across the section.
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      let lineProgress = 0;
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#projects",
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1,
          onUpdate: (self) => {
            lineProgress = self.progress;
          },
        },
      });

      // 1b. Gold glitter flowing along the ribbon, revealed as it draws.
      const reduced = prefersReducedMotion();
      const svg = path.ownerSVGElement;
      if (svg && !reduced) {
        const NS = "http://www.w3.org/2000/svg";

        // Soft white->gold->transparent sparkle fill (shared by every glint).
        const defs = document.createElementNS(NS, "defs");
        const grad = document.createElementNS(NS, "radialGradient");
        grad.setAttribute("id", "fluid-glint-grad");
        (
          [
            ["0%", "#FFFFFF", "1"],
            ["32%", "#F5E7C4", "0.92"],
            ["68%", "#A78B65", "0.34"],
            ["100%", "#A78B65", "0"],
          ] as const
        ).forEach(([off, col, op]) => {
          const st = document.createElementNS(NS, "stop");
          st.setAttribute("offset", off);
          st.setAttribute("stop-color", col);
          st.setAttribute("stop-opacity", op);
          grad.appendChild(st);
        });
        defs.appendChild(grad);
        svg.appendChild(defs);

        const layer = document.createElementNS(NS, "g");
        layer.setAttribute("class", "fluid-glints");
        svg.appendChild(layer);
        disposers.push(() => {
          layer.remove();
          defs.remove();
        });

        // Pre-sample the path into position + unit-normal lookup (avoids
        // getPointAtLength in the hot loop).
        const SAMPLES = 260;
        const tbl: { x: number; y: number; nx: number; ny: number }[] = [];
        for (let s = 0; s <= SAMPLES; s++) {
          const t = s / SAMPLES;
          const p = path.getPointAtLength(t * len);
          const p2 = path.getPointAtLength(
            Math.min(len, (t + 1 / SAMPLES) * len),
          );
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          tbl.push({ x: p.x, y: p.y, nx: -dy / d, ny: dx / d });
        }

        const rnd = gsap.utils.random;
        const N = 22;
        const glints = Array.from({ length: N }, (_, i) => {
          const big = i % 5 === 0;
          const c = document.createElementNS(NS, "circle");
          c.setAttribute("r", String(big ? rnd(9, 14) : rnd(4, 8)));
          c.setAttribute("fill", "url(#fluid-glint-grad)");
          c.setAttribute("opacity", "0");
          layer.appendChild(c);
          return {
            el: c,
            base: (i + rnd(-0.4, 0.4)) / N,
            speed: big ? rnd(0.006, 0.012) : rnd(0.012, 0.022),
            offset: rnd(-24, 24),
            twPhase: rnd(0, Math.PI * 2),
            twSpeed: rnd(1.6, 3.4),
            baseOp: big ? rnd(0.55, 0.8) : rnd(0.75, 1),
          };
        });

        // Pause when the section is well out of view.
        let inView = false;
        const io = new IntersectionObserver(
          (entries) => {
            inView = entries[0]?.isIntersecting ?? false;
          },
          { rootMargin: "25% 0px 25% 0px" },
        );
        io.observe(path.closest("#projects") ?? path);
        disposers.push(() => io.disconnect());

        const c01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
        const glintTick = (time: number) => {
          if (!inView) return;
          const drawn = lineProgress;
          for (let i = 0; i < glints.length; i++) {
            const g = glints[i];
            let t = (g.base + time * g.speed) % 1;
            if (t < 0) t += 1;
            // Only sparkle over the already-drawn portion of the ribbon.
            if (t > drawn) {
              if (g.el.getAttribute("opacity") !== "0")
                g.el.setAttribute("opacity", "0");
              continue;
            }
            const s = tbl[Math.round(t * SAMPLES)];
            const twinkle = 0.45 + 0.55 * Math.sin(time * g.twSpeed + g.twPhase);
            const fade = c01((drawn - t) / 0.06) * c01(t / 0.04);
            g.el.setAttribute("cx", (s.x + s.nx * g.offset).toFixed(1));
            g.el.setAttribute("cy", (s.y + s.ny * g.offset).toFixed(1));
            g.el.setAttribute("opacity", c01(g.baseOp * twinkle * fade).toFixed(3));
          }
        };
        gsap.ticker.add(glintTick);
        disposers.push(() => gsap.ticker.remove(glintTick));
      }

      // 2. Visibility window for the fixed preview layer.
      const showPreview = () => {
        preview.classList.add("visible");
        projectsVisible = true;
      };
      const hidePreview = () => {
        preview.classList.remove("visible");
        projectsVisible = false;
      };
      ScrollTrigger.create({
        trigger: "#projects",
        start: "top 80%",
        end: "bottom 20%",
        onEnter: showPreview,
        onEnterBack: showPreview,
        onLeave: hidePreview,
        onLeaveBack: hidePreview,
      });

      // 3. Card starts hidden; preload every cover so swaps are instant.
      gsap.set(card, { opacity: 0 });
      PROJECTS.forEach((p) => {
        const im = new Image();
        im.src = p.cover;
        im.decode().catch(() => undefined);
      });

      // 4. Proximity activation — driven by Lenis scroll events.
      const xTo = items.map((el) =>
        gsap.quickTo(el, "x", { duration: 0.6, ease: "power2.out" })
      );

      const activateProject = (i: number) => {
        if (i === activeIdx) return;
        const hadActive = activeIdx !== -1;
        activeIdx = i;
        items.forEach((el, j) => el.classList.toggle("active", j === i));
        const p = PROJECTS[i];
        const swap = () => {
          cover.src = p.cover;
          dateEl.textContent = p.date;
        };
        gsap.killTweensOf(card);
        if (!hadActive) {
          swap();
          gsap.to(card, { opacity: 1, duration: 0.4, ease: "power2.out" });
        } else {
          gsap.to(card, {
            opacity: 0,
            duration: 0.18,
            ease: "power2.in",
            onComplete: () => {
              if (activeIdx !== i) return;
              swap();
              gsap.to(card, { opacity: 1, duration: 0.3, ease: "power2.out" });
            },
          });
        }
      };

      const deactivateAll = () => {
        if (activeIdx === -1) return;
        activeIdx = -1;
        items.forEach((el) => el.classList.remove("active"));
        gsap.killTweensOf(card);
        gsap.to(card, { opacity: 0, duration: 0.25, ease: "power2.in" });
      };

      const onScroll = () => {
        const vh = window.innerHeight;
        let closestIdx = -1;
        let closestDist = Infinity;
        items.forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          const dist = Math.abs(rect.top + rect.height / 2 - vh / 2);
          xTo[i](Math.min(dist / (vh / 2), 1) * 80);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        });
        if (closestIdx !== -1 && closestDist < vh * 0.45) {
          activateProject(closestIdx);
        } else {
          deactivateAll();
        }
      };
      onScrollRef.current = onScroll;

      // 5 + 6. Card tilt targets and cursor pill follow, one mousemove.
      const cursorX = gsap.quickTo(cursor, "left", {
        duration: 0.35,
        ease: "power3.out",
      });
      const cursorY = gsap.quickTo(cursor, "top", {
        duration: 0.35,
        ease: "power3.out",
      });

      const onMouseMove = (e: MouseEvent) => {
        if (!projectsVisible) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        targetRy = clamp((e.clientX - cx) / (rect.width / 2)) * 6;
        targetRx = -clamp((e.clientY - cy) / (rect.height / 2)) * 5;
        cursorX(e.clientX);
        cursorY(e.clientY);
      };
      document.addEventListener("mousemove", onMouseMove);
      disposers.push(() =>
        document.removeEventListener("mousemove", onMouseMove)
      );

      const tick = () => {
        curRy += (targetRy - curRy) * 0.12;
        curRx += (targetRx - curRx) * 0.12;
        card.style.transform = `rotateY(${curRy}deg) rotateX(${curRx}deg)`;
      };
      gsap.ticker.add(tick);
      disposers.push(() => gsap.ticker.remove(tick));

      const onCoverEnter = () => cursor.classList.add("active");
      const onCoverLeave = () => cursor.classList.remove("active");
      cover.addEventListener("mouseenter", onCoverEnter);
      cover.addEventListener("mouseleave", onCoverLeave);
      disposers.push(() => {
        cover.removeEventListener("mouseenter", onCoverEnter);
        cover.removeEventListener("mouseleave", onCoverLeave);
      });

      // 7. Click: center the clicked item (active click = detail overlay,
      // out of clone scope).
      items.forEach((el, i) => {
        const onClick = () => {
          if (el.classList.contains("active")) {
            // TODO: project detail overlay — out of scope for this clone.
            return;
          }
          activateProject(i);
          const l = lenisRef.current;
          if (!l) return;
          let docTop = 0;
          let node: HTMLElement | null = el;
          while (node) {
            docTop += node.offsetTop;
            node =
              node.offsetParent instanceof HTMLElement
                ? node.offsetParent
                : null;
          }
          const vh = window.innerHeight;
          l.scrollTo(docTop - vh / 2 + el.offsetHeight / 2, { duration: 1.2 });
        };
        el.addEventListener("click", onClick);
        disposers.push(() => el.removeEventListener("click", onClick));
      });

      // 8. Lenis lerp tightening while an item crosses the center band.
      const setLerp = (v: number) => {
        const l = lenisRef.current;
        if (l) l.options.lerp = v;
      };
      items.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 52%",
          end: "bottom 48%",
          onEnter: () => setLerp(0.04),
          onEnterBack: () => setLerp(0.04),
          onLeave: () => setLerp(0.06),
          onLeaveBack: () => setLerp(0.06),
        });
      });

      // Initial pass (Lenis may not exist yet).
      onScroll();
    });

    return () => {
      onScrollRef.current = null;
      disposers.forEach((d) => d());
      gsap.killTweensOf(card);
      ctx.revert();
    };
  }, []);

  // Proximity pass rides Lenis scroll events; re-wire when Lenis arrives.
  useEffect(() => {
    lenisRef.current = lenis;
    if (!lenis) return;
    const handler = () => onScrollRef.current?.();
    lenis.on("scroll", handler);
    onScrollRef.current?.();
    return () => {
      lenis.off("scroll", handler);
      lenisRef.current = null;
    };
  }, [lenis]);

  return (
    <>
      <div className="projects" id="projects">
        <svg
          className="fluid-line-svg"
          id="fluid-line-svg"
          viewBox="0 0 1400 1400"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            className="fluid-line"
            id="fluid-line"
            d="M -80,0 C 300,-20  600,150  540,400 C 490,650   0,655    300,1050 C 600,1385 650,1250 850,1200 C 1050,1150 1350,1250 1540,1300"
          />
        </svg>
        <div className="projects-inner">
          <div className="projects-list" id="projects-list" ref={listRef}>
            {PROJECTS.map((p) => (
              <div key={p.id} className="proj-item" data-id={p.id}>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="proj-preview" id="proj-preview" ref={previewRef}>
        <div className="proj-card" id="proj-card" ref={cardRef}>
          <div className="proj-meta">
            <span className="proj-date" id="proj-date" ref={dateRef}>
              01 2025
            </span>
            <span className="proj-label">Preview</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="proj-cover" ref={coverRef} src={PROJECTS[0].cover} alt="" />
        </div>
      </div>
      <div className="proj-cursor" id="proj-cursor" ref={cursorRef}>
        See more
      </div>
    </>
  );
}
