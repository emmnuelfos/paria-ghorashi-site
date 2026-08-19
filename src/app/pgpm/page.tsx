import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  CapabilityAccordion,
  ListRows,
  CtaBand,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/data/content";
import { PGPM } from "@/data/pages-content-2";

export const metadata: Metadata = {
  title: SEO.pgpm.title,
  description: SEO.pgpm.description,
};

export default function PgpmPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow={PGPM.eyebrow}
        headline={PGPM.headline}
        body={PGPM.body}
        image="/assets/paria/pages/about-venture.jpg"
        alt="PGPM"
        priority
      />

      <Section narrow>
        <Reveal>
          <p className="pg-eyebrow">{PGPM.why.headline}</p>
          <h2 className="pg-h2">One Connected Growth System.</h2>
          {PGPM.why.body.map((p, i) => (
            <p key={i} className={`pg-body${i === 0 ? " pg-body--lead" : ""}`}>
              {p}
            </p>
          ))}
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <p className="pg-eyebrow">{PGPM.advantage.headline}</p>
          <h2 className="pg-h2">Everything, Working Together.</h2>
        </Reveal>
        <CapabilityAccordion items={PGPM.advantage.items} />
      </Section>

      <Section cream tight>
        <Reveal>
          <p className="pg-eyebrow">{PGPM.how.headline}</p>
          <h2 className="pg-h2">How the Work Runs.</h2>
        </Reveal>
        <ListRows items={PGPM.how.items} />
      </Section>

      <CtaBand
        headline="Discuss a Project."
        body="Tell us the business, the objective, and where the current activity is falling short."
        buttons={PGPM.buttons}
      />
    </PageShell>
  );
}
