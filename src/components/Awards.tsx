import { Fragment } from "react";
import Link from "next/link";
import { MEDIA } from "@/data/pages-content-2";
import { COPY } from "@/data/site";

/**
 * "As Seen In" — a refined publication marquee replacing the studied
 * template's cursor-hover press rows. Two rows scroll in opposite directions:
 * publication wordmarks (large) and the feature headlines (muted). Pure-CSS
 * marquee; paused under reduced-motion (see globals.css).
 */
export function Awards() {
  // Home Section 10 — Media & Recognition. Publications from the master.
  const pubs = MEDIA.asSeenIn.items;
  const features = MEDIA.categories.items.map((c) => c.title);

  return (
    <section className="awards" id="press" aria-label="Press and recognition">
      <div className="press-head">
        <span className="press-kicker">Media &amp; Recognition</span>
        <h2 className="press-title">{COPY.mediaHeadline}</h2>
        <p className="press-intro">{COPY.mediaBody}</p>
      </div>

      <div className="press-marquee" aria-hidden="true">
        <div className="press-track">
          {[0, 1].map((dup) => (
            <Fragment key={dup}>
              {pubs.map((name, i) => (
                <Fragment key={`${dup}-${i}`}>
                  <span className="press-pub">{name}</span>
                  <span className="press-sep">&#10022;</span>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="press-marquee reverse" aria-hidden="true">
        <div className="press-track">
          {[0, 1].map((dup) => (
            <Fragment key={dup}>
              {features.map((f, i) => (
                <Fragment key={`${dup}-${i}`}>
                  <span className="press-feature">{f}</span>
                  <span className="press-sep sm">&#183;</span>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* The Copy Master's S10 standfirst now sits above the marquee, so the
          old clone-era note underneath would only restate it. */}
      <div className="press-cta">
        <Link href={COPY.mediaButton.href} className="pg-btn pg-btn--ghost">
          {COPY.mediaButton.label}
        </Link>
      </div>

      {/* Screen-reader list of the same recognition (marquee is aria-hidden). */}
      <ul className="sr-only">
        {pubs.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}
