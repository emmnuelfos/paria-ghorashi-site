import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHero, Section } from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { TERMS } from "@/data/pages-content-3";

export const metadata: Metadata = {
  title: "Terms of Use | Paria Ghorashi",
  description:
    "Terms governing use of this website and any enquiry or engagement arranged through it.",
  robots: { index: false, follow: true },
};

/** Same rule as the privacy page: structure ships, legal body text does not. */
export default function TermsPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Legal" headline={TERMS.title} body={[TERMS.intro]} />

      <Section narrow>
        <Reveal>
          <p className="pg-notice" role="note">
            {TERMS.pendingNotice}
          </p>
        </Reveal>
        <div className="pg-list">
          {TERMS.headings.map((h, i) => (
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
