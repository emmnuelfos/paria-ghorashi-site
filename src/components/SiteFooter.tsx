"use client";

import Link from "next/link";
import { asset } from "@/lib/asset";
import { FOOTER, FOOTER_NAV, isLive } from "@/data/content";

const LOGO = "/assets/paria/paria-logo.svg";

/**
 * Expanded global footer. The brief lists exactly what it must carry: logo,
 * short positioning statement, navigation, social links, contact information,
 * and a Book Consultation call to action. Copy is verbatim from the master.
 *
 * The homepage keeps its own signature ASCII footer; this serves the inner
 * pages, where an editorial footer reads better than the full-screen finale.
 */
export function SiteFooter() {
  return (
    <footer className="pg-footer">
      <div className="pg-footer-inner">
        <div className="pg-footer-brand">
          <Link href="/" className="pg-footer-logo" aria-label="Paria Ghorashi — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(LOGO)} alt="Paria Ghorashi" width={791} height={537} />
          </Link>
          <p className="pg-footer-statement">{FOOTER.statement}</p>
          <Link href={FOOTER.cta.href} className="pg-btn pg-btn--primary pg-footer-cta">
            {FOOTER.cta.label}
          </Link>
        </div>

        <nav className="pg-footer-nav" aria-label="Footer">
          <p className="pg-footer-label">Explore</p>
          <ul>
            {FOOTER_NAV.filter((l) => isLive(l.href)).map((l) => (
              <li key={`${l.href}-${l.label}`}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pg-footer-contact">
          <p className="pg-footer-label">Contact</p>
          <ul>
            <li>
              <a href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a>
            </li>
            <li>
              <a href={FOOTER.instagram.href} target="_blank" rel="noreferrer">
                {FOOTER.instagram.label}
              </a>
            </li>
            <li>
              <a href={FOOTER.linkedin.href} target="_blank" rel="noreferrer">
                {FOOTER.linkedin.label}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pg-footer-base">
        <span>{FOOTER.copyright}</span>
      </div>
    </footer>
  );
}
