import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  EditorialSplit,
  ListRows,
  CtaBand,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/data/content";
import { VENTURES } from "@/data/pages-content-2";

export const metadata: Metadata = {
  title: SEO.ventures.title,
  description: SEO.ventures.description,
};

export default function VenturesPage() {
  // The first three ventures carry the story; alternate them as editorial
  // splits, then list the rest so the page keeps rhythm without repetition.
  const [first, second, third, ...rest] = VENTURES.items;

  return (
    <PageShell>
      <PageHero
        eyebrow="Ventures & Experience"
        headline={VENTURES.headline}
        body={VENTURES.body}
        image="/assets/paria/pages/editorial-car.jpg"
        alt="Paria Ghorashi"
        priority
      />

      <Section>
        <EditorialSplit
          image="/assets/paria/ventures/blowoutandgo.jpg"
          alt="blowout&go"
          eyebrow="Est. 2012"
          title={first.title}
          body={[first.body]}
        />
        <EditorialSplit
          reverse
          image="/assets/paria/ventures/bgx.jpg"
          alt="bgX"
          eyebrow="Est. 2016"
          title={second.title}
          body={[second.body]}
        />
        <EditorialSplit
          image="/assets/paria/ventures/madeforyou.jpg"
          alt="Made For You Global"
          eyebrow="Est. 2022"
          title={third.title}
          body={[third.body]}
        />
      </Section>

      <Section cream tight>
        <Reveal>
          <p className="pg-eyebrow">Also</p>
          <h2 className="pg-h2">The Work Continuing Today.</h2>
        </Reveal>
        <ListRows items={rest} numbered={false} />
      </Section>

      <CtaBand
        headline="Let’s Build Something Meaningful."
        body="For advisory, consulting, brand partnerships, speaking, media, events, and business development enquiries."
        buttons={[
          { label: "Start a Conversation", href: "/contact" },
          { label: "Book a Consultation", href: "/consultation" },
        ]}
      />
    </PageShell>
  );
}
