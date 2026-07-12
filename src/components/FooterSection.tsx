"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CharRoll } from "@/components/CharRoll";
import { SOCIALS } from "@/data/site";
import type { SocialLink } from "@/types";

const ASCII_COLS = 80;

/** Character pools, brightness ascending (index 0 = darkest = space). */
const POOLS = [
  " ",
  "·.,",
  ":;`-~^",
  "=+<>?!:;",
  "|/\\()[]{}«»",
  "÷×±≈≠≤≥∞∑∏√∫",
  "¤†‡§¶©®™°¬",
  "%&#$@¥€£¢",
];

interface AsciiData {
  text: string;
  chars: string[][];
  poolGrid: number[][];
  rows: number;
  cols: number;
}

function escapeChar(ch: string): string {
  if (ch === "&") return "&amp;";
  if (ch === "<") return "&lt;";
  if (ch === ">") return "&gt;";
  return ch;
}

/** Rasterize an image onto a cols × rows canvas and map pixels to pool chars (seeded LCG, seed=42). */
function imageToAscii(img: HTMLImageElement, cols: number): AsciiData | null {
  const rows = Math.round(cols * (img.height / img.width));
  if (!rows || !Number.isFinite(rows)) return null;
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, cols, rows);
  const data = ctx.getImageData(0, 0, cols, rows).data;

  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const chars: string[][] = [];
  const poolGrid: number[][] = [];
  for (let y = 0; y < rows; y++) {
    const rowChars: string[] = [];
    const rowPools: number[] = [];
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 15) {
        rowChars.push(" ");
        rowPools.push(-1);
      } else {
        const brightness = ((0.299 * r + 0.587 * g + 0.114 * b) / 255) * (a / 255);
        const pi = Math.min(Math.floor(brightness * 7 * 0.8), 7);
        const pool = POOLS[pi];
        rowChars.push(pool[Math.floor(rand() * pool.length)]);
        rowPools.push(pi);
      }
    }
    chars.push(rowChars);
    poolGrid.push(rowPools);
  }

  return {
    text: chars.map((row) => row.join("")).join("\n"),
    chars,
    poolGrid,
    rows,
    cols,
  };
}

/** Deterministic per-cell noise in [-2.5, 2.5]. */
function cellNoise(x: number, y: number): number {
  const n = ((((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) + 1) % 1);
  return n * 5 - 2.5;
}

/** Rebuild an element's text into masked per-char spans; returns the inner (animated) spans. */
function buildMaskedChars(el: HTMLElement, keepFirstLetter: boolean): HTMLElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const inners: HTMLElement[] = [];
  [...text].forEach((ch, i) => {
    const outer = document.createElement("span");
    outer.style.display = "inline-block";
    outer.style.overflow = "hidden";
    outer.style.padding = "0.1em 0.3em";
    outer.style.margin = "-0.1em -0.3em";
    if (keepFirstLetter && i === 0) outer.classList.add("first-letter");
    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    inners.push(inner);
  });
  return inners;
}

const SOCIAL_ORDER = ["GitHub", "LinkedIn", "Behance"];

