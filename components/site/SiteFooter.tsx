"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useLocale";

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="mt-32 border-t border-line">
      <div className="label-caps mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-6 py-10 sm:flex-row sm:items-baseline sm:justify-between md:px-10">
        <p>
          {t.brand.name} — {t.brand.tagline}
        </p>
        <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span>{t.footer.storage}</span>
          <Link href="/collection" className="link-quiet">
            {t.footer.collection}
          </Link>
        </p>
      </div>
    </footer>
  );
}
