import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  ListRows,
  EditorialSplit,
  Checklist,
  Tags,
  CtaBand,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/data/content";
import { SPEAKING } from "@/data/pages-content-2";

export const metadata: Metadata = {
  title: SEO.speaking.title,
  description: SEO.speaking.description,
};

export default function SpeakingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Speaking, Hosting & Events"
        headline={SPEAKING.headline}
        body={SPEAKING.body}
        image="/assets/paria/pages/about-today.jpg"
        alt="Paria Ghorashi speaking"
        priority
      />

      <Section>
        <Reveal>
          <p className="pg-eyebrow">{SPEAKING.engagements.headline}</p>
          <h2 className="pg-h2">Six Ways to Take the Stage.</h2>
        </Reveal>
        <ListRows items={SPEAKING.engagements.items} />
      </Section>

      {/* Topics as an editorial split — larger imagery, varied rhythm. */}
      <Section tight>
        <EditorialSplit
          image="/assets/paria/pages/speaking-1.jpg"
          alt="Paria Ghorashi in conversation"
          eyebrow={SPEAKING.topics.headline}
          title="Subjects She Speaks To."
        >
          <Tags items={SPEAKING.topics.items} />
        </EditorialSplit>
      </Section>

      <Section cream tight narrow>
        <Reveal>
          <p className="pg-eyebrow">{SPEAKING.requirements.headline}</p>
          <h2 className="pg-h2">What to Include in an Enquiry.</h2>
          <Checklist items={SPEAKING.requirements.items} />
        </Reveal>
      </Section>

      <CtaBand
        headline="Submit a Speaking Enquiry."
        body="Include the event, audience, format, date, and budget so the team can respond properly."
        buttons={SPEAKING.buttons}
      />
    </PageShell>
  );
}
