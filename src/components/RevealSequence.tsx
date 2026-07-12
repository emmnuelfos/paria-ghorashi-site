"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  isMobileDevice,
  prefersReducedMotion,
} from "@/lib/gsap";
import { COPY } from "@/data/site";

const FRAME_COUNT = 217;
const PHRASE = COPY.revealPhrase;

/** Optimized WebP frame sequence exported from Paria's cinematic reveal clip. */
const frameUrl = (i: number) =>
  `/assets/paria/reveal/${String(i).padStart(4, "0")}.webp`;

/**
 * Scroll-scrubbed reveal: a cinematic frame sequence (golden night → the
 * convertible emerging → Paria's black-and-white portrait) that scales into a
 * framed window over the hero scroll range (#scroll-wrap), scrubs through the
 * sequence, then darkens/blurs and slides away as #section-after scrolls in.
 * Frames are pre-decoded and drawn to canvas per scroll position for smooth
 * scrubbing; adaptive loading (frame 1 first, then a speed-probed stride).
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

    const frames: Array<HTMLImageElement | undefined> = new Array(
      FRAME_COUNT + 1,
    );
    const loadedFrameIdx: number[] = [];
    let lastDrawnIdx = -1;
    let lastDrawTime = 0;
    let currentIdx = 1;
    let destroyed = false;

    /** Keep loadedFrameIdx sorted (binary-search insert). */
    const insertLoaded = (i: number) => {
      let lo = 0;
      let hi = loadedFrameIdx.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (loadedFrameIdx[mid] < i) lo = mid + 1;
        else hi = mid;
      }
      loadedFrameIdx.splice(lo, 0, i);
    };

    const sizeCanvas = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };
    sizeCanvas();

    /** Cover-fit centered draw; `force` bypasses same-frame + throttle checks. */
    const drawFrame = (i: number, force = false) => {
      if (destroyed) return;
      const img = frames[i];
      if (!img || img.naturalWidth <= 0) return;
      if (!force) {
        if (i === lastDrawnIdx) return;
        if (slowHw) {
          const now = performance.now();
          if (now - lastDrawTime < 32) return;
          lastDrawTime = now;
        }
      }
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx2d.clearRect(0, 0, cw, ch);
      ctx2d.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawnIdx = i;
      currentIdx = i;
    };

    const drawFrameAtProgress = (p: number) => {
      const count = loadedFrameIdx.length;
      if (count === 0) return;
      const clamped = Math.min(1, Math.max(0, p));
      const idx = loadedFrameIdx[Math.round(clamped * (count - 1))];
      drawFrame(idx);
    };

    const loadImage = (i: number) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          frames[i] = img;
          const ok = img.naturalWidth > 0;
          if (ok) insertLoaded(i);
          resolve(ok);
        };
        img.onerror = () => resolve(false);
        img.src = frameUrl(i);
      });

    const failed: number[] = [];

    const startLoading = async () => {
      // Frame 1 first: draw as soon as it lands.
      const ok1 = await loadImage(1);
      if (destroyed) return;
      if (ok1) drawFrame(1, true);
      else failed.push(1);

      // Frames 2–11 in parallel; time the batch to gauge connection speed.
      const t0 = performance.now();
      const probe: number[] = [];
      for (let i = 2; i <= 11; i++) probe.push(i);
      const probeResults = await Promise.all(probe.map(loadImage));
      if (destroyed) return;
      probeResults.forEach((ok, j) => {
        if (!ok) failed.push(probe[j]);
      });
      const elapsed = performance.now() - t0;

      let skip = 1;
      if (elapsed > 4000) skip = 3;
      else if (elapsed > 2000) skip = 2;
      if (isMobileDevice()) skip = Math.max(skip, 2);

      // Remaining frames from 12, honoring the skip stride.
      const targets: number[] = [];
      for (let i = 12; i <= FRAME_COUNT; i++) {
        if (skip <= 1 || i % skip === 0) targets.push(i);
      }

      const concurrency = slowHw ? 2 : 6;
      let cursor = 0;
      const worker = async () => {
        while (cursor < targets.length && !destroyed) {
          const i = targets[cursor];
          cursor += 1;
          const ok = await loadImage(i);
          if (!ok) failed.push(i);
        }
      };
      await Promise.all(Array.from({ length: concurrency }, worker));
      if (destroyed) return;

      // Retry each failed frame once more at the end.
      const retries = failed.splice(0, failed.length);
      for (const i of retries) {
        if (destroyed) return;
        await loadImage(i);
      }
    };
    void startLoading();

    const onResize = () => {
      sizeCanvas();
      lastDrawnIdx = -1;
      drawFrame(currentIdx, true);
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
        // --- ScrollTrigger 1: entry (scale in + sequence scrub + phrase in) ---
        const entryTl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollWrap,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              if (p < 0.3) drawFrameAtProgress(0);
              else drawFrameAtProgress(((p - 0.3) / 0.7) * 0.82);
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
              drawFrameAtProgress(0.82 + self.progress * 0.18);
            },
            onLeave: () => drawFrameAtProgress(1),
            onLeaveBack: () => drawFrameAtProgress(0.82),
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
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>
    </div>
  );
}
