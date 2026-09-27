"use client";

import { useTranslations } from "@/lib/i18n/useLocale";
import type { DisplayStyle } from "@/lib/types";
import { EmptyCaptionPlate } from "./CaptionPlate";
import { Pedestal } from "./Pedestal";

export function EmptyExhibitionState({
  presentation,
}: {
  presentation: DisplayStyle;
}) {
  const t = useTranslations();

  if (presentation === "object") {
    return (
      <>
        <Pedestal glass>
          <div className="room-empty__object" aria-hidden />
        </Pedestal>
        <EmptyCaptionPlate label={t.gallery.preparingShort} />
      </>
    );
  }

  return (
    <>
      <div className={`room-empty room-empty--${presentation}`} aria-hidden>
        <div className="room-empty__surface">
          <span className="room-empty__wire" />
        </div>
      </div>
      <EmptyCaptionPlate label={t.gallery.preparingShort} />
    </>
  );
}
