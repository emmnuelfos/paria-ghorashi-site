"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  isMobileDevice,
  prefersReducedMotion,
} from "@/lib/gsap";
import { COPY } from "@/data/site";

const PHRASE = COPY.revealPhrase;

/** Cinematic two-shot scrub: portrait A slow-zooms, crossfades into portrait B. */
const SHOTS = [
  "/assets/paria/hero-hand-hair.jpg",
  "/assets/paria/portrait-lipstick.jpg",
] as const;

/** Progress window where shot A hands over to shot B. */
const XFADE_START = 0.52;
const XFADE_END = 0.66;

/**
 * Scroll-scrubbed canvas reveal: the framed image scales in over the hero
 * scroll range (#scroll-wrap), Ken-Burns-zooms through two of Paria's
 * portraits with a crossfade, then darkens/blurs and slides away as
 * #section-after scrolls in. (Same trigger architecture as the studied
 * frame-sequence version — only the draw model changed.)
 */
export function RevealSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);

  const chars = useMemo(() => [...PHRASE], []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const phrase = phraseRef.current;
    if (!wrap || !canvas || !overlay || !phrase) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const mobile = isMobileDevice();
    const reduced = prefersReducedMotion();
    const slowHw = mobile || (navigator.hardwareConcurrency ?? 8) <= 4;
    const useBlur = !mobile && !reduced;
    const dpr = slowHw ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    const shots: Array<HTMLImageElement | undefined> = new Array(SHOTS.length);
    let lastDrawnP = -1;
    let lastDrawTime = 0;
    let currentP = 0;
    let destroyed = false;

    const sizeCanvas = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    sizeCanvas();

    /** Cover-fit draw of one shot with progress-driven zoom + vertical drift. */
    const drawShot = (
      img: HTMLImageElement,
      zoom: number,
      driftY: number,
      alpha: number,
    ) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih) * zoom;
      const dw = iw * scale;
      const dh = ih * scale;
      ctx2d.globalAlpha = alpha;
      ctx2d.drawImage(
        img,
        (cw - dw) / 2,
        (ch - dh) / 2 + driftY * ch,
        dw,
        dh,
      );
      ctx2d.globalAlpha = 1;
    };

    /**
     * p in [0,1] across the whole reveal:
     * shot A zooms 1.00→1.18 drifting up; across the crossfade window shot B
     * fades in at 1.06→1.22. `force` bypasses the same-progress/throttle check.
     */
    const drawAtProgress = (p: number, force = false) => {
      if (destroyed) return;
      const clamped = Math.min(1, Math.max(0, p));
      if (!force) {
        if (Math.abs(clamped - lastDrawnP) < 0.0015) return;
        if (slowHw) {
          const now = performance.now();
          if (now - lastDrawTime < 32) return;
          lastDrawTime = now;
        }
      }
      const a = shots[0];
      const b = shots[1];
      if (!a || a.naturalWidth <= 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      ctx2d.clearRect(0, 0, cw, ch);

      const xfade =
        b && b.naturalWidth > 0
          ? Math.min(
              1,
              Math.max(0, (clamped - XFADE_START) / (XFADE_END - XFADE_START)),
            )
          : 0;

      if (xfade < 1) {
        drawShot(a, 1 + clamped * 0.18, -clamped * 0.04, 1);
      }
      if (xfade > 0 && b) {
        drawShot(b, 1.06 + clamped * 0.16, (1 - clamped) * 0.03, xfade);
      }
      lastDrawnP = clamped;
      currentP = clamped;
    };

    const loadShot = (i: number) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          shots[i] = img;
          resolve(img.naturalWidth > 0);
        };
        img.onerror = () => resolve(false);
        img.src = SHOTS[i];
      });

    const startLoading = async () => {
      const ok = await loadShot(0);
      if (destroyed) return;
      if (ok) drawAtProgress(currentP, true);
      await loadShot(1);
      if (!destroyed) drawAtProgress(currentP, true);
    };
    void startLoading();

    const onResize = () => {
      sizeCanvas();
      drawAtProgress(currentP, true);
    };
    window.addEventListener("resize", onResize);

    const charEls = phrase.querySelectorAll<HTMLSpanElement>(".rp-char");
    const seqEls = wrap.querySelectorAll<HTMLElement>(".reveal-seq");

    const ctx = gsap.context(() => {
      gsap.set(
        charEls,
        useBlur ? { opacity: 0, filter: "blur(10px)" } : { opacity: 0 },
      );
    });

    let triggersCreated = false;
    let retryTimer: number | null = null;

    const createTriggers = () => {
      if (triggersCreated || destroyed) return;
      const scrollWrap = document.querySelector("#scroll-wrap");
      const sectionAfter = document.querySelector("#section-after");
      if (!scrollWrap || !sectionAfter) return;
      triggersCreated = true;
      if (retryTimer !== null) {
        window.clearInterval(retryTimer);
        retryTimer = null;
      }

      ctx.add(() => {
        // --- ScrollTrigger 1: entry (scale in + zoom scrub + phrase in) ---
        const entryTl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollWrap,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              if (p < 0.3) drawAtProgress(0);
              else drawAtProgress(((p - 0.3) / 0.7) * 0.82);
            },
          },
        });
        entryTl.fromTo(
          wrap,
          { opacity: 0 },
          { opacity: 1, duration: 0.01, ease: "none" },
          0.3,
        );
        entryTl.fromTo(
          seqEls,
          { scale: 0 },
          { scale: 1, duration: 0.7, ease: "none" },
          0.3,
        );
        entryTl.to(
          charEls,
          {
            opacity: 1,
            ...(useBlur ? { filter: "blur(0px)" } : {}),
            duration: 0.06,
            ease: "none",
            stagger: { each: 0.007, from: "start" },
          },
          0.62,
        );

        // --- ScrollTrigger 2: exit (slide up + darken + blur) ---
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionAfter,
            start: "top bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => {
              drawAtProgress(0.82 + self.progress * 0.18);
            },
            onLeave: () => drawAtProgress(1),
            onLeaveBack: () => drawAtProgress(0.82),
          },
        });
        exitTl.to(wrap, { y: "-50vh", ease: "none", duration: 1 }, 0);
        exitTl.fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 0.7, duration: 0.66 },
          0,
        );
        if (
          useBlur &&
          typeof CSS !== "undefined" &&
          CSS.supports("backdrop-filter", "blur(16px)")
        ) {
          gsap.set(overlay, { backdropFilter: "blur(0px)" });
          exitTl.to(overlay, { backdropFilter: "blur(16px)", duration: 1 }, 0);
        }

        // --- ScrollTrigger 3: phrase exit (chars fade from the end) ---
        gsap.to(charEls, {
          opacity: 0,
          duration: 0.2,
          ease: "none",
          immediateRender: false,
          stagger: { each: 0.01, from: "end" },
          scrollTrigger: {
            trigger: sectionAfter,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    };

    createTriggers();
    if (!triggersCreated) {
      retryTimer = window.setInterval(createTriggers, 200);
    }

    const onIntroDone = () => {
      createTriggers();
      ScrollTrigger.refresh();
    };
    window.addEventListener("intro:done", onIntroDone, { once: true });

    return () => {
      destroyed = true;
      if (retryTimer !== null) window.clearInterval(retryTimer);
      window.removeEventListener("intro:done", onIntroDone);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div className="reveal-image-wrap" id="reveal-image-wrap" ref={wrapRef}>
      <canvas
        className="reveal-image reveal-seq"
        id="reveal-canvas"
        ref={canvasRef}
      />
      <div className="reveal-frame reveal-seq">
        <span className="reveal-corner tl" />
        <span className="reveal-corner tr" />
        <span className="reveal-corner bl" />
        <span className="reveal-corner br" />
      </div>
      <div className="reveal-overlay" id="reveal-overlay" ref={overlayRef} />
      <p className="reveal-phrase" id="reveal-phrase" ref={phraseRef}>
        {chars.map((ch, i) => (
          <span
            key={i}
            className="rp-char"
            style={{ display: "inline-block" }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>
    </div>
  );
}
