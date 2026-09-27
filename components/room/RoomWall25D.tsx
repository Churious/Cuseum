"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ExhibitPiece } from "@/components/exhibit/ExhibitPiece";
import { EmptyState, LoadingRoom } from "@/components/site/Notices";
import { useDesktopMuseum } from "@/hooks/useDesktopMuseum";
import { useRoomExhibits } from "@/hooks/useMuseum";
import { countLabel } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { ROOMS, roomById } from "@/lib/rooms";
import {
  SCENE_SLOT_LIMIT,
  sceneBackdropForRoom,
  slotLayoutForIndex,
} from "@/lib/scene25d/room-slots";
import type { RoomId } from "@/lib/types";

/** Desktop isometric room wall — CSS transforms and SVG backdrop only. */
export function RoomWall25D({ room }: { room: RoomId }) {
  const definition = roomById(room);
  const { exhibits, ready } = useRoomExhibits(room);
  const { t, locale } = useLocale();
  const desktopMuseum = useDesktopMuseum();
  const stageRef = useRef<HTMLDivElement>(null);
  const nextRoom = ROOMS[(ROOMS.findIndex((entry) => entry.id === room) + 1) % ROOMS.length];

  const visible = exhibits.slice(0, SCENE_SLOT_LIMIT);
  const overflow = exhibits.length > SCENE_SLOT_LIMIT;

  useEffect(() => {
    if (!desktopMuseum) {
      return;
    }

    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    let frame = 0;
    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = stage.getBoundingClientRect();
        const viewportMid = window.innerHeight * 0.5;
        const offset = (rect.top - viewportMid) * 0.04;
        stage.style.setProperty("--scene-parallax", `${offset}px`);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [desktopMuseum, ready]);

  return (
    <div className="scene-25d">
      <header className="scene-25d__header pt-16 md:pt-20">
        <p className="label-caps">{t.rooms.marker(definition.numeral)}</p>
        <h1 className="mt-6 font-display text-[3rem] leading-[0.95] text-ink md:text-[4.2rem]">
          {t.rooms.names[room]}
        </h1>
        <p className="mt-7 max-w-[42ch] font-display text-lg italic leading-relaxed text-ink-soft">
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
        <div
          ref={stageRef}
          className={`scene-25d__stage scene-25d__stage--${room} mt-12 md:mt-16`}
        >
          <img
            src={sceneBackdropForRoom(room)}
            alt=""
            className="scene-25d__backdrop"
            decoding="async"
          />

          <ul className="scene-25d__slots" aria-label={t.rooms.names[room]}>
            {visible.map((exhibit, index) => {
              const slot = slotLayoutForIndex(room, index);
              return (
                <li
                  key={exhibit.id}
                  className="scene-slot"
                  style={{
                    left: slot.left,
                    top: slot.top,
                    width: slot.width,
                    zIndex: slot.zIndex,
                    transform: [
                      slot.translateY ? `translateY(${slot.translateY})` : "",
                      slot.rotate ? `rotate(${slot.rotate})` : "",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined,
                  }}
                >
                  <ExhibitPiece exhibit={exhibit} />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {overflow ? (
        <p className="label-caps mt-8 text-[0.65rem] tracking-[0.18em]">
          <Link href={`/collection?room=${room}`} className="link-quiet">
            {t.rooms.openInCollection}
          </Link>
        </p>
      ) : null}

      <Link
        href={`/rooms/${nextRoom.id}`}
        className="group mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-8 md:mt-28"
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
