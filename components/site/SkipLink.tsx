"use client";

import { useTranslations } from "@/lib/i18n/useLocale";

/** First focusable element on the page, in the visitor's language. */
export function SkipLink() {
  const t = useTranslations();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
    >
      {t.skipLink}
    </a>
  );
}
