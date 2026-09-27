"use client";

import type { ReactNode } from "react";
import type { GalleryStop } from "@/lib/gallery/stops";
import { themeForStop, themeToStyle } from "@/lib/gallery/room-themes";

/** Full-bleed exhibition room — walls, floor, ceiling, perspective. No central card. */
export function RoomShell({
  stop,
  children,
  header,
}: {
  stop: GalleryStop;
  header?: ReactNode;
  children: ReactNode;
}) {
  const theme = themeForStop(stop);

  return (
    <section
      className={`room-shell room-shell--${stop} room-shell--floor-${theme.floorKind}`}
      style={themeToStyle(theme)}
      data-stop={stop}
    >
      <div className="room-shell__void" aria-hidden />

      <div className="room-shell__scene">
        <div className="room-shell__ceiling" aria-hidden>
          <div className="room-shell__ceiling-molding" />
        </div>

        <div className="room-shell__wall room-shell__wall--left" aria-hidden />
        <div className="room-shell__wall room-shell__wall--right" aria-hidden />
        <div className="room-shell__passage room-shell__passage--left" aria-hidden />
        <div className="room-shell__passage room-shell__passage--right" aria-hidden />

        <div className="room-shell__wall room-shell__wall--back">
          <div className="room-shell__ambient" aria-hidden />
          <div className="room-shell__wash" aria-hidden />

          {header ? <div className="room-shell__header">{header}</div> : null}

          <div className="room-shell__content">{children}</div>

          <div className="room-shell__baseboard" aria-hidden />
        </div>

        <div className="room-shell__floor" aria-hidden>
          <div className="room-shell__floor-sheen" />
        </div>
      </div>
    </section>
  );
}
