import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  ListRows,
  EditorialSplit,
  CtaBand,
  Tags,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/data/content";
import { PARTNERSHIPS } from "@/data/pages-content";

export const metadata: Metadata = {
  title: SEO.partnerships.title,
  description: SEO.partnerships.description,
};

export default function PartnershipsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Brand Partnerships & Representation"
        headline={PARTNERSHIPS.headline}
        body={PARTNERSHIPS.body}
        image="/assets/paria/pages/partners-hero.jpg"
        alt="Paria Ghorashi at Festival de Cannes"
        priority
      />

      <Section>
        <Reveal>
          <p className="pg-eyebrow">Collaboration Categories</p>
          <h2 className="pg-h2">Partnerships Built Around a Purpose.</h2>
        </Reveal>
        <ListRows items={PARTNERSHIPS.categories} />
      </Section>

      {/* Editorial break — larger imagery and varied sizes for visual rhythm. */}
      <Section tight>
        <EditorialSplit
          image="/assets/paria/pages/partners-1.jpg"
          alt="Paria Ghorashi on the red carpet"
          eyebrow={PARTNERSHIPS.deliverables.headline}
          title="What a Collaboration Can Include."
        >
          <Tags items={PARTNERSHIPS.deliverables.items} />
        </EditorialSplit>

        <EditorialSplit
          reverse
          image="/assets/paria/pages/partners-2.jpg"
          alt="Paria Ghorashi editorial portrait"
          eyebrow={PARTNERSHIPS.principles.headline}
          title="Selected Partnerships Only."
          body={PARTNERSHIPS.principles.body}
        />
      </Section>

      <CtaBand
        headline="Submit a Partnership Enquiry."
        body="Share the brand, objective, audience, format, timing, and what a successful collaboration would look like."
        buttons={PARTNERSHIPS.buttons}
      />
    </PageShell>
  );
}
