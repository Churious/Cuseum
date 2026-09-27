"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

function isGalleryRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/rooms" || pathname.startsWith("/rooms/");
}

/** Gallery routes use full-bleed scene layout and their own plaque header. */
export function GalleryRouteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const gallery = isGalleryRoute(pathname);

  return (
    <>
      {!gallery ? <SiteHeader /> : null}
      <main
        id="main"
        className={
          gallery
            ? "gallery-main"
            : "mx-auto w-full max-w-[1180px] px-4 md:px-8"
        }
      >
        {children}
      </main>
      {!gallery ? <SiteFooter /> : null}
    </>
  );
}
