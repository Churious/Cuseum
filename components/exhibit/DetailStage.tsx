"use client";

import { ArtworkImage } from "./Artwork";
import { hostnameOf } from "@/lib/format";
import { useTranslations } from "@/lib/i18n/useLocale";
import type { Exhibit } from "@/lib/types";

/**
 * The wall an exhibit is hung on when you stand in front of it.
 * The display style changes the mounting, never the artwork.
 */
export function DetailStage({ exhibit }: { exhibit: Exhibit }) {
  const t = useTranslations();
  const source = hostnameOf(exhibit.url);
  const artwork = (
    <ArtworkImage
      exhibit={exhibit}
      fit="contain"
      className="h-full max-h-[58vh] min-h-[260px] w-full"
    />
  );

  switch (exhibit.displayStyle) {
    case "poster":
      return (
        <div className="bg-paper-raised p-3 ring-1 ring-line shadow-sheet">
          {artwork}
        </div>
      );

    case "screen":
      return (
        <div className="bg-paper-raised ring-1 ring-line">
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
            <span className="label-caps truncate text-[0.6rem] tracking-[0.18em]">
              {source || t.exhibit.noSource}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" aria-hidden />
          </div>
          <div className="p-4 md:p-6">{artwork}</div>
        </div>
      );

    case "object":
      return (
        <div className="flex flex-col items-center">
          {artwork}
          <div className="mt-6 h-3 w-3/5 rounded-[50%] bg-ink/10 blur-[8px]" aria-hidden />
          <div className="mt-2 h-px w-full bg-line" aria-hidden />
        </div>
      );

    case "document":
      return (
        <div className="rotate-[-0.3deg] bg-paper-raised p-6 ring-1 ring-line shadow-sheet md:p-10">
          {artwork}
        </div>
      );

    case "frame":
    default:
      return (
        <div className="bg-paper-raised p-5 ring-1 ring-line shadow-mount md:p-7">
          <div className="ring-1 ring-line/70">{artwork}</div>
        </div>
      );
  }
}
