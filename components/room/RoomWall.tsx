"use client";

import Link from "next/link";
import { ExhibitPiece } from "@/components/exhibit/ExhibitPiece";
import { EmptyState, LoadingRoom } from "@/components/site/Notices";
import { useRoomExhibits } from "@/hooks/useMuseum";
import { countLabel } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { ROOMS, roomById } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";

/**
 * Each room hangs its exhibits a little differently, but they all share the
 * same artwork treatment, the same label, and the same spacing rhythm.
 */
const WALL_LAYOUT: Record<RoomId, string> = {
  music: "grid gap-x-10 gap-y-16 sm:grid-cols-2 md:gap-x-14 md:gap-y-20 lg:grid-cols-3",
  web: "grid gap-x-14 gap-y-20 lg:grid-cols-2",
  images: "grid gap-x-14 gap-y-24 sm:grid-cols-2 md:gap-x-20",
  objects: "grid gap-x-16 gap-y-24 sm:grid-cols-2",
  archive: "grid gap-x-14 gap-y-20 sm:grid-cols-2",
};

/** Small vertical offsets so walls never read as a table of thumbnails. */
function hangOffset(room: RoomId, index: number): string {
  if (room === "music") {
    return index % 3 === 1 ? "lg:mt-16" : "";
  }
  if (room === "objects") {
    return index % 2 === 1 ? "sm:mt-12" : "";
  }
  if (room === "archive") {
    return index % 2 === 1 ? "sm:mt-8" : "";
  }
  return "";
}

export function RoomWall({ room }: { room: RoomId }) {
  const definition = roomById(room);
  const { exhibits, ready } = useRoomExhibits(room);
  const { t, locale } = useLocale();
  const nextRoom = ROOMS[(ROOMS.findIndex((entry) => entry.id === room) + 1) % ROOMS.length];

  return (
    <div>
      <header className="pt-16 md:pt-24">
        <p className="label-caps">{t.rooms.marker(definition.numeral)}</p>
        <h1 className="mt-6 font-display text-[3rem] leading-[0.95] text-ink md:text-[4.5rem]">
          {t.rooms.names[room]}
        </h1>
        <p className="mt-7 max-w-[42ch] font-display text-lg italic leading-relaxed text-ink-soft md:text-xl">
          {t.rooms.taglines[room]}
        </p>

        <div className="label-caps mt-10 flex flex-wrap items-baseline gap-x-7 gap-y-3 text-[0.65rem] tracking-[0.18em]">
          <span>{ready ? countLabel(exhibits.length, locale) : "…"}</span>
          <Link href={`/collection?room=${room}`} className="link-quiet">
            {t.rooms.openInCollection}
          </Link>
        </div>
      </header>

      {!ready ? (
        <LoadingRoom label={t.loading.museum} />
      ) : exhibits.length === 0 ? (
        <EmptyState title={t.rooms.emptyLines[room]} line={t.rooms.emptyLine} />
      ) : (
        <div className={`mt-16 md:mt-24 ${WALL_LAYOUT[room]}`}>
          {exhibits.map((exhibit, index) => (
            <div key={exhibit.id} className={hangOffset(room, index)}>
              <ExhibitPiece exhibit={exhibit} />
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/rooms/${nextRoom.id}`}
        className="group mt-28 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-8 md:mt-36"
      >
        <span className="label-caps">{t.rooms.nextRoom}</span>
        <span className="font-display text-2xl text-ink transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-3xl">
          {t.rooms.names[nextRoom.id]}
          <span className="ml-3 text-ink-muted" aria-hidden>
            →
          </span>
        </span>
      </Link>
    </div>
  );
}
