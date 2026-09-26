"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "@/lib/i18n/useLocale";

/**
 * The smallest navigation that still works: a wordmark, two sections, and a
 * quiet language sign. The public galleries are read-only; Curators use /admin.
 */
export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href === "/rooms"
      ? pathname === "/rooms" || pathname.startsWith("/rooms/")
      : pathname.startsWith(href);

  const sections: readonly { href: string; label: string }[] = [
    { href: "/rooms", label: t.nav.rooms },
    { href: "/collection", label: t.nav.collection },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-6 py-4 md:px-10 md:py-6">
        <NavLink href="/" current={pathname === "/"}>
          <span className="font-display text-[1.15rem] leading-none tracking-[0.01em] md:text-[1.3rem]">
            {t.brand.name}
          </span>
        </NavLink>

        <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-8">
          <nav
            aria-label={t.nav.label}
            className="flex flex-wrap items-baseline gap-4 sm:gap-6 md:gap-8"
          >
            {sections.map((section) => (
              <NavLink
                key={section.href}
                href={section.href}
                current={isCurrent(section.href)}
              >
                <span className="label-caps text-[0.6rem] tracking-[0.12em] md:text-[0.68rem] md:tracking-[0.18em]">
                  {section.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <span aria-hidden className="hidden h-3 w-px self-center bg-line sm:block" />

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`transition-colors duration-300 ${
        current ? "text-ink" : "text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
