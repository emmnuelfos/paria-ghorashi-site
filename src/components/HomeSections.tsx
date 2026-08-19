"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Section, CardGrid } from "@/components/PageSections";
import { HOME } from "@/data/content";

/**
 * Homepage sections that had no equivalent in the original build, added so the
 * page follows the Website Copy Master's eleven-section structure. They use the
 * same editorial system as the inner pages, so the site reads as one design.
 */

/** Section 5 — EXPERIENCE ACROSS. */
export function IndustriesBand() {
  return (
    <Section id="industries" tight>
      <Reveal>
        <p className="pg-eyebrow">Experience Across</p>
        <h2 className="pg-h2">{HOME.industries.headline}</h2>
      </Reveal>
      <Reveal delay={80}>
        <ul className="home-industries">
          {HOME.industries.list.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/** Section 8 — HOW BRANDS COLLABORATE WITH PARIA. */
export function CollaborateBand() {
  return (
    <Section id="collaborate">
      <Reveal>
        <p className="pg-eyebrow">How Brands Collaborate</p>
        <h2 className="pg-h2">{HOME.collaborate.headline}</h2>
        <p className="pg-body pg-body--lead">{HOME.collaborate.body}</p>
      </Reveal>
      <div style={{ marginTop: "3.5rem" }}>
        <CardGrid items={HOME.collaborate.items} cols3 />
      </div>
    </Section>
  );
}

/** Section 9 — CONSULTATION FEATURE. The strongest commercial CTA on the page. */
export function ConsultationBand() {
  const c = HOME.consultationFeature;
  return (
    <section className="home-consult" id="consultation-feature">
      <Reveal>
        <p className="pg-eyebrow">{c.eyebrow}</p>
        <h2 className="pg-h2 home-consult-title">{c.headline}</h2>
        <p className="pg-body home-consult-body">{c.body}</p>
        <p className="home-consult-price">{c.price}</p>
        <Link href="/consultation" className="pg-btn pg-btn--primary">
          {c.buttons[0].label}
        </Link>
      </Reveal>
    </section>
  );
}

/** Section 7 — SELECTED CLIENTS & PARTNERS. */
export function ClientsBand() {
  return (
    <Section id="clients" tight narrow>
      <Reveal>
        <p className="pg-eyebrow">Selected Clients & Partners</p>
        <h2 className="pg-h2">{HOME.clients.headline}</h2>
        <p className="pg-body pg-body--lead">{HOME.clients.body}</p>
        {/*
          The master: "Use the approved client-logo pages from the portfolio.
          Do not show a logo unless the relationship and permission are
          confirmed." No logo wall until that confirmation arrives.
        */}
      </Reveal>
    </Section>
  );
}
