"use client";

import { Fragment, useEffect } from "react";
import { gsap, isMobileViewport } from "@/lib/gsap";
import { CharRoll } from "@/components/CharRoll";
import { HeroCanvas } from "@/components/HeroCanvas";
import { COPY, NAV_LINKS, SOCIALS } from "@/data/site";

/**
 * Sticky hero inside the 400vh scroll-wrap. After `intro:done`, a scrubbed
 * ScrollTrigger timeline drives the exit: name recenters vertically, hero
 * chrome fades, then the name halves split out left/right.
 * (The reveal-canvas animation on the same trigger lives in another component.)
 */
export function Hero() {
  useEffect(() => {
    const ctx = gsap.context(() => {});
    let scrollStarted = false;

    const buildScrollOut = () => {
      ctx.add(() => {
        const pContent = document.getElementById("preloader-content");
        if (!pContent) return;
        // x stays at the settled vw offset — only y is tweened, so the
        // current x transform (read/kept by GSAP's cache) is preserved.
        const offX = isMobileViewport() ? "35vw" : "55vw";
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "#scroll-wrap",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              if (!scrollStarted && self.progress > 0.001) {
                scrollStarted = true;
                // Stops IntroOverlay's resize re-anchoring permanently.
                window.dispatchEvent(new CustomEvent("hero:scroll-start"));
              }
            },
          },
        });
        tl.to(pContent, { y: 0, duration: 0.3 }, 0);
        tl.to(
          ["#hero-tagline", "#hero-bar", "#hero-line"],
          { opacity: 0, duration: 0.15 },
          0
        );
        tl.to(
          ["#preloader-logo", "#preloader-luke"],
          { x: `-${offX}`, opacity: 0, duration: 0.7 },
          0.3
        );
        tl.to(
          ["#preloader-baffait", "#preloader-dot"],
          { x: offX, opacity: 0, duration: 0.7 },
          0.3
        );
        tl.set("#name-layer", { autoAlpha: 0 }, 0.98);
      });
    };

    window.addEventListener("intro:done", buildScrollOut, { once: true });

    return () => {
      window.removeEventListener("intro:done", buildScrollOut);
      ctx.revert();
    };
  }, []);

  return (
    <div className="scroll-wrap" id="scroll-wrap">
      <section className="hero" id="hero">
        <h1 className="sr-only">
          Paria Ghorashi — Entrepreneur, brand strategist and growth architect, building meaningful partnerships across luxury, business and culture.
        </h1>
        <div className="hero-canvas" id="hero-canvas">
          <HeroCanvas />
        </div>
        <div className="hero-content">
          <div
            className="hero-tagline"
            id="hero-tagline"
            dangerouslySetInnerHTML={{ __html: COPY.heroTagline }}
          />
          <div className="hero-line" id="hero-line" />
          <div className="hero-bar" id="hero-bar">
            <div className="hero-bar-left">
              <CharRoll text={"\u{1F87A}SINCE 2012"} />
            </div>
            <nav className="hero-bar-center" aria-label="Social links">
              {SOCIALS.map((social, i) => (
                <Fragment key={social.label}>
                  {i > 0 && <span className="sep">/</span>}
                  <CharRoll
                    text={social.label}
                    href={social.href}
                    external
                  />
                </Fragment>
              ))}
            </nav>
            <nav className="hero-bar-right">
              {NAV_LINKS.map((link) => (
                <CharRoll key={link.label} text={link.label} href={link.href} />
              ))}
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
