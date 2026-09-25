export type { Locale } from "./types";

import type { Locale } from "./types";

/**
 * Locale plumbing. This module is isomorphic on purpose: the server reads the
 * cookie to render the right language on the first byte, and the client writes
 * it again when someone switches. No URL prefix is ever involved.
 */
export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_COOKIE = "cuseum.locale";

export const LOCALES: readonly Locale[] = ["ko", "en"];

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return value === "ko" || value === "en";
}

/** Falls back to Korean for anything unreadable or unsupported. */
export function readLocaleCookie(value: string | undefined | null): Locale {
  if (!value) {
    return DEFAULT_LOCALE;
  }
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith("en")) {
    return "en";
  }
  if (trimmed.startsWith("ko")) {
    return "ko";
  }
  return DEFAULT_LOCALE;
}

/** BCP 47 tag for Intl formatters: "ko-KR" / "en-US". */
export function intlLocale(locale: Locale): string {
  return locale === "ko" ? "ko-KR" : "en-US";
}

/** Value for the <html lang> attribute. */
export function htmlLang(locale: Locale): string {
  return locale === "ko" ? "ko" : "en";
}

export function localeName(locale: Locale): string {
  return locale === "ko" ? "한국어" : "English";
}

/**
 * Persists the choice so the next visit (and the next server render) already
 * uses it. Client only — silently does nothing during SSR.
 */
export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") {
    return;
  }
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; secure"
      : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax${secure}`;
}
