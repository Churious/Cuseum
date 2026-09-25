"use client";

import { useMuseumStats } from "@/hooks/useMuseum";
import { countLabel, formatMonthYear } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";

/** A single quiet line of information. Never a statistic card. */
export function CollectionPlaque() {
  const { total, firstCollectedAt, ready } = useMuseumStats();
  const { t, locale } = useLocale();

  if (!ready || total === 0) {
    return null;
  }

  return (
    <p className="label-caps breathe-in">
      {countLabel(total, locale)}
      {firstCollectedAt !== null ? (
        <>
          <span className="mx-2 text-line-strong" aria-hidden>
            ·
          </span>
          {t.lobby.collectedSince(formatMonthYear(firstCollectedAt, locale))}
        </>
      ) : null}
    </p>
  );
}
