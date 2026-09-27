"use client";

import { useTranslations } from "@/lib/i18n/useLocale";

export function MuseumGalleryError({ message }: { message: string }) {
  const t = useTranslations();

  return (
    <div className="museum-error" role="alert">
      <p className="museum-error__title">{t.gallery.errorTitle}</p>
      <p className="museum-error__line">{message || t.gallery.errorLine}</p>
    </div>
  );
}
