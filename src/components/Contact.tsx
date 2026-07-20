"use client";

import { useEffect, useState, type FormEvent } from "react";
import { gsap, ScrollTrigger, isMobileViewport } from "@/lib/gsap";
import { CharRoll } from "@/components/CharRoll";
import { ArrowRightIcon } from "@/components/icons";
import { SOCIALS, COPY } from "@/data/site";
import { asset } from "@/lib/asset";

/** Display order for the contact socials column (differs from SOCIALS order). */
const SOCIAL_ORDER = ["GitHub", "LinkedIn", "Behance"];

/**
 * Contact — scroll-scrubbed white blob flood + flying framed images/text.
 * Renders three siblings: fixed dark bg, fixed blob wrap, and the pinned
 * contact section. The footer-handoff timeline that later moves
 * #contact-blob-wrap / #contact-pin belongs to FooterSection — not here.
 */
export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Please add your name and a short message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  };

  useEffect(() => {
    const blobWrap = document.getElementById("contact-blob-wrap");
    const blob = document.getElementById("contact-blob");
    const contactBg = document.getElementById("contact-bg");
    const title = document.getElementById("contact-title");
    const socials = document.getElementById("contact-socials");
    const mail = document.getElementById("contact-mail");
    const frame1 = document.getElementById("contact-frame");
    const frameImg1 = document.getElementById("contact-frame-img");
    const frame2 = document.getElementById("contact-frame-2");
    const frameImg2 = document.getElementById("contact-frame-img-2");
    const dispo1 = document.getElementById("contact-dispo");
    const dispo2 = document.getElementById("contact-dispo-2");
    const form = document.getElementById("contact-form");

    if (
      !blobWrap ||
      !blob ||
      !contactBg ||
      !title ||
      !socials ||
      !mail ||
      !frame1 ||
      !frameImg1 ||
      !frame2 ||
      !frameImg2 ||
      !dispo1 ||
      !dispo2 ||
      !form
    ) {
      return;
    }

    // On phones the contact section renders as a plain static block (see the
    // mobile rules in globals.css), so none of the pinned/scrubbed choreography
    // runs — no blob flood, flying frames or clip reveals.
    if (isMobileViewport()) return;

    blobWrap.style.visibility = "hidden";

    const show = () => {
      blobWrap.style.visibility = "visible";
      contactBg.style.display = "block";
    };
    const hide = () => {
      blobWrap.style.visibility = "hidden";
      contactBg.style.display = "none";
    };

    /**
     * Visibility gating for the fixed blob/bg. '#footer-transition' belongs
     * to another component — it exists at assembly, but guard anyway.
     */
    const createGate = (): boolean => {
      if (!document.getElementById("footer-transition")) return false;
      ScrollTrigger.create({
        trigger: "#contact",
        start: "top bottom",
        endTrigger: "#footer-transition",
        end: "bottom bottom",
        onEnter: show,
        onEnterBack: show,
        onLeave: hide,
        onLeaveBack: hide,
      });
      return true;
    };

    let gateReady = false;

    const ctx = gsap.context(() => {
      gateReady = createGate();

      // Pre-sets (before the timeline)
      gsap.set(title, { yPercent: 0, x: () => window.innerWidth * 1.1 });
      gsap.set(frame1, { yPercent: -50, y: () => window.innerHeight * 1.1 });
      gsap.set(frameImg1, { yPercent: -30 });
      gsap.set(frame2, { yPercent: -50, y: () => window.innerHeight * 1.3 });
      gsap.set(frameImg2, { yPercent: -30 });
      gsap.set(dispo1, {
        yPercent: -50,
        y: () => window.innerHeight * 1.1,
        opacity: 1,
        clipPath: "inset(0% 0 0% 0)",
      });
      gsap.set(dispo2, {
        yPercent: -50,
        y: () => window.innerHeight * 1.1,
        opacity: 1,
        clipPath: "inset(0% 0 0% 0)",
      });

      const pairStart = 0.22;
      const frameDur = 0.65;

      // Master scrub timeline — positions are fractions of the scroll range.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.fromTo(
        blob,
        { scale: 0 },
        { scale: 1, duration: 0.6, ease: "none" },
        0,
      );

      const hud = [
        document.querySelector("#scroll-timeline"),
        document.querySelector("#scroll-pct"),
      ].filter((el): el is Element => el !== null);
      if (hud.length) {
        tl.to(hud, { opacity: 0, duration: 0.08 }, 0.1);
      }

      tl.to(title, { x: 0, duration: 0.3, ease: "power3.out" }, 0.18);

      tl.fromTo(
        socials,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.2, ease: "none" },
        0.28,
      );
      tl.fromTo(
        mail,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.2, ease: "none" },
        0.36,
      );

      // Enquiry form wipes in under the title, alongside the socials reveal.
      // Mobile reveals earlier: the pin starts handing off to the footer around
      // ~0.7, so a late reveal never lands in the on-screen window.
      tl.fromTo(
        form,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.2, ease: "none" },
        isMobileViewport() ? 0.34 : 0.42,
      );

      // Frame pair 1 + dispo 1
      tl.to(
        frame1,
        { y: () => -(window.innerHeight * 1.4), duration: frameDur, ease: "none" },
        pairStart,
      );
      tl.to(
        frameImg1,
        { yPercent: 30, duration: frameDur, ease: "none" },
        pairStart,
      );
      tl.to(
        dispo1,
        { y: () => -(window.innerHeight * 1.65), duration: frameDur, ease: "none" },
        pairStart,
      );
      tl.to(
        dispo1,
        {
          opacity: 0,
          clipPath: "inset(100% 0 0% 0)",
          duration: 0.15,
          ease: "power2.in",
        },
        pairStart + 0.45,
      );

      // Frame pair 2 + dispo 2
      tl.to(
        frame2,
        { y: () => -(window.innerHeight * 1.4), duration: frameDur, ease: "none" },
        pairStart + 0.07,
      );
      tl.to(
        frameImg2,
        { yPercent: 30, duration: frameDur, ease: "none" },
        pairStart + 0.07,
      );
      tl.to(
        dispo2,
        { y: () => -(window.innerHeight * 1.4), duration: frameDur, ease: "none" },
        pairStart,
      );
      tl.to(
        dispo2,
        {
          opacity: 0,
          clipPath: "inset(100% 0 0% 0)",
          duration: 0.15,
          ease: "power2.in",
        },
        pairStart + 0.45,
      );
    });

    // '#footer-transition' missing at mount — retry once when intro finishes.
    let retry: (() => void) | null = null;
    if (!gateReady) {
      retry = () => {
        ctx.add(() => {
          createGate();
        });
      };
      window.addEventListener("intro:done", retry, { once: true });
    }

    return () => {
      if (retry) window.removeEventListener("intro:done", retry);
      ctx.revert();
    };
  }, []);

  const orderedSocials = SOCIAL_ORDER.map((label) =>
    SOCIALS.find((s) => s.label === label),
  ).filter((s): s is (typeof SOCIALS)[number] => s !== undefined);

  return (
    <>
      <div className="contact-bg" id="contact-bg"></div>
      <div className="contact-blob-wrap" id="contact-blob-wrap">
        <div className="contact-blob" id="contact-blob"></div>
      </div>
      <section className="contact" id="contact">
        <div className="contact-pin" id="contact-pin">
          <div className="contact-title" id="contact-title">
            Contact
          </div>
          <div className="contact-dispo" id="contact-dispo">
            <p dangerouslySetInnerHTML={{ __html: COPY.contactDispo1 }} />
          </div>
          <div className="contact-frame" id="contact-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="contact-frame-img"
              id="contact-frame-img"
              src={asset("/assets/paria/contact-1.jpg")}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="frame-corner tl"></span>
            <span className="frame-corner tr"></span>
            <span className="frame-corner bl"></span>
            <span className="frame-corner br"></span>
          </div>
          <div className="contact-dispo" id="contact-dispo-2">
            <p dangerouslySetInnerHTML={{ __html: COPY.contactDispo2 }} />
          </div>
          <div className="contact-frame" id="contact-frame-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="contact-frame-img"
              id="contact-frame-img-2"
              src={asset("/assets/paria/contact-2.jpg")}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="frame-corner tl"></span>
            <span className="frame-corner tr"></span>
            <span className="frame-corner bl"></span>
            <span className="frame-corner br"></span>
          </div>
          <form
            className="contact-form"
            id="contact-form"
            onSubmit={onSubmit}
            noValidate
          >
            {sent ? (
              <div className="cf-sent">
                <p className="cf-sent-title">
                  Thank <span className="cf-em">you.</span>
                </p>
                <p className="cf-sent-sub">
                  Your note is on its way. I read every message myself — expect
                  a reply shortly.
                </p>
              </div>
            ) : (
              <>
                <p className="cf-head">
                  Start a <span className="cf-em">conversation</span>
                </p>
                <div className="cf-row">
                  <label className="cf-label" htmlFor="cf-name">
                    Name
                  </label>
                  <input
                    className="cf-input"
                    id="cf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="cf-row">
                  <label className="cf-label" htmlFor="cf-email">
                    Email
                  </label>
                  <input
                    className="cf-input"
                    id="cf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="cf-row">
                  <label className="cf-label" htmlFor="cf-message">
                    Message
                  </label>
                  <textarea
                    className="cf-input cf-textarea"
                    id="cf-message"
                    name="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button className="cf-submit" type="submit">
                  <span className="cf-submit-label">Send message</span>
                  <ArrowRightIcon className="cf-submit-arrow" />
                </button>
                <p className="cf-error" role="alert">
                  {error}
                </p>
              </>
            )}
          </form>
          <div className="contact-bottom" id="contact-bottom">
            <nav
              className="contact-socials"
              id="contact-socials"
              aria-label="Social links"
            >
              {orderedSocials.map((social) => (
                <CharRoll
                  key={social.label}
                  text={social.label}
                  href={social.href}
                  spaceGaps
                  external
                />
              ))}
            </nav>
            <a
              className="contact-mail"
              id="contact-mail"
              href={`mailto:${COPY.mail}`}
            >
              {COPY.mail}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
