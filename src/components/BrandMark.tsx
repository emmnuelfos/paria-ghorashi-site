"use client";

import { asset } from "@/lib/asset";

const LOGO = "/assets/paria/paria-logo.svg";

/**
 * Persistent brand mark.
 *
 * Lives outside #hero (which is transparent during the intro) and above the
 * intro layers, so it can take part in the intro lockup with the name, then
 * dock to its top-right resting spot and serve as the site logo.
 *
 * The artwork is drawn twice and split by clip-path so the monogram and the
 * wordmark can reveal as separate beats. Split points come from an alpha row
 * scan of the asset: monogram 0–76.1%, wordmark 83.8–91.5%, rule 98.9–100% —
 * so 80% sits cleanly in the gap.
 *
 * IntroOverlay choreographs the entrance/dock; Hero fades it out on scroll.
 */
export function BrandMark() {
  const src = asset(LOGO);
  return (
    <a
      className="monogram hero-brand"
      id="hero-brand"
      href="#hero"
      aria-label="Paria Ghorashi — top"
    >
      <span className="brand-glow" id="brand-glow" aria-hidden="true" />

      {/* Monogram — in flow, so it sizes the link. */}
      <span className="brand-part brand-mark" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="brand-mark-img"
          className="brand-layer"
          src={src}
          alt=""
          width={791}
          height={537}
        />
      </span>

      {/* Wordmark + rule — overlaid, clipped to the lower band. */}
      <span className="brand-part brand-word" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id="brand-word-img"
          className="brand-layer"
          src={src}
          alt=""
          width={791}
          height={537}
        />
      </span>

      {/* Light sweep, masked to the logo silhouette (inline url -> base path). */}
      <span
        className="brand-sheen"
        id="brand-sheen"
        aria-hidden="true"
        style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
      />
    </a>
  );
}
