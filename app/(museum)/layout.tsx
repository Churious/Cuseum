import type { ReactNode } from "react";
import { MuseumRuntime } from "@/components/MuseumRuntime";
import { PageEnter } from "@/components/site/PageEnter";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";

export default function MuseumLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MuseumRuntime />
      <SkipLink />
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-[1180px] px-6 md:px-10">
        <PageEnter>{children}</PageEnter>
      </main>
      <SiteFooter />
    </>
  );
}
