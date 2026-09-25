"use client";

import { Fragment } from "react";
import { LOCALES } from "@/lib/i18n/locale";
import { useLocale } from "@/lib/i18n/useLocale";

/**
 * A small wayfinding sign, not a switch: two words separated by a hairline
 * slash, with the language you are reading underlined. No flags, no dropdown,
 * no pill, no settings panel.
 *
 * Each label is written in its own language and tagged with its own `lang`, so
 * a screen reader pronounces it correctly; the group itself is labelled in the
 * language currently on screen.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="label-caps flex items-baseline gap-1.5 text-[0.6rem] tracking-[0.12em] md:text-[0.68rem] md:tracking-[0.18em]"
    >
      {LOCALES.map((option, index) => {
        const isCurrent = option === locale;

        return (
          <Fragment key={option}>
            {index > 0 ? (
              <span aria-hidden className="text-line-strong">
                /
              </span>
            ) : null}
            <button
              type="button"
              lang={option}
              title={t.language.names[option]}
              aria-label={t.language.names[option]}
              aria-pressed={isCurrent}
              onClick={() => setLocale(option)}
              className={`border-b pb-0.5 uppercase transition-colors duration-300 ${
                isCurrent
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {t.language.short[option]}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
