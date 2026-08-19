import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  PageHero,
  Section,
  Checklist,
  Tags,
} from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { ConsultationForm } from "@/components/ConsultationForm";
import { SEO } from "@/data/content";
import { CONSULTATION } from "@/data/pages-content";

export const metadata: Metadata = {
  title: SEO.consultation.title,
  description: SEO.consultation.description,
};

export default function ConsultationPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow={CONSULTATION.eyebrow}
        headline={CONSULTATION.headline}
        body={CONSULTATION.body}
        buttons={[{ label: "Apply to Book Your Session", href: "#booking" }]}
        image="/assets/paria/pages/consult-hero.jpg"
        alt="Paria Ghorashi"
        priority
      />

      {/* Fee and duration, stated plainly — this is the commercial promise. */}
      <Section tight>
        <Reveal>
          <div className="pg-facts">
            <div className="pg-fact">
              <span className="pg-fact-value">{CONSULTATION.fee}</span>
              <span className="pg-fact-label">Session fee</span>
            </div>
            <div className="pg-fact">
              <span className="pg-fact-value">{CONSULTATION.duration}</span>
              <span className="pg-fact-label">Duration</span>
            </div>
            <div className="pg-fact">
              <span className="pg-fact-value">Private</span>
              <span className="pg-fact-label">One-to-one video call</span>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section narrow>
        <Reveal>
          <p className="pg-eyebrow">{CONSULTATION.purpose.headline}</p>
          <h2 className="pg-h2">Practical, Focused, and Built Around You.</h2>
          {CONSULTATION.purpose.body.map((p, i) => (
            <p key={i} className="pg-body">
              {p}
            </p>
          ))}
        </Reveal>
      </Section>

      <Section cream tight>
        <div className="pg-two-col">
          <Reveal>
            <p className="pg-eyebrow">{CONSULTATION.areas.headline}</p>
            <Checklist items={CONSULTATION.areas.items} />
          </Reveal>
          <Reveal delay={120}>
            <p className="pg-eyebrow">{CONSULTATION.included.headline}</p>
            <Checklist items={CONSULTATION.included.items} />
          </Reveal>
        </div>
      </Section>

      <Section tight>
        <Reveal>
          <p className="pg-eyebrow">{CONSULTATION.suits.headline}</p>
          <h2 className="pg-h2">Built for People Making Decisions.</h2>
          <Tags items={CONSULTATION.suits.items} />
        </Reveal>
      </Section>

      {/* Booking terms before the form — the client must see them first. */}
      <Section narrow tight>
        <Reveal>
          <p className="pg-eyebrow">{CONSULTATION.terms.headline}</p>
          <Checklist items={CONSULTATION.terms.items} />
        </Reveal>
      </Section>

      <Section id="booking" narrow>
        <Reveal>
          <p className="pg-eyebrow">Application</p>
          <h2 className="pg-h2">Apply to Book Your Session.</h2>
          <p className="pg-body">
            Your request is reviewed before booking. Once approved, the team will
            contact you with payment and scheduling details.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <ConsultationForm />
        </Reveal>
      </Section>
    </PageShell>
  );
}
