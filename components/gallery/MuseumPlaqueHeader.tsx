"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { useLocale } from "@/lib/i18n/useLocale";
import { useGalleryContextOptional } from "./GalleryContext";

/** Museum wayfinding plaque — integrated with each room's color theme. */
export function MuseumPlaqueHeader() {
  const { t } = useLocale();
  const gallery = useGalleryContextOptional();

  const roomLabel =
    gallery?.stop === "lobby"
      ? t.gallery.lobbyName
      : t.rooms.names[gallery?.stop ?? "music"];

  return (
    <header className="gallery-plaque">
      <div className="gallery-plaque__inner">
        <Link href="/" className="gallery-plaque__brand">
          {t.brand.name}
        </Link>

        <div className="gallery-plaque__center">
          <p className="gallery-plaque__room">{roomLabel}</p>
          {gallery ? (
            <p className="gallery-plaque__position">{gallery.positionLabel}</p>
          ) : null}
        </div>

        <div className="gallery-plaque__actions">
          <nav aria-label={t.nav.label}>
            <Link href="/collection" className="gallery-plaque__link">
              {t.nav.collection}
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
