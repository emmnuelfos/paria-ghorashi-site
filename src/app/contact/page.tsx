import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PageHero, Section } from "@/components/PageSections";
import { Reveal } from "@/components/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SEO, isLive } from "@/data/content";
import { CONTACT } from "@/data/pages-content-3";

export const metadata: Metadata = {
  title: SEO.contact.title,
  description: SEO.contact.description,
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        headline={CONTACT.headline}
        body={CONTACT.body}
      />

      {/* Routes first, so the enquiry lands in the right place. */}
      <Section tight>
        <Reveal>
          <p className="pg-eyebrow">{CONTACT.routes.headline}</p>
          <h2 className="pg-h2">Find the Right Starting Point.</h2>
        </Reveal>
        <div className="pg-cards">
          {CONTACT.routes.items.map((r, i) => (
            <Reveal key={r.title} as="article" className="pg-card" delay={i * 45}>
              <h3 className="pg-h3">{r.title}</h3>
              <p className="pg-body">{r.body}</p>
              {isLive(r.href) && (
                <Link href={r.href} className="pg-card-link">
                  Go to {r.title} <span aria-hidden="true">&#8594;</span>
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </Section>

      <Section narrow id="enquiry">
        <Reveal>
          <p className="pg-eyebrow">General Enquiry</p>
          <h2 className="pg-h2">Tell Us What You Are Building.</h2>
        </Reveal>
        <Reveal delay={100}>
          <EnquiryForm />
        </Reveal>
      </Section>

      <Section cream tight narrow>
        <Reveal>
          <p className="pg-eyebrow">Direct</p>
          <ul className="pg-contact-list">
            <li>
              <span className="pg-contact-label">Email</span>
              <a href={`mailto:${CONTACT.details.email}`}>{CONTACT.details.email}</a>
            </li>
            <li>
              <span className="pg-contact-label">Instagram</span>
              <a
                href="https://instagram.com/pariaghorashi"
                target="_blank"
                rel="noreferrer"
              >
                {CONTACT.details.instagram}
              </a>
            </li>
            <li>
              <span className="pg-contact-label">LinkedIn</span>
              <a
                href="https://linkedin.com/in/pariaghorashi"
                target="_blank"
                rel="noreferrer"
              >
                {CONTACT.details.linkedin}
              </a>
            </li>
          </ul>
        </Reveal>
      </Section>
    </PageShell>
  );
}
