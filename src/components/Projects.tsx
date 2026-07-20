"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobileViewport } from "@/lib/gsap";
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
      // The default path is drawn for a wide canvas; with `slice` on a tall
      // phone viewport the 1400-wide viewBox scales up to ~2x the screen and
      // ~84% of the curve lands off-screen left. Swap in a path authored for a
      // narrow column and let it fit the width exactly.
      const svg = path.ownerSVGElement;
      if (svg && isMobileViewport()) {
        svg.setAttribute("viewBox", "0 0 390 1400");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        path.setAttribute(
          "d",
          "M -30,-40 C 90,150 300,190 300,420 C 300,650 60,700 90,930 C 115,1130 300,1180 420,1420",
        );
      }
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#projects",
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

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
            {PROJECTS.map((p, i) => (
              <div key={p.id} className="proj-item" data-id={p.id}>
                <span className="proj-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="proj-name">{p.name}</span>
                <span className="proj-cat">{p.category}</span>
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
