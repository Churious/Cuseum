"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useLocale";

/** The header of the room index, in the visitor's language. */
export function RoomsIntro() {
  const t = useTranslations();

  return (
    <>
      <header className="pt-16 md:pt-24">
        <p className="label-caps">{t.roomsIndex.eyebrow}</p>
        <h1 className="mt-6 font-display text-[3rem] leading-[0.95] text-ink md:text-[4.5rem]">
          {t.roomsIndex.title}
        </h1>
        <p className="mt-7 max-w-[46ch] font-display text-lg italic leading-relaxed text-ink-soft md:text-xl">
          {t.roomsIndex.intro}
        </p>
      </header>

      <p className="label-caps mt-12 text-[0.65rem] tracking-[0.18em]">
        {t.roomsIndex.collectionPrompt}{" "}
        <Link href="/collection" className="link-quiet">
          {t.roomsIndex.collectionLink}
        </Link>
      </p>
    </>
  );
}
