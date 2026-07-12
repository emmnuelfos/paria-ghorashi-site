"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, isMobileViewport } from "@/lib/gsap";
import { wrapWords } from "@/lib/text";
import { GALLERY_COVERS, COPY } from "@/data/site";

const SLICES = 10;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

/**
 * Scroll-scrubbed pinned 3D cylinder orbit of 8 sliced project covers with a
 * blur-revealed phrase riding through the center. Desktop only (CSS hides the
 * section at <=768px; JS setup is also skipped on mobile viewports).
 */
export function CircleGallery() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const phraseRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (isMobileViewport()) return;
    const pin = pinRef.current;
    const phrase = phraseRef.current;
    if (!pin || !phrase) return;

    const vw = window.innerWidth;

    // Slice geometry (shared by all 8 images).
    const imgW = Math.min(Math.max(120, vw * 0.14), 210);
    const imgH = (imgW * 2) / 3;
    const orbitR = (vw * 0.34 + 500) / 2;
    const sliceW = imgW / SLICES;
    const displayW = sliceW + 1.5;
    const bendRad = imgW / orbitR;
    const totalBendDeg = (bendRad * 180) / Math.PI;
    const stepDeg = totalBendDeg / SLICES;

    const wrappers: HTMLDivElement[] = GALLERY_COVERS.map((cover) => {
      const wrapper = document.createElement("div");
      wrapper.className = "cg-img";
      wrapper.style.opacity = "0";
      for (let s = 0; s < SLICES; s++) {
        const slice = document.createElement("div");
        slice.className = "cg-slice";
        slice.style.width = `${displayW.toFixed(1)}px`;
        slice.style.left = "50%";
        slice.style.marginLeft = `${(-displayW / 2).toFixed(1)}px`;
        slice.style.backgroundImage = `url(${cover})`;
        slice.style.backgroundSize = `${imgW.toFixed(1)}px ${imgH.toFixed(1)}px`;
        slice.style.backgroundPosition = `${(-s * sliceW).toFixed(1)}px 0`;
        slice.style.transformOrigin = `50% 50% ${(-orbitR).toFixed(1)}px`;
        slice.style.transform = `rotateY(${((s - 4.5) * stepDeg).toFixed(2)}deg)`;
        wrapper.appendChild(slice);
      }
      pin.insertBefore(wrapper, phrase);
      return wrapper;
    });

    wrapWords(phrase);
    const words = Array.from(phrase.querySelectorAll<HTMLElement>(".word"));
    const wordCount = words.length;

    // Orbit constants.
    const rx = vw * 0.34;
    const rz = 500;
    const tiltY = 180;
    const stagger = 0.09;
    const totalRange = 1 + stagger * 7;
    const entryAngle = Math.PI / 2;
    const offX = vw * 0.85;

    // Phrase constants.
    const phraseStart = 0.25;
    const phraseEnd = 0.75;
    const travelY = 200;
    const revealEnd = 0.4;

    const st = ScrollTrigger.create({
      trigger: "#circle-gallery",
      start: "top top",
      end: "bottom bottom",
      pin: "#circle-gallery-pin",
      onUpdate: (self) => {
        const progress = self.progress;

        for (let i = 0; i < wrappers.length; i++) {
          const el = wrappers[i];
          const imgT = progress * totalRange - i * stagger;
          if (imgT <= 0 || imgT >= 1) {
            el.style.opacity = "0";
            continue;
          }

          let alpha = 1;
          if (imgT < 0.06) alpha = imgT / 0.06;
          else if (imgT > 0.94) alpha = (1 - imgT) / 0.06;

          let x: number;
          let y: number;
          let z: number;
          let rotY: number;
          if (imgT <= 0.12) {
            const p = imgT / 0.12;
            x = -offX * (1 - p);
            y = tiltY;
            z = rz * p;
            rotY = 0;
          } else if (imgT <= 0.88) {
            const p = (imgT - 0.12) / 0.76;
            const angle = entryAngle - p * 2 * Math.PI;
            x = Math.cos(angle) * rx;
            z = Math.sin(angle) * rz;
            y = (z / rz) * tiltY;
            rotY = p * 2 * Math.PI;
          } else {
            const p = (imgT - 0.88) / 0.12;
            x = offX * p;
            y = tiltY;
            z = rz * (1 - p);
            rotY = 2 * Math.PI;
          }

          el.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateY(${(rotY * 180) / Math.PI}deg)`;
          el.style.opacity = `${alpha}`;
          el.style.zIndex = `${Math.round(z + 600)}`;
        }

        if (progress < phraseStart || progress > phraseEnd) {
          phrase.style.opacity = "0";
          return;
        }

        const globalP = (progress - phraseStart) / (phraseEnd - phraseStart);
        phrase.style.transform = `translateY(${(travelY * (0.5 - globalP)).toFixed(1)}px)`;

        if (globalP < revealEnd) {
          for (let wi = 0; wi < wordCount; wi++) {
            const wordT = (globalP / revealEnd) * (wordCount + 4) - wi;
            const wP = clamp01(wordT / 3);
            words[wi].style.opacity = `${wP}`;
            words[wi].style.filter = `blur(${8 * (1 - wP)}px)`;
          }
        } else {
          for (let wi = 0; wi < wordCount; wi++) {
            words[wi].style.opacity = "1";
            words[wi].style.filter = "blur(0px)";
          }
        }

        let phraseAlpha = 1;
        if (globalP < 0.1) phraseAlpha = globalP / 0.1;
        else if (globalP > 0.75) phraseAlpha = (1 - globalP) / 0.25;
        phrase.style.opacity = `${phraseAlpha}`;
      },
    });

    return () => {
      st.kill();
      wrappers.forEach((w) => w.remove());
      phrase.innerHTML = COPY.cgPhrase;
      phrase.style.opacity = "";
      phrase.style.transform = "";
    };
  }, []);

  return (
    <section className="circle-gallery" id="circle-gallery">
      <div className="circle-gallery-pin" id="circle-gallery-pin" ref={pinRef}>
        <p
          className="cg-phrase"
          id="cg-phrase"
          ref={phraseRef}
          dangerouslySetInnerHTML={{ __html: COPY.cgPhrase }}
        />
      </div>
    </section>
  );
}
