"use client";

import { useEffect, useRef } from "react";
import { gsap, isMobileDevice, prefersReducedMotion } from "@/lib/gsap";
import { wrapWords } from "@/lib/text";
import { COPY } from "@/data/site";

/**
 * Manifesto — a full-bleed pull-quote in her voice, sitting between the reveal
 * and the About section. Words rise + un-blur on a scrubbed scroll as the line
 * settles into the centre of the viewport. Static under reduced-motion.
 */
export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mobile = isMobileDevice();
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const quote = root.querySelector<HTMLElement>("#manifesto-quote");
      if (!quote) return;
      if (!quote.querySelector(".word")) wrapWords(quote);
      const words = gsap.utils.toArray<HTMLElement>(".word", quote);

      if (reduced) {
        gsap.set(words, { opacity: 1, filter: "none", y: 0 });
      } else {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            yPercent: 110,
            ...(mobile ? {} : { filter: "blur(6px)" }),
          },
          {
            opacity: 1,
            yPercent: 0,
            ...(mobile ? {} : { filter: "blur(0px)" }),
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: root,
              start: "top 72%",
              end: "top 28%",
              scrub: true,
            },
          },
        );
      }

      // Kicker + citation fade in with the line.
      gsap.fromTo(
        [root.querySelector(".manifesto-kicker"), root.querySelector(".manifesto-cite")],
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            end: "top 45%",
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto" id="manifesto" ref={rootRef}>
      <div className="manifesto-inner">
        <p className="manifesto-kicker">{COPY.manifestoKicker}</p>
        <blockquote
          className="manifesto-quote"
          id="manifesto-quote"
          dangerouslySetInnerHTML={{ __html: COPY.manifestoQuote }}
        />
        <p className="manifesto-cite">
          <span className="manifesto-cite-line" />
          {COPY.manifestoCite}
        </p>
      </div>
    </section>
  );
}
