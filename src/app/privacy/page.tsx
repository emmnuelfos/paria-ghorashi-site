import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHero, Section } from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { PRIVACY } from "@/data/pages-content-3";

export const metadata: Metadata = {
  title: "Privacy Policy | Paria Ghorashi",
  description:
    "How information is collected, used, stored, and protected on this website.",
  robots: { index: false, follow: true },
};

/**
 * The master supplies the introduction and the required headings, and instructs
 * that a UAE-based legal professional review the final policy. The body text is
 * therefore not written here — publishing invented privacy terms for a real
 * business is a legal exposure, not a copy gap. The approved structure ships,
 * clearly marked as pending review.
 */
export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" headline={PRIVACY.title} body={[PRIVACY.intro]} />

      <Section narrow>
        <Reveal>
          <p className="pg-notice" role="note">
            {PRIVACY.pendingNotice}
          </p>
        </Reveal>
        <div className="pg-list">
          {PRIVACY.headings.map((h, i) => (
            <Reveal key={h} as="div" className="pg-list-item" delay={i * 25}>
              <span className="pg-list-index">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="pg-h3">{h}</h2>
              <p className="pg-body">Pending legal review.</p>
            </Reveal>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
