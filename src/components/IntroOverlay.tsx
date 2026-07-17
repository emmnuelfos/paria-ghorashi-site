"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import {
  gsap,
  isMobileDevice,
  isMobileViewport,
  prefersReducedMotion,
} from "@/lib/gsap";
import { useLenis } from "@/components/LenisProvider";
import { splitIntoChars } from "@/lib/text";

/**
 * Time-driven intro (runs once): masked char rise of "Paria Ghorashi.",
 * scale-to-bottom settle, dark/red panel sweep revealing the hero, then
 * hero-content + letter-roll reveals. Locks scrolling until done and
 * dispatches `intro:done` on window when finished.
 */
export function IntroOverlay() {
  const bgRef = useRef<HTMLDivElement>(null);
  const nameLayerRef = useRef<HTMLDivElement>(null);
  const pContentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lukeRef = useRef<HTMLSpanElement>(null);
  const baffaitRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();
  const lenisRef = useRef<Lenis | null>(null);
  const doneRef = useRef(false);

  // Stop Lenis as soon as it arrives (it is created async) while intro plays.
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && !doneRef.current) lenis.stop();
  }, [lenis]);

  useEffect(() => {
    const bg = bgRef.current;
    const nameLayer = nameLayerRef.current;
    const pContent = pContentRef.current;
    const logo = logoRef.current;
    const luke = lukeRef.current;
    const baffait = baffaitRef.current;
    const dot = dotRef.current;
    const panel = panelRef.current;
    const dark = darkRef.current;
    const red = redRef.current;
    if (
      !bg ||
      !nameLayer ||
      !pContent ||
      !logo ||
      !luke ||
      !baffait ||
      !dot ||
      !panel ||
      !dark ||
      !red
    ) {
      return;
    }

    const nameParts = [logo, luke, baffait, dot];
    const reduced = prefersReducedMotion();
    const scaleInfo = { scale: 1, deltaY: 0 };
    let settled = false;
    let reanchorStopped = false;

    // --- Scroll locking during intro ---------------------------------------
    window.scrollTo(0, 0);
    const lockScroll = () => {
      if (!doneRef.current) window.scrollTo(0, 0);
    };
    window.addEventListener("scroll", lockScroll);
    if (!isMobileDevice()) {
      document.documentElement.style.overflow = "hidden";
    }

    // --- Layout helpers ------------------------------------------------------
    /** Position "uke" / " Baffait" / "." relative to the flex-laid "L" and center the whole composition. */
    const layoutNames = () => {
      const fs = parseFloat(getComputedStyle(baffait).fontSize);
      const baffaitLeft = luke.offsetLeft + luke.offsetWidth + fs * 0.55;
      baffait.style.left = `${baffaitLeft / fs}em`;
      baffait.style.top = "-0.06em";
      dot.style.left = `${(baffaitLeft + baffait.offsetWidth) / fs}em`;
      dot.style.top = "-0.06em";
      const totalWidth =
        logo.offsetWidth +
        luke.offsetWidth +
        fs * 0.55 +
        baffait.offsetWidth +
        dot.offsetWidth;
      gsap.set(pContent, { x: -(totalWidth / 2 - logo.offsetWidth / 2) });
    };

    /** Compute scale + deltaY for the scale-to-bottom step (runs right before the tween). */
    const computeScaleStep = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = isMobileViewport();
      const fs = parseFloat(getComputedStyle(baffait).fontSize);
      const totalWidth =
        logo.offsetWidth +
        luke.offsetWidth +
        fs * 0.55 +
        baffait.offsetWidth +
        dot.offsetWidth;
      const pad = mobile ? 20 : 48;
      scaleInfo.scale = (vw - pad * 2) / totalWidth;
      const contentH = pContent.offsetHeight;
      pContent.style.transformOrigin = `${totalWidth / 2}px ${contentH / 2}px`;
      const rect = pContent.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const bottomPad = mobile ? Math.max(vh * 0.18, 110) : 80;
      scaleInfo.deltaY =
        vh - bottomPad - (contentH * scaleInfo.scale) / 2 - centerY;
    };

    /**
     * Lockup geometry: offset/scale that parks #hero-brand centred just above
     * the name for the intro. Docking later animates x/y/scale back to 0/0/1 —
     * its natural top-right resting spot — so there is no layout thrash.
     */
    const logoLock = { x: 0, y: 0, scale: 4 };
    const computeLogoLockup = () => {
      const el = document.getElementById("hero-brand");
      if (!el) return;
      gsap.set(el, { x: 0, y: 0, scale: 1 });
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = isMobileViewport();
      const targetW = Math.min(vw * (mobile ? 0.5 : 0.22), mobile ? 200 : 300);
      logoLock.scale = targetW / r.width;
      const h = r.height * logoLock.scale;
      const gap = mobile ? 22 : 40;
      const nameTop = pContent.getBoundingClientRect().top;
      // Sit above the name, but never crowd the top edge.
      const centerY = Math.max(h / 2 + vh * 0.06, nameTop - gap - h / 2);
      logoLock.x = vw / 2 - (r.left + r.width / 2);
      logoLock.y = centerY - (r.top + r.height / 2);
    };

    /** Re-anchor the settled (scale:1, vw-sized) name at the bottom of the viewport. */
    const anchorToBottom = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = isMobileViewport();
      const fs = parseFloat(getComputedStyle(baffait).fontSize);
      const totalWidth =
        logo.offsetWidth +
        luke.offsetWidth +
        fs * 0.55 +
        baffait.offsetWidth +
        dot.offsetWidth;
      const contentH = pContent.offsetHeight;
      const bottomPad = mobile ? Math.max(vh * 0.18, 110) : 80;
      const targetBottom = vh - bottomPad;
      const xVw = -(((totalWidth / 2 - logo.offsetWidth / 2) / vw) * 100);
      gsap.set(pContent, {
        x: `${xVw}vw`,
        y: targetBottom - contentH / 2 - vh / 2,
      });
    };

    /** Swap the scaled transform for real vw font sizes and pin the name to the bottom. */
    const finalizeAtBottom = () => {
      const vw = window.innerWidth;
      pContent.style.visibility = "hidden";
      gsap.set(pContent, { scale: 1, x: 0, y: 0 });
      nameLayer.style.mixBlendMode = "normal"; // ivory stays on-palette over the gold blob
      nameParts.forEach((el) => {
        const base = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${((base * scaleInfo.scale) / vw) * 100}vw`;
      });
      // Force reflow so offsetWidths reflect the new font sizes.
      void pContent.offsetWidth;
      anchorToBottom();
      pContent.style.visibility = "";
      settled = true;
    };

    // Keep re-anchoring on window resize until scroll begins (Hero dispatches
    // `hero:scroll-start` once its scrubbed timeline first moves).
    const onResize = () => {
      if (settled && !reanchorStopped) anchorToBottom();
    };
    const onScrollStart = () => {
      reanchorStopped = true;
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("hero:scroll-start", onScrollStart);

    const ctx = gsap.context(() => {
      // 1) Split chars + initial states.
      const chars = [
        ...splitIntoChars(logo),
        ...splitIntoChars(luke),
        ...splitIntoChars(baffait),
      ];
      gsap.set(chars, { yPercent: 110 });
      gsap.set([logo, luke, baffait], { opacity: 1 });
      gsap.set(dot, { opacity: 0 });

      // 2) Initial composition layout.
      layoutNames();

      // 8) Paused letter-roll reveal for every .ch-top on the page,
      //    played near the end of the master timeline.
      const chTl = gsap.timeline({ paused: true });
      const rolls = Array.from(
        document.querySelectorAll<HTMLElement>(".chr-hover")
      );
      rolls.forEach((roll, elIdx) => {
        const tops = Array.from(
          roll.querySelectorAll<HTMLElement>(".ch-top")
        );
        tops.forEach((top, charIdx) => {
          chTl.fromTo(
            top,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0 0 0 0)",
              duration: 0.7,
              ease: "power3.out",
              immediateRender: true,
            },
            elIdx * 0.08 + charIdx * 0.03
          );
        });
      });

      const master = gsap.timeline({ delay: 0.2 });
      // Harmless QA hook (mirrors window.__lenis) so headless checks can slow
      // or seek the intro instead of racing it in real time.
      (window as unknown as { __introTL?: gsap.core.Timeline }).__introTL =
        master;

      // 2b) Brand lockup — the mark leads on black, the name answers beneath.
      master.call(() => computeLogoLockup(), undefined, 0);
      master.set(
        "#hero-brand",
        {
          x: () => logoLock.x,
          y: () => logoLock.y,
          scale: () => logoLock.scale,
          opacity: 1,
        },
        0
      );
      // Monogram settles out of a blur.
      master.fromTo(
        "#brand-mark-img",
        { opacity: 0, scale: 1.08, filter: "blur(16px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "power3.out",
        },
        0
      );
      // Warm bloom breathes in behind it.
      master.fromTo(
        "#brand-glow",
        { opacity: 0, scale: 0.65 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        0.05
      );
      // Wordmark rises out of its own mask — same language as the name's chars.
      master.fromTo(
        "#brand-word-img",
        { yPercent: 24, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.45
      );
      // Sheen crosses the metal.
      master.fromTo(
        "#brand-sheen",
        { opacity: 0, backgroundPosition: "210% 0" },
        {
          opacity: 1,
          backgroundPosition: "-90% 0",
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.55
      );
      master.to("#brand-sheen", { opacity: 0, duration: 0.35 }, 1.6);

      // 3) Chars rise from the mask — the name answers the mark.
      master.to(
        chars,
        {
          yPercent: 0,
          duration: 0.4,
          ease: "power3.out",
          stagger: { each: 0.025, from: "center" },
        },
        0.8
      );
      master.call(() => layoutNames());
      master.to(dot, { opacity: 1, duration: 0.25, ease: "power2.out" });
      // Hold the lockup — the brand moment.
      master.to({}, { duration: 0.45 });

      // 4) HeroCanvas starts autonomously on mount — kept as a timeline beat.
      master.add(() => {
        /* HeroCanvas already running */
      });
      master.to({}, { duration: 0.3 });

      // 5) Scale-to-bottom.
      master.call(() => computeScaleStep());
      master.addLabel("nameDrop");
      master.to(pContent, {
        scale: () => scaleInfo.scale,
        y: () => `+=${scaleInfo.deltaY}`,
        duration: 0.75,
        ease: "power3.inOut",
        onComplete: finalizeAtBottom,
      });

      // 6) Panel sweep: dark then red rise, hero swaps in underneath, panels exit.
      master.fromTo(
        dark,
        { y: "100%" },
        { y: "0%", duration: 0.45, ease: "power3.inOut" },
        "<+=0.05"
      );
      master.fromTo(
        red,
        { y: "100%" },
        { y: "0%", duration: 0.45, ease: "power3.inOut" },
        "-=0.3"
      );
      master.set(bg, { display: "none" });
      master.set("#hero", { opacity: 1 });
      master.to(
        red,
        { y: "-100%", duration: 0.55, ease: "power3.inOut" },
        "+=0.05"
      );
      master.to(
        dark,
        { y: "-100%", duration: 0.55, ease: "power3.inOut" },
        "-=0.4"
      );

      // 6b) Divergence: the mark eases back (anticipation) as the name drops
      //     away, then arcs to its corner while the panels wipe the hero in.
      master.to(
        "#hero-brand",
        {
          scale: () => logoLock.scale * 0.9,
          y: () => logoLock.y - 18,
          duration: 0.55,
          ease: "power2.inOut",
        },
        "nameDrop"
      );
      master.to(
        "#brand-glow",
        { opacity: 0, duration: 0.7, ease: "power1.out" },
        "nameDrop+=0.15"
      );

      // Dock. x and y run on different curves + durations, so the mark travels
      // an arc into the corner instead of a flat diagonal.
      master.addLabel("dock", "-=0.55");
      master.to(
        "#hero-brand",
        { y: 0, duration: 1.0, ease: "power3.inOut" },
        "dock"
      );
      master.to(
        "#hero-brand",
        { x: 0, duration: 1.3, ease: "power2.inOut" },
        "dock+=0.1"
      );
      master.to(
        "#hero-brand",
        { scale: 1, duration: 1.3, ease: "expo.inOut" },
        "dock"
      );
      master.addLabel("logoDocked", "dock+=1.4");

      // 7) Hero content reveals — overlap the dock's tail so it reads as one move.
      master.to(
        "#hero-tagline",
        {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power3.inOut",
        },
        "logoDocked-=0.65"
      );
      master.to(
        "#hero-bar",
        {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.0,
          ease: "power3.inOut",
        },
        "-=0.8"
      );
      master.fromTo(
        "#hero-line",
        { opacity: 1, scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: "power3.inOut" },
        "<"
      );

      // 8) Play the letter-roll reveals.
      master.call(
        () => {
          if (reduced) chTl.progress(1);
          else chTl.play();
        },
        undefined,
        "-=0.8"
      );

      // 9) Unlock scroll and tear the intro chrome down.
      master.call(() => {
        doneRef.current = true;
        document.documentElement.style.overflow = "";
        window.removeEventListener("scroll", lockScroll);
        lenisRef.current?.start();
        window.scrollTo(0, 0);
        window.dispatchEvent(new CustomEvent("intro:done"));
        // Mirrors the original site: these nodes never remount in this SPA.
        panel.remove();
        bg.remove();
      });

      // Skip: jump straight to the settled final state.
      if (reduced) master.progress(1);
    });

    return () => {
      window.removeEventListener("scroll", lockScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hero:scroll-start", onScrollStart);
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  return (
    <>
      <div className="intro-bg" id="intro-bg" ref={bgRef} />
      <div className="name-layer" id="name-layer" ref={nameLayerRef}>
        <div
          className="preloader-content"
          id="preloader-content"
          ref={pContentRef}
        >
          <div id="preloader-logo" ref={logoRef}>
            P
          </div>
          <span id="preloader-luke" ref={lukeRef}>
            aria
          </span>
          <span id="preloader-baffait" ref={baffaitRef}>
            {" Ghorashi"}
          </span>
          <span id="preloader-dot" ref={dotRef}>
            .
          </span>
        </div>
      </div>
      <div className="transition-panel" id="transition-panel" ref={panelRef}>
        <div className="t-panel-dark" id="t-panel-dark" ref={darkRef} />
        <div className="t-panel-red" id="t-panel-red" ref={redRef} />
      </div>
    </>
  );
}
