"use client";

import { formatExhibitDate, snippet } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import type { Exhibit } from "@/lib/types";

/** Brass-style caption plate beneath an exhibit. */
export function CaptionPlate({
  exhibit,
  compact = false,
}: {
  exhibit: Exhibit;
  compact?: boolean;
}) {
  const { t, locale } = useLocale();
  const detail = snippet(exhibit.description || exhibit.personalNote, compact ? 72 : 100);

  return (
    <figcaption className="room-caption-plate">
      <p className="room-caption-plate__title">{exhibit.title}</p>
      <p className="room-caption-plate__meta">
        {t.exhibitTypes.labels[exhibit.type]}
        <span aria-hidden> · </span>
        {formatExhibitDate(exhibit.createdAt, locale)}
      </p>
      {!compact && detail ? (
        <p className="room-caption-plate__detail">{detail}</p>
      ) : null}
    </figcaption>
  );
}

/** Small plate for empty slots — barely visible. */
export function EmptyCaptionPlate({ label }: { label: string }) {
  return (
    <figcaption className="room-caption-plate room-caption-plate--empty">
      <p className="room-caption-plate__meta">{label}</p>
    </figcaption>
  );
}
