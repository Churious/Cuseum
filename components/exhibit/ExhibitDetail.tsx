"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DetailStage } from "./DetailStage";
import { MuseumLabel } from "./MuseumLabel";
import { LoadingRoom, MuseumNotice } from "@/components/site/Notices";
import { useExhibit, useMuseum } from "@/hooks/useMuseum";
import { useLocale, useTranslations } from "@/lib/i18n/useLocale";
import { selectExhibitsByRoom } from "@/lib/museumStore";
import type { Exhibit } from "@/lib/types";

/**
 * Standing in front of one work. The artwork takes the room; the label is
 * printed small off to the side.
 */
export function ExhibitDetail({ id }: { id: string }) {
  const { exhibit, ready, error } = useExhibit(id);
  const { exhibits } = useMuseum();
  const { t } = useLocale();

  const neighbours = useMemo(() => {
    if (!exhibit) {
      return { previous: undefined, next: undefined, position: null, total: 0 };
    }
    const inRoom = selectExhibitsByRoom(exhibits, exhibit.room);
    const index = inRoom.findIndex((candidate) => candidate.id === exhibit.id);
    return {
      previous: index > 0 ? inRoom[index - 1] : undefined,
      next: index >= 0 && index < inRoom.length - 1 ? inRoom[index + 1] : undefined,
      position: index >= 0 ? index + 1 : null,
      total: inRoom.length,
    };
  }, [exhibit, exhibits]);

  if (!ready) {
    return <LoadingRoom label={t.loading.gallery} />;
  }

  if (!exhibit) {
    return (
      <div className="pt-32 md:pt-44">
        <p className="label-caps">{t.exhibit.missingEyebrow}</p>
        <h1 className="mt-6 max-w-[24ch] font-display text-[2.4rem] leading-[1.05] text-ink md:text-[3.2rem]">
          {t.exhibit.missingTitle}
        </h1>
        <p className="mt-7 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
          {t.exhibit.missingBody}
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href="/collection" className="btn-line">
            {t.exhibit.seeCollection}
          </Link>
          <Link href="/" className="label-caps link-quiet">
            {t.exhibit.backToLobby}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="pt-10 md:pt-14">
      <div className="label-caps flex flex-wrap items-baseline justify-between gap-4 text-[0.62rem] tracking-[0.18em]">
        <Link href={`/rooms/${exhibit.room}`} className="link-quiet">
          <span aria-hidden>←</span> {t.rooms.names[exhibit.room]}
        </Link>
        {neighbours.position !== null && neighbours.total > 0 ? (
          <span>{t.exhibit.position(neighbours.position, neighbours.total)}</span>
        ) : null}
      </div>

      <div className="mt-10 grid gap-16 md:mt-16 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-20">
        <div className="flex justify-center lg:justify-start">
          <div className="breathe-in w-full max-w-[860px]">
            <DetailStage exhibit={exhibit} />
          </div>
        </div>

        <div className="lg:pt-4">
          <MuseumLabel exhibit={exhibit} />

          <div className="mt-11 flex flex-wrap items-baseline gap-x-9 gap-y-4">
            {exhibit.url ? (
              <a
                href={exhibit.url}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-line"
              >
                {t.exhibit.visitOriginal}
                <span aria-hidden>↗</span>
              </a>
            ) : null}
          </div>

          {error ? (
            <div className="mt-8">
              <MuseumNotice>
                {t.errors.storage} {t.errors.storageHint}
              </MuseumNotice>
            </div>
          ) : null}
        </div>
      </div>

      <NavInRoom
        room={exhibit.room}
        previous={neighbours.previous}
        next={neighbours.next}
      />
    </article>
  );
}

function NavInRoom({
  room,
  previous,
  next,
}: {
  room: Exhibit["room"];
  previous: Exhibit | undefined;
  next: Exhibit | undefined;
}) {
  const t = useTranslations();

  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label={t.exhibit.moreInRoom(t.rooms.names[room])}
      className="mt-24 flex flex-col gap-8 border-t border-line pt-8 sm:flex-row sm:items-baseline sm:justify-between md:mt-32"
    >
      {previous ? <NavStep direction="previous" exhibit={previous} /> : <span />}
      {next ? <NavStep direction="next" exhibit={next} /> : null}
    </nav>
  );
}

function NavStep({
  direction,
  exhibit,
}: {
  direction: "previous" | "next";
  exhibit: Exhibit;
}) {
  const t = useTranslations();
  const isNext = direction === "next";

  return (
    <Link
      href={`/exhibit/${exhibit.id}`}
      className={`group max-w-[22rem] ${isNext ? "sm:text-right" : ""}`}
    >
      <span className="label-caps">
        {isNext ? (
          <>
            {t.exhibit.next} <span aria-hidden>→</span>
          </>
        ) : (
          <>
            <span aria-hidden>←</span> {t.exhibit.previous}
          </>
        )}
      </span>
      <span className="mt-3 block font-display text-xl leading-snug text-ink transition-transform duration-500 ease-out group-hover:translate-x-1">
        {exhibit.title}
      </span>
    </Link>
  );
}
