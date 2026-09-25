"use client";

import Link from "next/link";
import { useState } from "react";
import { formatExhibitDate, hostnameOf } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { withdrawExhibit } from "@/lib/museumStore";
import type { Exhibit } from "@/lib/types";

/**
 * One line in the collection list. Administrative, but still printed in the
 * museum's own type: no coloured badges, no icons.
 */
export function CollectionRow({ exhibit }: { exhibit: Exhibit }) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const { t, locale } = useLocale();
  const source = hostnameOf(exhibit.url);

  async function remove() {
    setRemoving(true);
    try {
      await withdrawExhibit(exhibit.id);
    } catch {
      setRemoving(false);
      setConfirming(false);
    }
  }

  return (
    <li className="border-b border-line">
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4 py-6">
        <span className="block h-[54px] w-[80px] shrink-0 overflow-hidden bg-paper-deep ring-1 ring-line">
          {exhibit.imageUrl ? (
            <img
              src={exhibit.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : null}
        </span>

        <div className="min-w-[13rem] flex-1">
          <Link
            href={`/exhibit/${exhibit.id}`}
            className="font-display text-lg leading-snug text-ink transition-colors duration-300 hover:text-ink-soft"
          >
            {exhibit.title}
          </Link>
          <p className="label-caps mt-2 text-[0.6rem] tracking-[0.16em]">
            {t.rooms.names[exhibit.room]}
            <Sep />
            {t.exhibitTypes.labels[exhibit.type]}
            <Sep />
            {t.displayStyles.labels[exhibit.displayStyle]}
            <Sep />
            {formatExhibitDate(exhibit.createdAt, locale)}
            {source ? (
              <>
                <Sep />
                {source}
              </>
            ) : null}
          </p>
        </div>

        <div className="label-caps flex items-baseline gap-x-7 text-[0.6rem] tracking-[0.16em]">
          <Link href={`/exhibit/${exhibit.id}/edit`} className="link-quiet">
            {t.collection.edit}
          </Link>
          {confirming ? (
            <>
              <button
                type="button"
                onClick={() => void remove()}
                disabled={removing}
                className="border-b border-clay pb-0.5 text-clay"
              >
                {removing ? t.collection.removing : t.collection.removeConfirm}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="link-quiet"
              >
                {t.collection.keep}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="link-quiet"
            >
              {t.collection.remove}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function Sep() {
  return (
    <span className="mx-2 text-line-strong" aria-hidden>
      ·
    </span>
  );
}
