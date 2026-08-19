"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { PRIMARY_NAV, FOOTER, isLive } from "@/data/content";

const LOGO = "/assets/paria/paria-logo.svg";

/** Must match the exit timing in chrome.css, or the panel unmounts mid-animation. */
const EXIT_MS = 620;

/**
 * Fixed header with a premium full-screen menu.
 *
 * The panel enters as a curtain wipe with the links rising out of masks, and
 * exits in reverse — links fall away first, then the curtain lifts. That needs
 * a real closing state: unmounting on click would cut the exit dead, which is
 * what made the previous version feel like a plain fade.
 *
 * `variant="home"` hides the header's own logo, because on the homepage the
 * <BrandMark /> already owns the mark (it plays the intro lockup and docks to
 * the corner) and two logos would collide.
 */
export function SiteHeader({ variant }: { variant?: "home" }) {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /* On the homepage the header waits for the intro lockup to finish — a burger
     floating over the name animation would undercut it. */
  const [ready, setReady] = useState(variant !== "home");
  const pathname = usePathname();
  const exitTimer = useRef<number | null>(null);

  const close = useCallback(() => {
    setClosing(true);
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, EXIT_MS);
  }, []);

  // Close on route change (without the exit animation — the page is leaving).
  useEffect(() => {
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    setOpen(false);
    setClosing(false);
  }, [pathname]);

  useEffect(() => () => {
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
  }, []);

  /* The panel mounts hidden, so the open class must land on a later frame —
     applying it in the same paint skips the transition entirely. */
  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Lock the page behind the overlay; Escape dismisses.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (variant !== "home") return;
    const onDone = () => setReady(true);
    window.addEventListener("intro:done", onDone, { once: true });
    // The intro is skipped under reduced-motion, so do not wait forever.
    const t = window.setTimeout(() => setReady(true), 9000);
    return () => {
      window.removeEventListener("intro:done", onDone);
      window.clearTimeout(t);
    };
  }, [variant]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = PRIMARY_NAV.filter((l) => !l.cta && isLive(l.href));
  const cta = PRIMARY_NAV.find((l) => l.cta);
  const shown = open && entered && !closing;

  return (
    <>
      <header
        className={[
          "pg-header",
          variant === "home" ? "pg-header--home" : "",
          ready ? "is-ready" : "",
          scrolled ? "is-scrolled" : "",
          open ? "is-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {variant !== "home" && (
          <Link href="/" className="pg-header-logo" aria-label="Paria Ghorashi — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(LOGO)} alt="Paria Ghorashi" width={791} height={537} />
          </Link>
        )}

        <div className="pg-header-right">
          {cta && (
            <Link href={cta.href} className="pg-header-cta">
              {cta.label}
            </Link>
          )}
          <button
            type="button"
            className="pg-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="pg-menu"
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="pg-menu"
        className={`pg-menu${shown ? " is-open" : ""}${closing ? " is-closing" : ""}`}
        hidden={!open}
      >
        {/* Curtain sits behind the content so the wipe reads as one surface. */}
        <span className="pg-menu-curtain" aria-hidden="true" />

        <nav className="pg-menu-nav" aria-label="Main">
          {links.map((l, i) => (
            <span className="pg-menu-mask" key={l.href}>
              <Link
                href={l.href}
                className={`pg-menu-link${pathname === l.href ? " is-current" : ""}`}
                style={{
                  transitionDelay: shown
                    ? `${180 + i * 60}ms`
                    : `${(links.length - 1 - i) * 28}ms`,
                }}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                <span className="pg-menu-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="pg-menu-foot">
          {cta && (
            <Link href={cta.href} className="pg-btn pg-btn--primary">
              {cta.label}
            </Link>
          )}
          <div className="pg-menu-contact">
            <a href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a>
            <span className="pg-menu-socials">
              <a href={FOOTER.instagram.href} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={FOOTER.linkedin.href} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
