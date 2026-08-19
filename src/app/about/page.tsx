import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  EditorialSplit,
  ListRows,
  QuoteBlock,
  CtaBand,
  Checklist,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO, ABOUT } from "@/data/content";

export const metadata: Metadata = {
  title: SEO.about.title,
  description: SEO.about.description,
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About Paria"
        headline={ABOUT.headline}
        body={ABOUT.intro}
        image="/assets/paria/pages/about-hero.jpg"
        alt="Paria Ghorashi"
        priority
      />

      {/* The journey — chapters as numbered editorial rows. */}
      <Section>
        <Reveal>
          <p className="pg-eyebrow">The Journey</p>
          <h2 className="pg-h2">From Norway to Dubai, One Decision at a Time.</h2>
        </Reveal>
        <ListRows items={ABOUT.journey} />
      </Section>

      {/* Alternating image/text, as the brief specifies, to create movement. */}
      <Section tight>
        <EditorialSplit
          image="/assets/paria/pages/about-fashion.jpg"
          alt="Paria Ghorashi in studio"
          eyebrow="What Shapes Her Approach"
          title="Seeing Businesses From the Inside."
          body={ABOUT.approach}
        />
        <EditorialSplit
          reverse
          image="/assets/paria/pages/about-venture.jpg"
          alt="Paria Ghorashi at work"
          eyebrow="Core Principles"
          title="The Standards Behind the Work."
        >
          <Checklist items={ABOUT.principles} />
        </EditorialSplit>
      </Section>

      <QuoteBlock quote={ABOUT.quote} cite="Paria Ghorashi" />

      <Section>
        <EditorialSplit
          image="/assets/paria/pages/about-beyond.jpg"
          alt="Paria Ghorashi at a community event"
          eyebrow="Beyond Business"
          title="Work That Reaches Further."
          body={ABOUT.beyondBusiness}
        />
      </Section>

      <CtaBand
        headline="Let’s Build Something Meaningful."
        buttons={ABOUT.buttons}
      />
    </PageShell>
  );
}
