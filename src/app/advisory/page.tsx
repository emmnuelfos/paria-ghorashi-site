import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  ListRows,
  CardGrid,
  CtaBand,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/data/content";
import { ADVISORY } from "@/data/pages-content";

export const metadata: Metadata = {
  title: SEO.advisory.title,
  description: SEO.advisory.description,
};

export default function AdvisoryPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Executive & Founder Advisory"
        headline={ADVISORY.headline}
        body={ADVISORY.body}
        image="/assets/paria/pages/advisory-hero.jpg"
        alt="Paria Ghorashi"
        priority
      />

      <Section>
        <Reveal>
          <p className="pg-eyebrow">{ADVISORY.areas.headline}</p>
          <h2 className="pg-h2">Where an Advisor Makes the Difference.</h2>
        </Reveal>
        <ListRows items={ADVISORY.areas.items} />
      </Section>

      <Section cream tight>
        <Reveal>
          <p className="pg-eyebrow">{ADVISORY.formats.headline}</p>
          <h2 className="pg-h2">Structured Around How You Work.</h2>
        </Reveal>
        <CardGrid items={ADVISORY.formats.items} />
        <Reveal>
          <p className="pg-body" style={{ marginTop: "3rem" }}>
            {ADVISORY.commercial}
          </p>
        </Reveal>
      </Section>

      <CtaBand
        headline="Discuss an Advisory Engagement."
        body="Every advisory engagement is bespoke and begins with a conversation about fit."
        buttons={ADVISORY.buttons}
      />
    </PageShell>
  );
}
