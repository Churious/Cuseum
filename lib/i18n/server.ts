import { cookies } from "next/headers";
import { LOCALE_COOKIE, readLocaleCookie } from "./locale";
import { translations, type Translation } from "./translations";
import type { Locale } from "./types";

/**
 * The locale for the current request, read from the cookie so the server
 * renders the same language the client will hydrate with.
 *
 * Server only: importing next/headers is what makes this safe to use in
 * layouts and generateMetadata.
 */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  return readLocaleCookie(store.get(LOCALE_COOKIE)?.value);
}

/** Server-side dictionary, e.g. for document titles. */
export async function getServerTranslations(): Promise<{
  locale: Locale;
  t: Translation;
}> {
  const locale = await getServerLocale();
  return { locale, t: translations[locale] };
}
