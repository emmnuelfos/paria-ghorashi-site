import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  ListRows,
  CtaBand,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/data/content";
import { MEDIA } from "@/data/pages-content-2";

export const metadata: Metadata = {
  title: SEO.media.title,
  description: SEO.media.description,
};

export default function MediaPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Media & Recognition"
        headline={MEDIA.headline}
        body={MEDIA.body}
        image="/assets/paria/pages/partners-3.jpg"
        alt="Paria Ghorashi"
        priority
      />

      <Section>
        <Reveal>
          <p className="pg-eyebrow">{MEDIA.categories.headline}</p>
          <h2 className="pg-h2">Where the Story Appears.</h2>
        </Reveal>
        <ListRows items={MEDIA.categories.items} />
      </Section>

      {/* Publications as wordmarks, not logos — see the note in the data file:
          the master forbids implying editorial endorsement, and every feature
          must be verified before this goes public. */}
      <Section cream tight>
        <Reveal>
          <p className="pg-eyebrow">{MEDIA.asSeenIn.headline}</p>
          <h2 className="pg-h2">Featured Internationally and Regionally.</h2>
          <ul className="pg-wordmarks">
            {MEDIA.asSeenIn.items.map((m) => (
              <li key={m} className="pg-wordmark">
                {m}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section narrow tight>
        <Reveal>
          <p className="pg-eyebrow">Media Enquiries</p>
          <p className="pg-body pg-body--lead">{MEDIA.enquiries}</p>
        </Reveal>
      </Section>

      <CtaBand
        headline="Make a Media Enquiry."
        buttons={MEDIA.buttons}
      />
    </PageShell>
  );
}
