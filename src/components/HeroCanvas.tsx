"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

interface HeroBlob {
  baseX: number;
  baseY: number;
  /** Radius as a fraction of the canvas width (0.25–0.45). */
  radius: number;
  periodX: number;
  periodY: number;
  phaseX: number;
  phaseY: number;
  ampX: number;
  ampY: number;
  rgb: readonly [number, number, number];
  coreAlpha: number;
}

/** Red core #ff1e00 (one deeper #7a0f00), drifting on distinct slow sin/cos paths. */
const BLOBS: readonly HeroBlob[] = [
  { baseX: 0.6, baseY: 0.18, radius: 0.42, periodX: 16, periodY: 12, phaseX: 0.0, phaseY: 1.7, ampX: 0.06, ampY: 0.05, rgb: [255, 30, 0], coreAlpha: 0.9 },
  { baseX: 0.82, baseY: 0.42, radius: 0.32, periodX: 10, periodY: 14, phaseX: 2.1, phaseY: 4.2, ampX: 0.05, ampY: 0.08, rgb: [255, 30, 0], coreAlpha: 0.75 },
  { baseX: 0.38, baseY: 0.06, radius: 0.26, periodX: 20, periodY: 9, phaseX: 3.9, phaseY: 0.6, ampX: 0.07, ampY: 0.04, rgb: [255, 30, 0], coreAlpha: 0.55 },
  { baseX: 0.68, baseY: 0.78, radius: 0.36, periodX: 13, periodY: 18, phaseX: 5.2, phaseY: 2.9, ampX: 0.08, ampY: 0.06, rgb: [122, 15, 0], coreAlpha: 0.85 },
];

const FRAME_MS = 1000 / 30;

/**
 * 2D-canvas approximation of the original WebGL hero blob: additive radial
 * gradients rendered at 0.5 scale offscreen, upscaled + blurred onto the main
 * canvas. Mouse parallax, 30fps cap, paused offscreen, static frame when
 * reduced motion is preferred. Starts autonomously on mount.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const main = canvas.getContext("2d");
    if (!main) return;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d");
    if (!octx) return;

    const reduced = prefersReducedMotion();
    const supportsFilter = typeof main.filter === "string";
    let w = 1;
    let h = 1;
    let raf = 0;
    let running = false;
    let last = 0;
    let lastT = 0;
    // Mouse parallax: blob centers shift by (mouse - center) * 0.03, lerped.
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = Math.max(1, Math.round(rect?.width || window.innerWidth));
      h = Math.max(1, Math.round(rect?.height || window.innerHeight));
      canvas.width = w;
      canvas.height = h;
      off.width = Math.max(1, Math.round(w * 0.5));
      off.height = Math.max(1, Math.round(h * 0.5));
    };

    const draw = (t: number) => {
      lastT = t;
      const sf = off.width / w;
      octx.globalCompositeOperation = "source-over";
      octx.fillStyle = "#0a0a0a";
      octx.fillRect(0, 0, off.width, off.height);
      octx.globalCompositeOperation = "lighter";
      for (const b of BLOBS) {
        const cx =
          (b.baseX * w +
            Math.sin((t / b.periodX) * Math.PI * 2 + b.phaseX) * b.ampX * w +
            px) *
          sf;
        const cy =
          (b.baseY * h +
            Math.cos((t / b.periodY) * Math.PI * 2 + b.phaseY) * b.ampY * h +
            py) *
          sf;
        const r = Math.max(1, b.radius * w * sf);
        const [cr, cg, cb] = b.rgb;
        const grad = octx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${b.coreAlpha})`);
        grad.addColorStop(0.45, `rgba(${cr},${cg},${cb},${b.coreAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        octx.fillStyle = grad;
        octx.beginPath();
        octx.arc(cx, cy, r, 0, Math.PI * 2);
        octx.fill();
      }
      // Upscale the small render for cheap blur, plus ctx.filter when supported.
      main.fillStyle = "#0a0a0a";
      main.fillRect(0, 0, w, h);
      if (supportsFilter) main.filter = "blur(40px)";
      main.drawImage(off, 0, 0, w, h);
      if (supportsFilter) main.filter = "none";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      draw(now / 1000);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMouseMove = (e: MouseEvent) => {
      tx = (e.clientX - w / 2) * 0.03;
      ty = (e.clientY - h / 2) * 0.03;
    };

    const onResize = () => {
      resize();
      draw(lastT);
    };

    resize();
    draw(0);
    window.addEventListener("resize", onResize);

    let io: IntersectionObserver | null = null;
    if (!reduced) {
      window.addEventListener("mousemove", onMouseMove);
      // Pause when the hero leaves the viewport.
      io = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      });
      io.observe(canvas);
    }

    return () => {
      stop();
      io?.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
