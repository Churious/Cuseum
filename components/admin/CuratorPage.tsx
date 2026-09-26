import type { ReactNode } from "react";
import { AdminNav } from "./AdminNav";
import { AdminShell } from "./AdminShell";

export function CuratorPage({
  title,
  subtitle,
  wide = false,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  wide?: boolean;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}) {
  return (
    <>
      <AdminNav />
      <AdminShell
        title={title}
        subtitle={subtitle}
        wide={wide}
        backHref={backHref}
        backLabel={backLabel}
      >
        {children}
      </AdminShell>
    </>
  );
}
