import { intlLocale } from "./i18n/locale";
import { translations } from "./i18n/translations";
import type { Locale } from "./i18n/types";

/** "September 25, 2026" / "2026년 9월 25일" */
export function formatExhibitDate(timestamp: number, locale: Locale): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** "September 2026" / "2026년 9월" */
export function formatMonthYear(timestamp: number, locale: Locale): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: "numeric",
    month: "long",
  }).format(date);
}

/**
 * The single place exhibit counts are formatted.
 * "1 exhibit" / "12 exhibits" / "전시 12점" / "No exhibits" / "전시 없음".
 * The wording itself lives in the dictionaries.
 */
export function countLabel(count: number, locale: Locale): string {
  return translations[locale].count.exhibits(count);
}

/** Host without "www.", or "" when the URL cannot be read. */
export function hostnameOf(url: string): string {
  if (!url.trim()) {
    return "";
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Makes a typed URL usable: adds https:// when the scheme is missing.
 * Returns "" when the value cannot be turned into an http(s) URL.
 */
export function normalizeUrlInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

export function isLookupableUrl(value: string): boolean {
  const normalized = normalizeUrlInput(value);
  if (!normalized) {
    return false;
  }
  const host = hostnameOf(normalized);
  return host.includes(".") && !host.endsWith(".");
}

export function snippet(text: string, max = 170): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** A title to fall back on when a page gives us nothing to read. */
export function titleFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const last = segments.at(-1);
    if (last) {
      const words = decodeURIComponent(last)
        .replace(/\.(html?|php|aspx?|jpe?g|png|gif|webp)$/i, "")
        .replace(/[-_+]+/g, " ")
        .trim();
      if (words.length > 2) {
        return words.replace(/\b\w/g, (character) => character.toUpperCase());
      }
    }
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

