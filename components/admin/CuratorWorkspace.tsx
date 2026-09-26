"use client";

import Link from "next/link";
import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { SampleDataControls } from "@/components/lobby/SampleDataControls";
import { useMuseumStats } from "@/hooks/useMuseum";
import { countLabel } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";

/** The main Curator management surface: collection list, actions, and sample fixtures. */
export function CuratorWorkspace() {
  const { total, ready } = useMuseumStats();
  const { t, locale } = useLocale();

  return (
    <div className="space-y-16 pb-16">
      <section className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="label-caps">{t.auth.admin.statsLabel}</p>
          <p className="mt-3 font-display text-4xl text-ink">
            {ready ? countLabel(total, locale) : "…"}
          </p>
          <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-ink-soft">
            {t.auth.admin.workspaceIntro}
          </p>
        </div>
        <Link href="/admin/exhibits/new" className="btn-ink">
          {t.auth.admin.addExhibit}
        </Link>
      </section>

      <CollectionBrowser
        embedded
        manageable
        addHref="/admin/exhibits/new"
        editHrefPrefix="/admin/exhibits"
      />

      <section className="border-t border-line pt-8">
        <SampleDataControls />
      </section>
    </div>
  );
}
