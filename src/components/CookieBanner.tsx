"use client";

import { useEffect, useState } from "react";
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
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* storage blocked — do not nag on every load */
    }
  }, []);

  const choose = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="pg-cookie" role="dialog" aria-label="Cookie preferences">
      <p className="pg-cookie-copy">{COOKIE_BANNER.copy}</p>
      <div className="pg-cookie-actions">
        <button
          type="button"
          className="pg-btn pg-btn--primary"
          onClick={() => choose("all")}
        >
          {COOKIE_BANNER.acceptAll}
        </button>
        <button
          type="button"
          className="pg-btn pg-btn--ghost"
          onClick={() => choose("essential")}
        >
          {COOKIE_BANNER.essentialOnly}
        </button>
        <Link href="/privacy" className="pg-cookie-manage">
          {COOKIE_BANNER.managePreferences}
        </Link>
      </div>
    </div>
  );
}
