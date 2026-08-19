import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  CardGrid,
  ListRows,
  CtaBand,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO, WORK_WITH_PARIA } from "@/data/content";

export const metadata: Metadata = {
  title: SEO.workWithParia.title,
  description: SEO.workWithParia.description,
};

export default function WorkWithPariaPage() {
  const engagements = WORK_WITH_PARIA.engagements.map((e) => ({
    title: e.title,
    body: e.body,
    terms: e.terms,
    button: e.button,
  }));

  return (
    <PageShell>
      <PageHero
        eyebrow="Work With Paria"
        headline={WORK_WITH_PARIA.headline}
        body={WORK_WITH_PARIA.body}
        image="/assets/paria/pages/work-hero.jpg"
        alt="Paria Ghorashi"
        priority
      />

      {/* The hub: every engagement route, each linking onward. */}
      <Section>
        <Reveal>
          <p className="pg-eyebrow">Engagements</p>
          <h2 className="pg-h2">Choose the Way of Working That Fits.</h2>
        </Reveal>
        <CardGrid items={engagements} />
      </Section>

      <Section cream tight>
        <Reveal>
          <p className="pg-eyebrow">The Process</p>
          <h2 className="pg-h2">{WORK_WITH_PARIA.process.headline}</h2>
        </Reveal>
        <ListRows
          items={WORK_WITH_PARIA.process.steps.map((s) => ({
            title: s.title,
            body: s.body,
          }))}
        />
      </Section>

      <CtaBand
        headline="Start With What You Are Building."
        body="Share your business, goals, current challenge, preferred service, and timing."
        buttons={[
          { label: "Start a Conversation", href: "/contact" },
          { label: "Book a Consultation", href: "/consultation" },
        ]}
      />
    </PageShell>
  );
}
