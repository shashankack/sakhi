"use client";

import { useMemo, useState } from "react";
import { ExternalLink, ShoppingBag } from "lucide-react";
import {
  essentialsForContext,
  QUICK_COMMERCE,
  type EssentialItem,
} from "@/lib/essentials";

type Props = {
  themeIds?: string[];
  urgent?: boolean;
  className?: string;
};

export function EssentialsOffer({
  themeIds = [],
  urgent = false,
  className = "",
}: Props) {
  const items = useMemo(
    () => essentialsForContext({ themeIds, urgent }),
    [themeIds, urgent],
  );
  const [active, setActive] = useState<EssentialItem | null>(null);

  return (
    <section
      className={`essentials-panel${urgent ? " essentials-panel-urgent" : ""} ${className}`.trim()}
      aria-label="Optional essentials via quick commerce"
    >
      <header className="essentials-head">
        <div className="section-label">
          <ShoppingBag aria-hidden="true" size={15} />
          Essentials (optional)
        </div>
        <span className="essentials-badge">Future-ready</span>
      </header>

      <p className="essentials-note">
        Aai can open Blinkit, Zepto, or Instamart search for comfort
        essentials. We do <strong>not</strong> place orders or recommend
        medicines as treatment  you choose what to buy.
      </p>

      <ul className="essentials-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`essentials-item${active?.id === item.id ? " is-active" : ""}`}
              onClick={() =>
                setActive((current) => (current?.id === item.id ? null : item))
              }
              aria-expanded={active?.id === item.id}
            >
              <strong>{item.label}</strong>
              <span>{item.why}</span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div className="essentials-partners" role="group" aria-label={`Open ${active.label} in quick commerce`}>
          <p className="essentials-partners-label">
            Open “{active.query}” in:
          </p>
          <div className="essentials-partner-row">
            {QUICK_COMMERCE.map((partner) => (
              <a
                key={partner.id}
                className="essentials-partner-link"
                href={partner.searchUrl(active.query)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {partner.name}
                <ExternalLink aria-hidden="true" size={12} />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="essentials-hint">Tap an item to choose an app.</p>
      )}
    </section>
  );
}
