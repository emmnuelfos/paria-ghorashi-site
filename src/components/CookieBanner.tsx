"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { COOKIE_BANNER } from "@/data/pages-content-3";

const KEY = "pg-cookie-consent";

/**
 * Cookie consent banner. Copy verbatim from the master.
 *
 * The choice is stored locally and nothing analytics-related loads until
 * consent is given — the master's checklist says to connect analytics only
 * after consent, so this records the decision rather than merely dismissing a
 * notice. "Manage Preferences" is intentionally a link to the privacy page
 * until a real preference centre exists; a button that does nothing is worse
 * than one that explains.
 *
 * WHY THIS IS A PORTAL, AND WHY IT NEVER UNMOUNTS
 *
 * Consent banners are the single most common thing browser extensions delete
 * from a page. Previously this rendered as a direct sibling of the page tree
 * inside <body>, so when an extension removed it React's record of that
 * sibling went stale, and the next client-side navigation died in the commit
 * phase with:
 *
 *   NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before
 *   which the new node is to be inserted is not a child of this node.
 *
 * which Chrome renders as a blank "This page couldn't load" screen. Every link
 * in the site was affected, and only for people running such an extension —
 * which is why it never showed up in testing against a clean browser.
 *
 * Two things make that survivable:
 *   1. It renders into its own container appended outside React's managed
 *      children, so removing the banner cannot invalidate the sibling
 *      positions React uses to insert the next page.
 *   2. It is never conditionally unmounted. Visibility is a class toggle, so
 *      React only ever sets attributes — and setting an attribute on a node
 *      some extension has already detached is harmless, where removing one
 *      throws.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-pg-consent-root", "");
    document.body.appendChild(el);
    hostRef.current = el;
    setHost(el);

    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* storage blocked — do not nag on every load */
    }

    return () => {
      // Our own node, appended by us: safe to remove, and guarded in case
      // something else got there first.
      if (el.parentNode) el.parentNode.removeChild(el);
      hostRef.current = null;
    };
  }, []);

  const choose = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!host) return null;

  return createPortal(
    <div
      className={`pg-cookie${visible ? "" : " pg-cookie--hidden"}`}
      role="dialog"
      aria-label="Cookie preferences"
      aria-hidden={visible ? undefined : true}
    >
      <p className="pg-cookie-copy">{COOKIE_BANNER.copy}</p>
      <div className="pg-cookie-actions">
        <button
          type="button"
          className="pg-btn pg-btn--primary"
          onClick={() => choose("all")}
          tabIndex={visible ? undefined : -1}
        >
          {COOKIE_BANNER.acceptAll}
        </button>
        <button
          type="button"
          className="pg-btn pg-btn--ghost"
          onClick={() => choose("essential")}
          tabIndex={visible ? undefined : -1}
        >
          {COOKIE_BANNER.essentialOnly}
        </button>
        <Link
          href="/privacy"
          className="pg-cookie-manage"
          tabIndex={visible ? undefined : -1}
        >
          {COOKIE_BANNER.managePreferences}
        </Link>
      </div>
    </div>,
    host,
  );
}