export function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const leftWrap = footer.querySelector<HTMLElement>(".footer-ascii.left");
    const rightWrap = footer.querySelector<HTMLElement>(".footer-ascii.right");
    const leftPre = footer.querySelector<HTMLPreElement>("#ascii-left");
    const rightPre = footer.querySelector<HTMLPreElement>("#ascii-right");
    if (!leftWrap || !rightWrap || !leftPre || !rightPre) return;

    const cleanups: Array<() => void> = [];
    let disposed = false;

    /* ---------- ASCII art + hover scramble ---------- */

    const setupPre = (pre: HTMLPreElement, ascii: AsciiData) => {
      pre.textContent = ascii.text;

      const { cols, rows, chars, poolGrid } = ascii;
      const total = cols * rows;
      const hitTimes = new Float64Array(total); // 0 = never hit
      const noises = new Float64Array(total);
      const durations = new Float64Array(total);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const noise = cellNoise(x, y);
          noises[idx] = noise;
          durations[idx] = noise > 0.5 ? 200 : 100;
        }
      }

      let mouseCellX = -9999;
      let mouseCellY = -9999;
      let raf: number | null = null;

      const render = () => {
        raf = null;
        const now = performance.now();
        let anyActive = false;
        let html = "";
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx = y * cols + x;
            const pi = poolGrid[y][x];
            const hit = hitTimes[idx];
            if (hit > 0 && now - hit < durations[idx] && pi > 0) {
              anyActive = true;
              const pool = POOLS[7 - pi];
              const ch = pool[Math.floor(Math.random() * pool.length)];
              html += `<span style="color:#000000;background:#C1A375">${escapeChar(ch)}</span>`;
            } else {
              html += escapeChar(chars[y][x]);
            }
          }
          if (y < rows - 1) html += "\n";
        }
        if (anyActive) {
          pre.innerHTML = html;
          raf = requestAnimationFrame(render);
        } else {
          pre.textContent = ascii.text;
        }
      };

      const kick = () => {
        if (raf === null) raf = requestAnimationFrame(render);
      };

      const onMouseMove = (e: MouseEvent) => {
        const rect = pre.getBoundingClientRect();
        const charW = rect.width / cols;
        const charH = rect.height / rows;
        if (!charW || !charH) return;
        mouseCellX = (e.clientX - rect.left) / charW;
        mouseCellY = (e.clientY - rect.top) / charH;
        const now = performance.now();
        let hitAny = false;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx = y * cols + x;
            const dx = x - mouseCellX;
            const dy = y - mouseCellY;
            const radius = 2.5 + noises[idx];
            if (dx * dx + dy * dy < radius * radius) {
              hitTimes[idx] = now;
              hitAny = true;
            }
          }
        }
        if (hitAny) kick();
      };

      const onMouseLeave = () => {
        mouseCellX = -9999;
        mouseCellY = -9999;
      };

      pre.addEventListener("mousemove", onMouseMove);
      pre.addEventListener("mouseleave", onMouseLeave);
      cleanups.push(() => {
        pre.removeEventListener("mousemove", onMouseMove);
        pre.removeEventListener("mouseleave", onMouseLeave);
        if (raf !== null) cancelAnimationFrame(raf);
      });
    };

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([
      loadImage("/assets/paria/ascii-left.png"),
      loadImage("/assets/paria/ascii-right.png"),
    ])
      .then(([leftImg, rightImg]) => {
        if (disposed) return;
        const leftAscii = imageToAscii(leftImg, ASCII_COLS);
        const rightAscii = imageToAscii(rightImg, ASCII_COLS);
        if (leftAscii) setupPre(leftPre, leftAscii);
        if (rightAscii) setupPre(rightPre, rightAscii);
      })
      .catch(() => {
        /* footer ascii art unavailable — leave pres empty */
      });

    /* ---------- Mouse parallax loop (while footer visible) ---------- */

    let mx = 0;
    let my = 0;
    let sx = 0;
    let sy = 0;
    let parallaxRaf: number | null = null;

    const onWindowMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onWindowMouseMove);
    cleanups.push(() => window.removeEventListener("mousemove", onWindowMouseMove));

    const parallaxTick = () => {
      sx += (mx - sx) * 0.05;
      sy += (my - sy) * 0.05;
      leftPre.style.transform = `translate(${Math.min(0, sx * -15 - 15)}px, ${sy * -10}px)`;
      rightPre.style.transform = `translate(${Math.max(0, sx * 15 + 15)}px, ${sy * -10}px)`;
      parallaxRaf = requestAnimationFrame(parallaxTick);
    };
    const startParallax = () => {
      if (parallaxRaf === null) parallaxRaf = requestAnimationFrame(parallaxTick);
    };
    const stopParallax = () => {
      if (parallaxRaf !== null) {
        cancelAnimationFrame(parallaxRaf);
        parallaxRaf = null;
      }
    };
    cleanups.push(stopParallax);

    /* ---------- Scroll behaviors ---------- */

    const ctx = gsap.context(() => {
      // 1. Ascii panes slide in from the sides.
      gsap.fromTo(
        leftWrap,
        { xPercent: -100 },
        {
          xPercent: 0,
          scrollTrigger: {
            trigger: "#footer-transition",
            start: "top bottom+=500",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        rightWrap,
        { xPercent: 100 },
        {
          xPercent: 0,
          scrollTrigger: {
            trigger: "#footer-transition",
            start: "top bottom+=500",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      // 2. Footer-top links wipe up from a bottom clip.
      const chTops = footer.querySelectorAll<HTMLElement>(".footer-top .ch-top");
      if (chTops.length) {
        gsap.set(chTops, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(chTops, {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.out",
          stagger: { each: 0.015, from: "start" },
          scrollTrigger: {
            trigger: "#footer-transition",
            start: "center bottom+=500",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }

      // 3. Giant name rises char-by-char from masked spans.
      const lukeEl = footer.querySelector<HTMLElement>(".footer-name-luke");
      const baffaitEl = footer.querySelector<HTMLElement>(".footer-name-baffait");
      const dotEl = footer.querySelector<HTMLElement>(".footer-name-dot");
      if (lukeEl && baffaitEl && dotEl) {
        const lukeChars = buildMaskedChars(lukeEl, true);
        const baffaitChars = buildMaskedChars(baffaitEl, false);
        const dotChars = buildMaskedChars(dotEl, false);
        const lukeRev = [...lukeChars].reverse();
        const rightSide = [...baffaitChars, ...dotChars];
        const ordered: HTMLElement[] = [];
        const max = Math.max(lukeRev.length, rightSide.length);
        for (let i = 0; i < max; i++) {
          const r = rightSide[i];
          if (r) ordered.push(r);
          const l = lukeRev[i];
          if (l) ordered.push(l);
        }
        gsap.set(ordered, { yPercent: 110 });
        gsap.to(ordered, {
          yPercent: 0,
          ease: "power3.out",
          stagger: { each: 0.04, from: "start" },
          scrollTrigger: {
            trigger: "#footer-transition",
            start: "center bottom+=500",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }

      // 4. Footer visibility + parallax loop lifecycle.
      ScrollTrigger.create({
        trigger: "#footer-transition",
        start: "top bottom+=500",
        end: "bottom bottom",
        onEnter: () => {
          footer.style.visibility = "visible";
          startParallax();
        },
        onEnterBack: () => {
          footer.style.visibility = "visible";
          startParallax();
        },
        onLeaveBack: () => {
          footer.style.visibility = "hidden";
          stopParallax();
        },
      });

      // 6. Contact exit handoff (targets belong to ContactSection — guard nulls).
      const contactBg = document.querySelector<HTMLElement>("#contact-bg");
      const contactEl = document.querySelector<HTMLElement>("#contact");
      const blobWrap = document.querySelector<HTMLElement>("#contact-blob-wrap");
      const contactPin = document.querySelector<HTMLElement>("#contact-pin");
      const clipTargets = ["#contact-socials", "#contact-mail"]
        .map((sel) => document.querySelector<HTMLElement>(sel))
        .filter((el): el is HTMLElement => el !== null);
      const contactTitle = document.querySelector<HTMLElement>("#contact-title");

      if (contactBg || contactEl || blobWrap || contactPin || clipTargets.length || contactTitle) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#footer-transition",
            start: "top bottom+=550",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              if (self.progress > 0.2) {
                if (contactBg) contactBg.style.display = "none";
                if (contactEl) contactEl.style.pointerEvents = "none";
              } else {
                if (contactBg) contactBg.style.display = "block";
                if (contactEl) contactEl.style.pointerEvents = "";
              }
            },
          },
        });
        if (blobWrap) {
          tl.set(
            blobWrap,
            { height: "110vh", overflow: "hidden", borderRadius: "0 0 0px 0px" },
            0,
          );
          tl.to(
            blobWrap,
            { borderRadius: "0 0 50px 50px", duration: 0.15, ease: "power2.out" },
            0,
          );
          tl.to(
            blobWrap,
            {
              y: () => -(window.innerHeight * 1.8 + 400),
              immediateRender: false,
              duration: 1.0,
              ease: "none",
            },
            0,
          );
        }
        if (contactPin) {
          tl.to(
            contactPin,
            { y: "-40vh", pointerEvents: "none", immediateRender: false, duration: 1.0, ease: "none" },
            0,
          );
        }
        if (clipTargets.length) {
          tl.fromTo(
            clipTargets,
            { clipPath: "inset(0 0 0% 0)" },
            { clipPath: "inset(0 0 100% 0)", duration: 0.1, ease: "none" },
            0,
          );
        }
        if (contactTitle) {
          tl.fromTo(
            contactTitle,
            { clipPath: "inset(0 0 0% 0)" },
            { clipPath: "inset(0 0 100% 0)", duration: 0.25, ease: "power2.in" },
            0,
          );
        }
      }
    });

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  const socials = SOCIAL_ORDER.map((label) =>
    SOCIALS.find((s) => s.label === label),
  ).filter((s): s is SocialLink => Boolean(s));

  return (
    <>
      <div className="footer-transition" id="footer-transition"></div>
      <footer className="footer" id="footer" ref={footerRef}>
        <div className="footer-content" id="footer-content">
          <div className="footer-top">
            <div className="footer-top-col">
              <CharRoll
                spaceGaps
                className="footer-mail"
                text="paria@pgpm.ae"
                href="mailto:paria@pgpm.ae"
              />
              <CharRoll spaceGaps className="footer-date" text="© 2026" />
            </div>
            <nav className="footer-top-col" aria-label="Social links">
              {socials.map((s) => (
                <CharRoll
                  key={s.label}
                  spaceGaps
                  external
                  text={s.label}
                  href={s.href}
                />
              ))}
            </nav>
            <nav className="footer-top-col" aria-label="Footer navigation">
              <CharRoll spaceGaps text="Ventures" href="#projects" />
              <CharRoll spaceGaps text="Story" href="#about" />
              <CharRoll spaceGaps text="Contact" href="#contact" />
            </nav>
          </div>
          <div className="footer-ascii-wrap">
            <div className="footer-ascii left">
              <pre id="ascii-left"></pre>
            </div>
            <div className="footer-ascii right">
              <pre id="ascii-right"></pre>
            </div>
          </div>
          <a
            className="monogram footer-monogram"
            href="#hero"
            aria-label="Paria Ghorashi — top"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="brand-logo"
              src="/assets/paria/paria-logo.svg"
              alt="Paria Ghorashi"
              width={791}
              height={537}
            />
          </a>
          <div className="footer-name">
            <span className="footer-name-luke">
              <span className="first-letter">P</span>aria
            </span>
            <span className="footer-name-baffait-wrap">
              <span className="footer-name-baffait">Ghorashi</span>
              <span className="footer-name-dot">.</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
