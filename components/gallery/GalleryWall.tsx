"use client";

import Link from "next/link";
import { TakeMeSomewhere } from "@/components/lobby/TakeMeSomewhere";
import { useRoomExhibits } from "@/hooks/useMuseum";
import { countLabel } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { ROOM_GALLERY_SLOTS } from "@/lib/gallery/slots";
import type { GalleryStop } from "@/lib/gallery/stops";
import { ROOMS, roomById } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";
import { ExhibitFrame } from "./ExhibitFrame";
import { MuseumGalleryError } from "./MuseumGalleryError";
import { RoomShell } from "./RoomShell";

export function GalleryWall({ stop }: { stop: GalleryStop }) {
  if (stop === "lobby") {
    return <LobbyGalleryWall />;
  }
  return <RoomGalleryWall room={stop} />;
}

function LobbyGalleryWall() {
  const { t } = useLocale();

  return (
    <RoomShell
      stop="lobby"
      header={
        <div className="room-header">
          <p className="room-header__eyebrow">{t.gallery.lobbyEyebrow}</p>
          <h2 className="room-header__title">{t.brand.name}</h2>
          <p className="room-header__tagline">{t.brand.tagline}</p>
        </div>
      }
    >
      <ul className="room-lobby-doors">
        {ROOMS.map((room) => (
          <li key={room.id}>
            <Link href={`/rooms/${room.id}`} className="room-lobby-door group">
              <span className="room-lobby-door__numeral">{room.numeral}</span>
              <span className="room-lobby-door__name">{t.rooms.names[room.id]}</span>
              <span className="room-lobby-door__tagline">{t.rooms.taglines[room.id]}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="room-lobby-note">{t.lobby.privacy}</p>

      <div className="room-lobby-walk">
        <TakeMeSomewhere />
      </div>
    </RoomShell>
  );
}

function RoomGalleryWall({ room }: { room: RoomId }) {
  const definition = roomById(room);
  const { exhibits, ready } = useRoomExhibits(room);
  const { t, locale } = useLocale();
  const slots = ROOM_GALLERY_SLOTS[room];
  const displayExhibits = ready ? exhibits : [];

  return (
    <RoomShell
      stop={room}
      header={
        <div className="room-header">
          <p className="room-header__eyebrow">{t.rooms.marker(definition.numeral)}</p>
          <h2 className="room-header__title">{t.rooms.names[room]}</h2>
          <p className="room-header__tagline">{t.rooms.taglines[room]}</p>
          <p className="room-header__meta">
            {ready ? countLabel(exhibits.length, locale) : "—"}
            <span aria-hidden> · </span>
            <Link href={`/collection?room=${room}`} className="room-header__link">
              {t.rooms.openInCollection}
            </Link>
          </p>
        </div>
      }
    >
      <ul className="room-hang" aria-label={t.rooms.names[room]}>
        {slots.map((slot, index) => (
          <li
            key={`${room}-${slot.col}-${slot.row}`}
            className="room-hang__cell"
            style={{ gridColumn: slot.col, gridRow: slot.row }}
          >
            <ExhibitFrame
              exhibit={displayExhibits[index]}
              presentation={slot.presentation}
              rotate={slot.rotate}
            />
          </li>
        ))}
      </ul>

      {ready && exhibits.length === 0 ? (
        <p className="room-preparing-note">{t.gallery.preparingRoom}</p>
      ) : null}
    </RoomShell>
  );
}

export function GalleryWallWithError({ error }: { error: string }) {
  return <MuseumGalleryError message={error} />;
}
