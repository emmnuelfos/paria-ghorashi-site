"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { ArrowRightIcon, ArrowUpLeftIcon, SparkleIcon } from "@/components/icons";

/** Per-char glyph rendering: arrow placeholders become inline SVGs. */
function charNode(ch: string): ReactNode {
  if (ch === "\u{1F87A}" || ch === "\u{1F872}") return <ArrowRightIcon />;
  if (ch === "\u{1F87C}") return <ArrowUpLeftIcon />;
  if (ch === "\u{1F7A3}") return <SparkleIcon />;
  if (ch === " ") return " ";
  return ch;
}

interface CharRollProps {
  text: string;
  href?: string;
  ariaLabel?: string;
  className?: string;
  external?: boolean;
  /** Render spaces as fixed-width gaps (contact/footer variant) */
  spaceGaps?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * The site-wide "chr-hover" letter-roll link: each character is duplicated in a
 * masked wrapper; on hover both copies translate up with a per-char delay
 * (0.6s cubic-bezier(.87,0,.13,1), delay = i * 28ms — handled in CSS).
 */
export function CharRoll({
  text,
  href,
  ariaLabel,
  className = "",
  external = false,
  spaceGaps = false,
  onClick,
}: CharRollProps) {
  const chars = useMemo(() => [...text], [text]);

  const content = chars.map((ch, i) => {
    if (spaceGaps && ch === " ") {
      return (
        <span
          key={i}
          style={{ width: "0.35em", display: "inline-block" }}
          aria-hidden="true"
        >
          {" "}
        </span>
      );
    }
    const node = charNode(ch);
    return (
      <span
        key={i}
        className="ch-wrap"
        style={{ "--i": i } as CSSProperties}
        aria-hidden="true"
      >
        <span className="ch-top">{node}</span>
        <span className="ch-bot">{node}</span>
      </span>
    );
  });

  if (href) {
    return (
      <a
        className={`chr-hover ${className}`.trim()}
        href={href}
        aria-label={ariaLabel ?? text}
        onClick={onClick}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <span
      className={`chr-hover ${className}`.trim()}
      aria-label={ariaLabel ?? text}
      onClick={onClick}
    >
      {content}
    </span>
  );
}
