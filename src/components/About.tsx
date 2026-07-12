"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobileDevice } from "@/lib/gsap";
import { wrapWords } from "@/lib/text";
import { CharRoll } from "@/components/CharRoll";
import { ArrowRightIcon } from "@/components/icons";
import { COPY } from "@/data/site";
import { asset } from "@/lib/asset";

/**
 * About section (.about inside section.section-after):
 * word-by-word blur reveal on the intro text + version line, blur-in sub
 * paragraph, and a scrubbed parallax + blur-in on the profile photo.
 */
export function About() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mobile = isMobileDevice();
    let cancelled = false;

    const ctx = gsap.context(() => {
      // 1. Word-by-word blur reveal: #about-text + .about-version
      const aboutText = root.querySelector<HTMLElement>("#about-text");
      const aboutVersion = root.querySelector<HTMLElement>(".about-version");

      if (aboutText && !aboutText.querySelector(".word")) {
        wrapWords(aboutText);
      }
      if (aboutVersion) {
        // The arrow svg participates as a .word (original behavior).
        aboutVersion.querySelector("svg")?.classList.add("word");
        if (!aboutVersion.querySelector("span.word")) {
          wrapWords(aboutVersion);
        }
      }

      const words: HTMLElement[] = [];
      if (aboutText) {
        words.push(...aboutText.querySelectorAll<HTMLElement>(".word"));
      }
      if (aboutVersion) {
        words.push(...aboutVersion.querySelectorAll<HTMLElement>(".word"));
      }

      words.forEach((word) => {
        if (mobile) word.style.filter = "none";
        gsap.to(word, {
          opacity: 1,
          ...(mobile ? {} : { filter: "blur(0px)" }),
          ease: "none",
          scrollTrigger: {
            trigger: word,
            start: "top 75%",
            end: "top 60%",
            scrub: true,
          },
        });
      });

      // 2. Sub paragraph blur-in
      const sub = root.querySelector<HTMLElement>("#about-sub");
      if (sub) {
        gsap.set(sub, {
          opacity: 0,
          ...(mobile ? {} : { filter: "blur(12px)" }),
        });
        gsap.to(sub, {
          opacity: 1,
          ...(mobile ? {} : { filter: "blur(0px)" }),
          ease: "none",
          scrollTrigger: {
            trigger: "#about-sub",
            start: "top 80%",
            end: "top 60%",
            scrub: true,
          },
        });
      }
    }, root);

    // 3. Photo parallax after the image has decoded
    const img = root.querySelector<HTMLImageElement>(".about-photo");
    const buildPhotoTimeline = () => {
      if (cancelled || !img) return;
      ctx.add(() => {
        // Parallax across the full journey through the viewport.
        gsap.fromTo(
          img,
          { y: "-50%" },
          {
            y: "50%",
            ease: "none",
            scrollTrigger: {
              trigger: "#about-photo-wrap",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
        // Blur/opacity clears early — crisp shortly after the photo enters view.
        gsap.fromTo(
          img,
          mobile ? { opacity: 0 } : { opacity: 0, filter: "blur(20px)" },
          {
            opacity: 1,
            ...(mobile ? {} : { filter: "blur(0px)" }),
            ease: "none",
            scrollTrigger: {
              trigger: "#about-photo-wrap",
              start: "top 95%",
              end: "top 68%",
              scrub: true,
            },
          }
        );
      });
      ScrollTrigger.refresh();
    };

    if (img) {
      img
        .decode()
        .then(buildPhotoTimeline)
        .catch(() => {
          if (img.complete) {
            buildPhotoTimeline();
          } else {
            img.onload = buildPhotoTimeline;
          }
        });
    }

    return () => {
      cancelled = true;
      if (img) img.onload = null;
      ctx.revert();
    };
  }, []);

  return (
    <div className="about" id="about" ref={rootRef}>
      <div
        className="about-text"
        id="about-text"
        dangerouslySetInnerHTML={{ __html: COPY.aboutText }}
      />
      <div className="about-sub" id="about-sub">
        {COPY.aboutSub}
      </div>
      <div className="about-btn">
        <CharRoll text="Info" href="#about" />
      </div>
      <div className="about-version">
        <ArrowRightIcon />
        SINCE 2012
      </div>
      <div className="about-photo-wrap" id="about-photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="about-photo"
          src={asset("/assets/paria/about.jpg")}
          alt="Paria Ghorashi"
          width={1013}
          height={1500}
          decoding="async"
        />
      </div>
    </div>
  );
}
