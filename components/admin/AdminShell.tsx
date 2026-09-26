import Link from "next/link";
import type { ReactNode } from "react";

export function AdminShell({
  title,
  subtitle,
  children,
  wide = false,
  backHref = "/admin",
  backLabel,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div
      className={`mx-auto flex w-full flex-col px-6 py-10 md:px-10 md:py-14 ${
        wide ? "max-w-[1180px]" : "min-h-[calc(100vh-4rem)] max-w-md justify-center py-16"
      }`}
    >
      {backLabel ? (
        <Link href={backHref} className="label-caps link-quiet mb-10 w-fit">
          <span aria-hidden>←</span> {backLabel}
        </Link>
      ) : null}
      <header className={`mb-10 ${wide ? "" : "text-center"}`}>
        <p className="label-caps text-ink-muted">Cuseum</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">{title}</h1>
        {subtitle ? (
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
