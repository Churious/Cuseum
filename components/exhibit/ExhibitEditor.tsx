"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExhibitForm } from "./ExhibitForm";
import { LoadingRoom } from "@/components/site/Notices";
import { useExhibit } from "@/hooks/useMuseum";
import { formatExhibitDate } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { withdrawExhibit } from "@/lib/museumStore";
/** Editing an exhibit, including the quiet way to take it down again. */
export function ExhibitEditor({
  id,
  paths,
}: {
  id: string;
  paths?: {
    collection: string;
    cancel: string;
    /** Post-save destination. `{id}` is replaced with the exhibit id. */
    afterSave?: string;
    /** Post-withdraw destination. Defaults to `/rooms/{room}`. */
    afterWithdraw?: string;
  };
}) {
  const { exhibit, ready } = useExhibit(id);
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const router = useRouter();
  const { t, locale } = useLocale();

  if (!ready) {
    return <LoadingRoom label={t.loading.exhibit} />;
  }

  if (!exhibit) {
    return (
      <div className="pt-32 md:pt-44">
        <p className="label-caps">{t.editExhibit.missingEyebrow}</p>
        <h1 className="mt-6 max-w-[24ch] font-display text-[2.4rem] leading-[1.05] text-ink md:text-[3.2rem]">
          {t.editExhibit.missingTitle}
        </h1>
        <div className="mt-12">
          <Link href={paths?.collection ?? "/collection"} className="btn-line">
            {t.editExhibit.seeCollection}
          </Link>
        </div>
      </div>
    );
  }

  async function remove(id: string, room: string) {
    setRemoving(true);
    try {
      await withdrawExhibit(id);
      router.push(
        paths?.afterWithdraw?.replace("{room}", room) ?? `/rooms/${room}`,
      );
    } catch {
      setRemoving(false);
    }
  }

  return (
    <div>
      <ExhibitForm
        mode="edit"
        exhibit={exhibit}
        paths={
          paths
            ? { cancel: paths.cancel, afterSave: paths.afterSave }
            : undefined
        }
      />

      <section
        aria-labelledby="withdraw-heading"
        className="mt-10 border-t border-line pt-9 pb-4"
      >
        <h2 id="withdraw-heading" className="label-caps">
          {t.editExhibit.withdrawHeading}
        </h2>
        <p className="mt-4 max-w-[54ch] text-sm leading-relaxed text-ink-soft">
          {t.editExhibit.withdrawBody(
            exhibit.title,
            formatExhibitDate(exhibit.createdAt, locale),
            t.rooms.names[exhibit.room],
          )}
        </p>

        {confirming ? (
          <p className="mt-6 font-display text-lg text-ink">
            {t.editExhibit.withdrawConfirm}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-baseline gap-x-8 gap-y-3">
          {confirming ? (
            <>
              <button
                type="button"
                disabled={removing}
                onClick={() => void remove(exhibit.id, exhibit.room)}
                className="label-caps border-b border-clay pb-1 text-clay"
              >
                {removing ? t.editExhibit.withdrawing : t.editExhibit.withdrawAction}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="label-caps link-quiet"
              >
                {t.editExhibit.withdrawKeep}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="label-caps link-quiet"
            >
              {t.editExhibit.withdrawStart}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
