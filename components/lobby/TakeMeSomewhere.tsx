"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { MuseumNotice } from "@/components/site/Notices";
import { useMuseum } from "@/hooks/useMuseum";
import { useTranslations } from "@/lib/i18n/useLocale";
import { pickRandomExhibit } from "@/lib/museumStore";

/**
 * The one button in the lobby. It does not filter, sort, or open a panel —
 * it simply walks the visitor into the building.
 */
export function TakeMeSomewhere() {
  const { exhibits, ready, error } = useMuseum();
  const t = useTranslations();
  const [walking, setWalking] = useState(false);
  const router = useRouter();

  const walk = useCallback(() => {
    const pick = pickRandomExhibit(exhibits);
    if (!pick) {
      return;
    }
    setWalking(true);
    router.push(`/exhibit/${pick.id}`);
  }, [exhibits, router]);

  if (!ready) {
    return (
      <div className="h-[52px]" aria-hidden>
        <span className="label-caps">{t.loading.doors}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[52ch]">
        <MuseumNotice>
          {t.errors.storage} {t.errors.storageHint}
        </MuseumNotice>
      </div>
    );
  }

  if (exhibits.length === 0) {
    return (
      <div className="max-w-[46ch]">
        <p className="text-sm leading-relaxed italic text-ink-soft">{t.lobby.emptyMuseum}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[46ch]">
      <button type="button" onClick={walk} disabled={walking} className="btn-ink">
        {walking ? t.lobby.walking : t.lobby.takeMe}
        <span aria-hidden>→</span>
      </button>
      <p className="mt-6 text-sm italic text-ink-soft">{t.lobby.takeMeCaption}</p>
    </div>
  );
}
