"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * A restrained screen change: the new room fades up a few pixels and settles.
 * Keyed by pathname so it replays on navigation without any animation library.
 */
export function PageEnter({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
