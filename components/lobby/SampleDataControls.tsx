"use client";

import { useState } from "react";
import { useMuseumStats } from "@/hooks/useMuseum";
import { useTranslations } from "@/lib/i18n/useLocale";
import { addSampleExhibits, withdrawSampleExhibits } from "@/lib/museumStore";

/**
 * Development fixtures, kept clearly separate from the real collection.
 *
 * Sample exhibits are never loaded on their own. They only appear when the
 * visitor asks for them, every record is flagged `sample: true`, and the whole
 * set can be withdrawn again with one click.
 *
 * The sample exhibits' own titles and notes are content, not interface text,
 * so they are never translated.
 */
export function SampleDataControls() {
  const { sampleCount, ready } = useMuseumStats();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const t = useTranslations();

  async function run(action: () => Promise<number>, describe: (n: number) => string) {
    setBusy(true);
    setMessage(null);
    try {
      const count = await action();
      setMessage(describe(count));
    } catch {
      setMessage(t.samples.error);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return null;
  }

  const hasSamples = sampleCount > 0;

  return (
    <div className="border-t border-line pt-6">
      <p className="label-caps">{t.samples.heading}</p>
      <p className="mt-3 max-w-[58ch] text-xs leading-relaxed text-ink-muted">
        {t.samples.body}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {hasSamples ? (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void run(withdrawSampleExhibits, (count) => t.samples.withdrawn(count))
            }
            className="label-caps link-quiet"
          >
            {t.samples.withdraw(sampleCount)}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void run(addSampleExhibits, (count) =>
                count > 0 ? t.samples.placed(count) : t.samples.placeNoop,
              )
            }
            className="label-caps link-quiet"
          >
            {t.samples.place}
          </button>
        )}
      </div>

      <p aria-live="polite" className="mt-3 text-xs italic text-ink-muted">
        {message ?? ""}
      </p>
    </div>
  );
}
