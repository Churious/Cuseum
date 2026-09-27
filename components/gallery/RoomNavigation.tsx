"use client";

import { useTranslations } from "@/lib/i18n/useLocale";
import { useGalleryContext } from "./GalleryContext";

export function RoomNavigation({ side }: { side: "left" | "right" }) {
  const t = useTranslations();
  const { onPrev, onNext, positionLabel } = useGalleryContext();

  if (side === "left") {
    return (
      <button
        type="button"
        className="gallery-nav gallery-nav--prev"
        onClick={onPrev}
        aria-label={t.gallery.prevRoom}
      >
        <span aria-hidden>‹</span>
      </button>
    );
  }

  return (
    <div className="gallery-nav-group gallery-nav-group--right">
      <p className="gallery-nav__position" aria-live="polite">
        {positionLabel}
      </p>
      <button
        type="button"
        className="gallery-nav gallery-nav--next"
        onClick={onNext}
        aria-label={t.gallery.nextRoom}
      >
        <span aria-hidden>›</span>
      </button>
    </div>
  );
}
