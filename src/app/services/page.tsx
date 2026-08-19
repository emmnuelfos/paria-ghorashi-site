import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  CapabilityAccordion,
  CtaBand,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/data/content";
import { SERVICES } from "@/data/pages-content-2";

export const metadata: Metadata = {
  title: SEO.services.title,
  description: SEO.services.description,
};

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Strategic Services"
        headline={SERVICES.headline}
        body={SERVICES.body}
        image="/assets/paria/pages/editorial-cafe.jpg"
        alt="Paria Ghorashi"
        priority
      />

      <Section>
        <Reveal>
          <p className="pg-eyebrow">Capabilities</p>
          <h2 className="pg-h2">Ten Connected Disciplines.</h2>
          <p className="pg-body">
            Select a capability to see what it includes.
          </p>
        </Reveal>
        <CapabilityAccordion items={SERVICES.capabilities} />
      </Section>

      <CtaBand
        headline="Discuss Your Project."
        body="Share the business, objective, timing, and where you need support."
        buttons={SERVICES.buttons}
      />
    </PageShell>
  );
}
