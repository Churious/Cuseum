"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useLocale";

/** "Not on display" — the museum's own 404. */
export function NotFoundView() {
  const t = useTranslations();

  return (
    <div className="pt-32 md:pt-44">
      <p className="label-caps">{t.notFound.eyebrow}</p>
      <h1 className="mt-6 max-w-[24ch] font-display text-[2.6rem] leading-[1.05] text-ink md:text-[3.6rem]">
        {t.notFound.title}
      </h1>
      <p className="mt-7 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
        {t.notFound.body}
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link href="/" className="btn-line">
          {t.notFound.lobby}
        </Link>
        <Link href="/collection" className="label-caps link-quiet">
          {t.notFound.everything}
        </Link>
      </div>
    </div>
  );
}
