"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, htmlLang, writeLocaleCookie, type Locale } from "./locale";
import { translations, type Translation } from "./translations";

export interface LocaleContextValue {
  locale: Locale;
  /** The dictionary for the current locale. */
  t: Translation;
  setLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Holds the interface language.
 *
 * `initialLocale` comes from the cookie during server rendering, so the very
 * first paint is already in the right language and the client's first render
 * matches the server exactly (no hydration mismatch, no flash of the wrong
 * language). Switching only happens after a real user action, updates the
 * document language and the cookie, and re-renders the tree instantly.
 */
export function LocaleProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Keeps assistive technology and CSS (html[lang="ko"]) in sync.
    const next = htmlLang(locale);
    if (document.documentElement.lang !== next) {
      document.documentElement.lang = next;
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeLocaleCookie(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: translations[locale], setLocale }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside <LocaleProvider>.");
  }
  return context;
}

/** The dictionary alone, for components that do not need the locale itself. */
export function useTranslations(): Translation {
  return useLocale().t;
}
