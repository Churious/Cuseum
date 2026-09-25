export const dynamic = "force-dynamic";


import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Inter,
  Noto_Sans_KR,
  Noto_Serif_KR,
} from "next/font/google";
import { MuseumRuntime } from "@/components/MuseumRuntime";
import { PageEnter } from "@/components/site/PageEnter";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { getServerTranslations } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/useLocale";
import "./globals.css";

/** English: the original Cuseum faces. */
const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const informationSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Korean: these sit behind the Latin faces in the font stack, so Hangul is
 * drawn by Noto while Latin characters and the Cuseum wordmark keep their
 * original faces. `preload: false` keeps the many Hangul subsets out of the
 * critical path; unicode-range means only the ranges actually used are fetched.
 */
const koreanSerif = Noto_Serif_KR({
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false,
});

const koreanSans = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();

  return {
    title: {
      default: `${t.brand.name} — ${t.brand.tagline}`,
      template: `%s — ${t.brand.name}`,
    },
    description: t.meta.description,
    applicationName: t.brand.name,
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f0e8",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read the cookie once, on the server: the first paint is already in the
  // visitor's language, and the client hydrates with the exact same value.
  const { locale } = await getServerTranslations();

  return (
    <html
      lang={locale}
      className={`${displaySerif.variable} ${informationSans.variable} ${koreanSerif.variable} ${koreanSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-paper antialiased" suppressHydrationWarning>
        <LocaleProvider initialLocale={locale}>
          <MuseumRuntime />
          <SkipLink />
          <SiteHeader />
          <main id="main" className="mx-auto w-full max-w-[1180px] px-6 md:px-10">
            <PageEnter>{children}</PageEnter>
          </main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
