"use client";

import { useTranslations } from "@/lib/i18n/useLocale";

/** Brief in-room loading — never a blank page or infinite spinner. */
export function MuseumGalleryLoading() {
  const t = useTranslations();

  return (
    <div className="museum-loading" role="status">
      <ul className="museum-room__grid museum-room__grid--loading" aria-hidden>
        {[1, 2, 3, 4, 5, 6].map((slot) => (
          <li key={slot} className="museum-loading__slot">
            <div className="museum-empty-frame museum-empty-frame--frame">
              <div className="museum-empty-frame__surface museum-loading__pulse" />
            </div>
          </li>
        ))}
      </ul>
      <p className="museum-loading__label">{t.gallery.opening}</p>
    </div>
  );
}
