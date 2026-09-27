"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  CollectionPrompt,
  LobbyHero,
  RoomsHeading,
} from "@/components/lobby/LobbyText";
import { TakeMeSomewhere } from "@/components/lobby/TakeMeSomewhere";
import { CollectionPlaque } from "@/components/lobby/CollectionPlaque";
import { useDesktopMuseum } from "@/hooks/useDesktopMuseum";
import { useMuseum } from "@/hooks/useMuseum";
import { countLabel } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { LOBBY_ENTRANCES } from "@/lib/scene25d/lobby-entrances";
import { selectMuseumStats } from "@/lib/museumStore";
import { ROOMS, roomById } from "@/lib/rooms";

/** Desktop isometric lobby — room entrances are plain Links over the SVG scene. */
export function LobbyScene25D() {
  const desktopMuseum = useDesktopMuseum();
  const stageRef = useRef<HTMLDivElement>(null);
  const { exhibits, ready } = useMuseum();
  const { t, locale } = useLocale();
  const stats = selectMuseumStats(exhibits);

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
        const offset = (rect.top - viewportMid) * 0.03;
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
  }, [desktopMuseum]);

  return (
    <>
      <LobbyHero />

      <section aria-labelledby="rooms-heading" className="pt-2">
        <RoomsHeading />

        <div ref={stageRef} className="scene-25d__stage scene-25d__stage--lobby mt-8">
          <img
            src="/scenes/lobby.svg"
            alt=""
            className="scene-25d__backdrop"
            decoding="async"
          />

          <nav className="scene-25d__entrances" aria-label={t.lobby.roomsHeading}>
            {LOBBY_ENTRANCES.map((entrance) => {
              const room = roomById(entrance.room);
              const count = stats.byRoom[entrance.room];

              return (
                <Link
                  key={entrance.room}
                  href={`/rooms/${entrance.room}`}
                  className="scene-entrance group"
                  style={{
                    left: entrance.left,
                    top: entrance.top,
                    width: entrance.width,
                    height: entrance.height,
                  }}
                >
                  <span className="scene-entrance__plate">
                    <span className="label-caps block text-[0.58rem] tracking-[0.14em]">
                      {room.numeral}
                    </span>
                    <span className="mt-1 block font-display text-xl leading-none text-ink transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
                      {t.rooms.names[entrance.room]}
                    </span>
                    <span className="mt-2 block text-[0.68rem] italic text-ink-muted">
                      {t.rooms.taglines[entrance.room]}
                    </span>
                    <span className="label-caps mt-3 block text-[0.55rem] tracking-[0.12em]">
                      {ready
                        ? count === 0
                          ? t.count.emptyRoom
                          : countLabel(count, locale)
                        : "…"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <ul className="label-caps mt-6 hidden gap-x-8 md:flex" aria-hidden>
          {ROOMS.map((room) => (
            <li key={room.id}>{room.numeral}</li>
          ))}
        </ul>
      </section>

      <section className="mt-20 flex flex-col gap-16 md:mt-24 md:flex-row md:items-end md:justify-between">
        <TakeMeSomewhere />
        <div className="md:text-right">
          <CollectionPlaque />
          <CollectionPrompt />
        </div>
      </section>
    </>
  );
}
