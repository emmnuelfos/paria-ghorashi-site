"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AWARDS } from "@/data/site";

const cursorImgStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 250,
  height: "auto",
  borderRadius: 5,
  pointerEvents: "none",
  zIndex: 99999,
};

/**
 * Awards section: scroll-activated white-wipe rows (toggleClass per row)
 * + a cursor-following preview image while a row is hovered.
 */
export function Awards() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    let hovered = false;

    const ctx = gsap.context(() => {
      gsap.set(img, { xPercent: -50, yPercent: -50, scale: 0.8, opacity: 0 });

      // Scroll-driven white wipe: each row toggles .active-award while it
      // sits in the middle band of the viewport.
      const items = gsap.utils.toArray<HTMLElement>(".award-item", section);
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top center+=15%",
          end: "bottom center-=15%",
          toggleClass: { targets: item, className: "active-award" },
        });
      });
    }, section);

    const onMouseMove = (event: globalThis.MouseEvent) => {
      if (!hovered) return;
      gsap.set(img, { x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", onMouseMove);

    const rowListeners: Array<{
      el: HTMLElement;
      enter: (event: globalThis.MouseEvent) => void;
      leave: () => void;
    }> = [];

    section.querySelectorAll<HTMLElement>(".award-item").forEach((item) => {
      const enter = (event: globalThis.MouseEvent) => {
        hovered = true;
        const src = item.getAttribute("data-cursor-img");
        if (src && img.getAttribute("src") !== src) {
          img.setAttribute("src", src);
        }
        gsap.set(img, { x: event.clientX, y: event.clientY });
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          overwrite: "auto",
        });
      };
      const leave = () => {
        hovered = false;
        gsap.to(img, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          overwrite: "auto",
        });
      };
      item.addEventListener("mouseenter", enter);
      item.addEventListener("mouseleave", leave);
      rowListeners.push({ el: item, enter, leave });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      rowListeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      ctx.revert();
    };
  }, []);

  return (
    <section className="awards" id="awards" ref={sectionRef}>
      <div className="awards-inner">
        <div className="skills-subtitle awards-title">Awards &amp; Misc</div>
        <div className="awards-list" id="awards-list">
          {AWARDS.map((a) => (
            <div
              key={`${a.org}-${a.prize}`}
              className="award-item"
              data-cursor-img={a.cursorImg}
            >
              <div className="award-org">{a.org}</div>
              <div className="award-site">{a.site}</div>
              <div className="award-prize">{a.prize}</div>
              <div className="award-date">{a.date}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Cursor-following preview image (hidden until a row is hovered). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} alt="" aria-hidden="true" style={cursorImgStyle} />
    </section>
  );
}
