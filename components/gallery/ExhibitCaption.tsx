"use client";

import { formatExhibitDate, snippet } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import type { Exhibit } from "@/lib/types";

export function ExhibitCaption({
  exhibit,
  compact = false,
}: {
  exhibit: Exhibit;
  compact?: boolean;
}) {
  const { t, locale } = useLocale();
  const detail = snippet(exhibit.description || exhibit.personalNote, compact ? 80 : 120);

  return (
    <figcaption className="museum-caption">
      <p className="museum-caption__title">{exhibit.title}</p>
      <p className="museum-caption__meta">
        {t.exhibitTypes.labels[exhibit.type]}
        <span aria-hidden> · </span>
        {formatExhibitDate(exhibit.createdAt, locale)}
      </p>
      {!compact && detail ? (
        <p className="museum-caption__detail">{detail}</p>
      ) : null}
    </figcaption>
  );
}
