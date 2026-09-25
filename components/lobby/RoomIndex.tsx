"use client";

import Link from "next/link";
import { useMuseum } from "@/hooks/useMuseum";
import { countLabel } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { selectExhibitsByRoom, selectMuseumStats } from "@/lib/museumStore";
import { ROOMS } from "@/lib/rooms";
import type { Exhibit } from "@/lib/types";

/**
 * The room index of the building. Entrances are listed like a wayfinding sign
 * rather than a grid of cards: numeral, name, one line, and a glimpse of what
 * is hanging inside.
 */
export function RoomIndex() {
  const { exhibits, ready } = useMuseum();
  const { t, locale } = useLocale();
  const stats = selectMuseumStats(exhibits);

  return (
    <div className="border-t border-line">
      {ROOMS.map((room) => {
        const count = stats.byRoom[room.id];
        const preview =
          ready && exhibits.length > 0 ? newestWithImage(exhibits, room.id) : undefined;

        return (
          <Link
            key={room.id}
            href={`/rooms/${room.id}`}
            className="group flex items-baseline gap-4 border-b border-line py-7 transition-colors duration-500 md:gap-8 md:py-9"
          >
            <span className="label-caps w-4 shrink-0 md:w-5">{room.numeral}</span>

            <span className="min-w-0 flex-1">
              <span className="block font-display text-[1.7rem] leading-none text-ink transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-[2.5rem]">
                {t.rooms.names[room.id]}
              </span>
              <span className="mt-3 block text-sm italic text-ink-muted">
                {t.rooms.taglines[room.id]}
              </span>
            </span>

            <span className="hidden shrink-0 md:block" aria-hidden>
              {preview ? (
                <img
                  src={preview.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-[84px] w-[132px] object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              ) : (
                <span className="block h-[84px] w-[132px] border border-line/70" />
              )}
            </span>

            <span className="label-caps w-[5.25rem] shrink-0 text-right text-[0.58rem] tracking-[0.1em] md:w-28 md:text-[0.68rem] md:tracking-[0.16em]">
              {ready
                ? count === 0
                  ? t.count.emptyRoom
                  : countLabel(count, locale)
                : "…"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function newestWithImage(
  exhibits: readonly Exhibit[],
  room: Exhibit["room"],
): Exhibit | undefined {
  return selectExhibitsByRoom(exhibits, room).find(
    (exhibit) => exhibit.imageUrl.length > 0,
  );
}
