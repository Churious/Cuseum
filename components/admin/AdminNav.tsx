"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/lib/i18n/useLocale";

export function AdminNav() {
  const t = useTranslations();
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: t.auth.admin.nav.dashboard, match: (path: string) => path === "/admin" },
    {
      href: "/admin/exhibits/new",
      label: t.auth.admin.nav.addExhibit,
      match: (path: string) => path.startsWith("/admin/exhibits/new"),
    },
    {
      href: "/",
      label: t.auth.admin.viewMuseum,
      match: () => false,
      external: true,
    },
  ] as const;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-6 py-4 md:px-10 md:py-5">
        <Link href="/admin" className="font-display text-[1.15rem] leading-none tracking-[0.01em] text-ink md:text-[1.3rem]">
          Cuseum <span className="label-caps text-[0.55rem] tracking-[0.18em] text-ink-muted">Curator</span>
        </Link>

        <nav
          aria-label={t.auth.admin.toolsLabel}
          className="flex flex-wrap items-baseline gap-x-5 gap-y-2 md:gap-x-8"
        >
          {links.map((link) => {
            const current = link.match(pathname);
            const className = `label-caps text-[0.6rem] tracking-[0.12em] transition-colors duration-300 md:text-[0.68rem] md:tracking-[0.18em] ${
              current ? "text-ink" : "text-ink-muted hover:text-ink"
            }`;

            if ("external" in link && link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {link.label}
                  <span className="ml-1" aria-hidden>
                    ↗
                  </span>
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={className}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
