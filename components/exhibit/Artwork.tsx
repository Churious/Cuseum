"use client";

import { hostnameOf } from "@/lib/format";
import { useTranslations } from "@/lib/i18n/useLocale";
import type { Exhibit } from "@/lib/types";

/**
 * When an exhibit has no image, the title itself becomes the artwork — a small
 * printed plate rather than an empty grey box.
 */
export function TypographicPlate({
  exhibit,
  className,
}: {
  exhibit: Exhibit;
  className?: string;
}) {
  const t = useTranslations();
  const source = hostnameOf(exhibit.url);

  return (
    <div
      className={`flex items-center justify-center bg-paper-deep p-6 text-center ${
        className ?? ""
      }`}
    >
      <div className="max-w-[26ch]">
        <div className="mx-auto h-px w-10 bg-line-strong" aria-hidden />
        <p className="mt-5 font-display text-lg italic leading-snug text-ink sm:text-xl">
          {exhibit.title}
        </p>
        <p className="label-caps mt-5">{source || t.exhibit.plateNoSource}</p>
        <div className="mx-auto mt-5 h-px w-10 bg-line-strong" aria-hidden />
      </div>
    </div>
  );
}

/** The artwork surface: a real image when there is one, a plate when there is not. */
export function ArtworkImage({
  exhibit,
  className,
  fit = "cover",
}: {
  exhibit: Exhibit;
  className?: string;
  fit?: "cover" | "contain";
}) {
  if (!exhibit.imageUrl) {
    return <TypographicPlate exhibit={exhibit} className={className} />;
  }

  return (
    <img
      src={exhibit.imageUrl}
      alt={exhibit.title}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={`${fit === "cover" ? "object-cover" : "object-contain"} ${
        className ?? ""
      }`}
    />
  );
}
