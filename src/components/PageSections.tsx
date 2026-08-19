import Link from "next/link";
import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import { Reveal } from "@/components/Reveal";
import { isLive } from "@/data/content";

export interface Btn {
  label: string;
  href: string;
}

/** Buttons: first is primary, the rest ghost. Consistent sizing site-wide. */
export function Buttons({ items, center }: { items: Btn[]; center?: boolean }) {
  // Pages ship in batches; never render a CTA to a route that does not exist
  // yet. They reappear automatically as each route is added to LIVE_ROUTES.
  items = (items ?? []).filter((b) => isLive(b.href));
  if (!items.length) return null;
  return (
    <div className="pg-btn-row" style={center ? { justifyContent: "center" } : undefined}>
      {items.map((b, i) => (
        <Link
          key={b.href + b.label}
          href={b.href}
          className={`pg-btn ${i === 0 ? "pg-btn--primary" : "pg-btn--ghost"}`}
        >
          {b.label}
        </Link>
      ))}
    </div>
  );
}

export function Section({
  children,
  cream,
  tight,
  narrow,
  id,
}: {
  children: ReactNode;
  cream?: boolean;
  tight?: boolean;
  narrow?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`pg-section${cream ? " pg-section--cream" : ""}${tight ? " pg-section--tight" : ""}`}
    >
      <div className={`pg-inner${narrow ? " pg-inner--narrow" : ""}`}>{children}</div>
    </section>
  );
}

/** Page hero: eyebrow, large headline, lead copy, buttons, and a large image. */
export function PageHero({
  eyebrow,
  headline,
  body = [],
  buttons = [],
  image,
  alt = "",
  priority,
}: {
  eyebrow?: string;
  headline: string;
  body?: string[];
  buttons?: Btn[];
  image?: string;
  alt?: string;
  priority?: boolean;
}) {
  const copy = (
    <div>
      {eyebrow && <p className="pg-eyebrow">{eyebrow}</p>}
      <h1 className="pg-h1">{headline}</h1>
      {body.length > 0 && (
        <div className="pg-hero-body">
          {body.map((p, i) => (
            <p key={i} className={`pg-body${i === 0 ? " pg-body--lead" : ""}`}>
              {p}
            </p>
          ))}
        </div>
      )}
      <Buttons items={buttons} />
    </div>
  );

  return (
    <section className="pg-hero">
      <div className="pg-hero-inner">
        {image ? (
          <div className="pg-hero-grid">
            <Reveal>{copy}</Reveal>
            <Reveal delay={140}>
              <figure className="pg-hero-figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(image)}
                  alt={alt}
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                />
              </figure>
            </Reveal>
          </div>
        ) : (
          <Reveal>{copy}</Reveal>
        )}
      </div>
    </section>
  );
}

/**
 * Alternating image/text row. The brief asks for image-left/text-right then
 * reversed, to create movement down the page; `reverse` flips it on desktop
 * while mobile always stacks.
 */
export function EditorialSplit({
  image,
  alt = "",
  eyebrow,
  title,
  body = [],
  buttons = [],
  reverse,
  children,
}: {
  image: string;
  alt?: string;
  eyebrow?: string;
  title?: string;
  body?: string[];
  buttons?: Btn[];
  reverse?: boolean;
  children?: ReactNode;
}) {
  return (
    <Reveal as="div" className={`pg-split${reverse ? " pg-split--reverse" : ""}`}>
      <figure className="pg-split-figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(image)} alt={alt} loading="lazy" decoding="async" />
      </figure>
      <div>
        {eyebrow && <p className="pg-eyebrow">{eyebrow}</p>}
        {title && <h2 className="pg-h2">{title}</h2>}
        {body.map((p, i) => (
          <p key={i} className="pg-body">
            {p}
          </p>
        ))}
        {children}
        <Buttons items={buttons} />
      </div>
    </Reveal>
  );
}

/** Numbered editorial rows — used for service lists and journey chapters. */
export function ListRows({
  items,
  numbered = true,
}: {
  items: { title: string; body: string }[];
  numbered?: boolean;
}) {
  return (
    <div className="pg-list">
      {items.map((it, i) => (
        <Reveal key={it.title} as="div" className="pg-list-item" delay={i * 40}>
          {numbered && (
            <span className="pg-list-index">{String(i + 1).padStart(2, "0")}</span>
          )}
          <h3 className="pg-h3">{it.title}</h3>
          <p className="pg-body">{it.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** Card grid — engagements, collaboration types, media categories. */
export function CardGrid({
  items,
  cols3,
}: {
  items: {
    title: string;
    body: string;
    terms?: string;
    button?: Btn;
  }[];
  cols3?: boolean;
}) {
  return (
    <div className={`pg-cards${cols3 ? " pg-cards--3" : ""}`}>
      {items.map((it, i) => (
        <Reveal key={it.title} as="article" className="pg-card" delay={i * 50}>
          <h3 className="pg-h3">{it.title}</h3>
          <p className="pg-body">{it.body}</p>
          {it.terms && <p className="pg-card-terms">{it.terms}</p>}
          {it.button && isLive(it.button.href) && (
            <Link href={it.button.href} className="pg-card-link">
              {it.button.label} <span aria-hidden="true">&#8594;</span>
            </Link>
          )}
        </Reveal>
      ))}
    </div>
  );
}

export function QuoteBlock({ quote, cite }: { quote: string; cite?: string }) {
  return (
    <Reveal as="section" className="pg-quote">
      <blockquote className="pg-quote-text">{quote}</blockquote>
      {cite && <p className="pg-quote-cite">{cite}</p>}
    </Reveal>
  );
}

export function CtaBand({
  headline,
  body,
  buttons = [],
}: {
  headline: string;
  body?: string;
  buttons?: Btn[];
}) {
  return (
    <Reveal as="section" className="pg-cta">
      <h2 className="pg-h2">{headline}</h2>
      {body && <p className="pg-body">{body}</p>}
      <Buttons items={buttons} center />
    </Reveal>
  );
}

export function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="pg-tags">
      {items.map((t) => (
        <li key={t} className="pg-tag">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="pg-checklist">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
