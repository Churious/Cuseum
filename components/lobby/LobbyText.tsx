"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useLocale";

/**
 * The lobby's words. They live in client components so that switching the
 * language re-renders them immediately — without a reload and without waiting
 * for the server.
 */
export function LobbyHero() {
  const t = useTranslations();

  return (
    <section className="pt-20 pb-24 text-center md:pt-32 md:pb-32">
      <h1 className="font-display text-[3.6rem] leading-none tracking-[0.01em] text-ink md:text-[6rem]">
        {t.brand.name}
      </h1>
      <p className="mt-7 font-display text-lg italic text-ink-soft md:text-xl">
        {t.brand.tagline}
      </p>
      <p className="label-caps mt-10 text-[0.65rem] tracking-[0.22em]">
        {t.lobby.privacy}
      </p>
    </section>
  );
}

export function RoomsHeading() {
  const t = useTranslations();

  return (
    <div className="flex items-baseline justify-between gap-6">
      <h2 id="rooms-heading" className="label-caps">
        {t.lobby.roomsHeading}
      </h2>
      <p className="label-caps hidden sm:block">{t.lobby.roomsNote}</p>
    </div>
  );
}

export function CollectionPrompt() {
  const t = useTranslations();

  return (
    <p className="label-caps mt-5 text-[0.65rem] tracking-[0.18em]">
      <Link href="/collection" className="link-quiet">
        {t.lobby.collectionLink}
      </Link>
    </p>
  );
}
