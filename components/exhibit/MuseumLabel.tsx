"use client";

import { formatExhibitDate, hostnameOf } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import type { Exhibit } from "@/lib/types";

/**
 * The small printed card that sits beside a work.
 * Terms in small caps, values in quiet sans-serif.
 */
export function MuseumLabel({ exhibit }: { exhibit: Exhibit }) {
  const { t, locale } = useLocale();
  const source = hostnameOf(exhibit.url);

  return (
    <div className="max-w-[36ch]">
      <div className="border-t border-line pt-7">
        <h1 className="font-display text-3xl leading-[1.15] text-ink md:text-4xl">
          {exhibit.title}
        </h1>
      </div>

      <dl className="mt-9 space-y-5">
        <LabelRow term={t.exhibit.labelType} value={t.exhibitTypes.labels[exhibit.type]} />
        <LabelRow
          term={t.exhibit.labelAdded}
          value={formatExhibitDate(exhibit.createdAt, locale)}
        />
        <LabelRow term={t.exhibit.labelRoom} value={t.rooms.names[exhibit.room]} />
        {source ? <LabelRow term={t.exhibit.labelSource} value={source} /> : null}
      </dl>

      {exhibit.description ? (
        <p className="mt-9 border-t border-line pt-6 text-sm leading-relaxed text-ink-soft">
          {exhibit.description}
        </p>
      ) : null}

      {exhibit.personalNote ? (
        <figure className="mt-9 border-l border-line pl-5">
          <figcaption className="label-caps">{t.exhibit.whyHere}</figcaption>
          <blockquote className="mt-3 font-display text-lg italic leading-relaxed text-ink">
            {exhibit.personalNote}
          </blockquote>
        </figure>
      ) : null}
    </div>
  );
}

function LabelRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-line pb-4">
      <dt className="label-caps">{term}</dt>
      <dd className="text-sm text-ink-soft">{value}</dd>
    </div>
  );
}
