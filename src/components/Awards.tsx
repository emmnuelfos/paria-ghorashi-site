import { Fragment } from "react";
import { AWARDS } from "@/data/site";

/**
 * "As Seen In" — a refined publication marquee replacing the studied
 * template's cursor-hover press rows. Two rows scroll in opposite directions:
 * publication wordmarks (large) and the feature headlines (muted). Pure-CSS
 * marquee; paused under reduced-motion (see globals.css).
 */
export function Awards() {
  const pubs = AWARDS.map((a) => a.org);
  const features = AWARDS.map((a) => a.prize);

  return (
    <section className="awards" id="press" aria-label="Press and recognition">
      <div className="press-head">
        <span className="press-kicker">Recognition</span>
        <h2 className="press-title">As Seen In</h2>
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

      <p className="press-note">
        Featured across luxury, beauty, technology &amp; business media.
      </p>

      {/* Screen-reader list of the same recognition (marquee is aria-hidden). */}
      <ul className="sr-only">
        {AWARDS.map((a) => (
          <li key={`${a.org}-${a.prize}`}>
            {a.org} — {a.prize} ({a.date})
          </li>
        ))}
      </ul>
    </section>
  );
}
