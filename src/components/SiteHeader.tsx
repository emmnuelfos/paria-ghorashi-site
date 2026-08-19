"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { PRIMARY_NAV, FOOTER, isLive } from "@/data/content";

const LOGO = "/assets/paria/paria-logo.svg";

/**
 * Fixed slim header with a full-screen menu — the brief asks to "replace the
 * existing menu with a premium full-screen hamburger menu" and to keep the
 * consultation button highly visible, so the CTA sits in the bar itself on
 * desktop and pinned at the foot of the overlay on mobile.
 *
 * Internal links go through next/link so Next prefixes the deploy base path
 * (the site is served from a /paria-ghorashi-site sub-path on GitHub Pages);
 * a raw <a href="/about"> would 404 there while working locally.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock the page behind the overlay, and allow Escape to dismiss.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = PRIMARY_NAV.filter((l) => !l.cta && isLive(l.href));
  const cta = PRIMARY_NAV.find((l) => l.cta);

  return (
    <>
      <header
        className={`pg-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
      >
        <Link href="/" className="pg-header-logo" aria-label="Paria Ghorashi — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(LOGO)} alt="Paria Ghorashi" width={791} height={537} />
        </Link>

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
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="pg-menu"
        className={`pg-menu${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <nav className="pg-menu-nav" aria-label="Main">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`pg-menu-link${pathname === l.href ? " is-current" : ""}`}
              style={{ transitionDelay: `${120 + i * 55}ms` }}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              <span className="pg-menu-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.label}
            </Link>
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
