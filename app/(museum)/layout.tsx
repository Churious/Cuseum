import type { ReactNode } from "react";
import { GalleryRouteChrome } from "@/components/gallery/GalleryRouteChrome";
import { MuseumRuntime } from "@/components/MuseumRuntime";
import { PageEnter } from "@/components/site/PageEnter";
import { SkipLink } from "@/components/site/SkipLink";

export default function MuseumLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MuseumRuntime />
      <SkipLink />
      <GalleryRouteChrome>
        <PageEnter>{children}</PageEnter>
      </GalleryRouteChrome>
    </>
  );
}
