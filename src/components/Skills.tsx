"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CharRoll } from "@/components/CharRoll";
import { ArrowRightIcon } from "@/components/icons";
import { SKILL_GROUPS, COPY } from "@/data/site";

/**
 * Skills section: sticky left column (subtitle, uppercase intro, contact
 * link, red scrub-driven arrow) + right accordion of skill groups.
 */
export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const arrow = arrowRef.current;
    if (!section || !arrow) return;

    // Open the first group on mount: give its body its natural height.
    const firstOpenBody = section.querySelector<HTMLElement>(
      ".skill-group.open .skill-body"
    );
    if (firstOpenBody) {
      firstOpenBody.style.height = `${firstOpenBody.scrollHeight}px`;
    }

    const ctx = gsap.context(() => {
      // Red arrow slides across the left column, scrubbed with scroll.
      gsap.fromTo(
        "#skills-arrow",
        { xPercent: 0 },
        {
          xPercent: 100,
          x: () => {
            const left = arrow.parentElement;
            if (!left) return 0;
            const cs = getComputedStyle(left);
            return (
              left.clientWidth -
              parseFloat(cs.paddingLeft) -
              parseFloat(cs.paddingRight) -
              arrow.offsetWidth
            );
          },
          ease: "none",
          scrollTrigger: {
            trigger: "#skills",
            start: "top top",
            endTrigger: "#contact",
            end: "top center",
            scrub: 0.5,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleHeaderClick = (event: MouseEvent<HTMLDivElement>) => {
    const group = event.currentTarget.parentElement;
    if (!group || group.classList.contains("open")) return;
    const section = sectionRef.current;
    if (!section) return;

    // Close the currently open group.
    const openGroup = section.querySelector<HTMLElement>(".skill-group.open");
    if (openGroup) {
      const openBody = openGroup.querySelector<HTMLElement>(".skill-body");
      openGroup.classList.remove("open");
      if (openBody) {
        gsap.to(openBody, {
          height: 0,
          duration: 0.45,
          ease: "power3.inOut",
        });
      }
    }

    // Open the clicked group.
    group.classList.add("open");
    const body = group.querySelector<HTMLElement>(".skill-body");
    if (body) {
      gsap.to(body, {
        height: body.scrollHeight,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  };

  return (
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="skills-inner">
        <div className="skills-left">
          <div className="skills-subtitle">Skills</div>
          <div className="skills-text">{COPY.skillsText}</div>
          <div className="skills-separator"></div>
          <div>
            <CharRoll
              className="skills-contact"
              text={"Contact me\u{1F7A3}"}
              href="#contact"
              spaceGaps
            />
          </div>
          <div className="skills-arrow" id="skills-arrow" ref={arrowRef}>
            <ArrowRightIcon />
          </div>
        </div>
        <div className="skills-right" id="skills-right">
          {SKILL_GROUPS.map((g, idx) => (
            <div
              key={g.key}
              className={idx === 0 ? "skill-group open" : "skill-group"}
              data-group={g.key}
            >
              <div className="skill-header" onClick={handleHeaderClick}>
                <span className="skill-header-title">{g.title}</span>
                <span className="skill-header-icon"></span>
              </div>
              <div className="skill-body">
                <ul className="skill-body-inner">
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
