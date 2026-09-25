"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChoiceRow,
  FormRow,
  LookupNote,
} from "@/components/ui/FormBits";
import {
  DEFAULT_DISPLAY_STYLE_BY_TYPE,
  DEFAULT_ROOM_BY_TYPE,
  DISPLAY_STYLE_VALUES,
  TYPE_VALUES,
  typeForRoom,
} from "@/lib/exhibitFields";
import { isLookupableUrl, normalizeUrlInput, titleFromUrl } from "@/lib/format";
import type { Translation } from "@/lib/i18n/translations";
import { useLocale } from "@/lib/i18n/useLocale";
import type { ExhibitMetadata, MetadataFailureReason } from "@/lib/metadata";
import { addExhibit, editExhibit } from "@/lib/museumStore";
import { ROOMS } from "@/lib/rooms";
import type {
  DisplayStyle,
  Exhibit,
  ExhibitDraft,
  ExhibitType,
  RoomId,
} from "@/lib/types";

/**
 * How the last lookup ended. The wording is derived from this at render time,
 * so a language switch re-renders the sentence in the new language.
 */
type LookupOutcome =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; hostname: string }
  | { status: "failed"; reason: MetadataFailureReason };

function lookupMessage(outcome: LookupOutcome, t: Translation): string {
  switch (outcome.status) {
    case "loading":
      return t.newExhibit.lookupReading;
    case "done":
      return t.newExhibit.lookupDone(outcome.hostname);
    case "failed":
      if (outcome.reason === "invalid-url") {
        return t.newExhibit.lookupInvalid;
      }
      if (outcome.reason === "private-host") {
        return t.newExhibit.lookupPrivate;
      }
      return t.newExhibit.lookupFailed;
    default:
      return "";
  }
}

/**
 * The two ways to fill in an exhibit: let the page describe itself, or write
 * it down by hand. Nothing is ever lost when a lookup fails.
 */
export function ExhibitForm({
  mode,
  exhibit,
  initialRoom,
}: {
  mode: "create" | "edit";
  exhibit?: Exhibit;
  initialRoom?: RoomId;
}) {
  const router = useRouter();
  const { t } = useLocale();

  const roomChoices = ROOMS.map((definition) => ({
    value: definition.id,
    label: t.rooms.names[definition.id],
    hint: t.rooms.taglines[definition.id],
  }));
  const typeChoices = TYPE_VALUES.map((value) => ({
    value,
    label: t.exhibitTypes.labels[value],
    hint: t.exhibitTypes.hints[value],
  }));
  const styleChoices = DISPLAY_STYLE_VALUES.map((value) => ({
    value,
    label: t.displayStyles.labels[value],
    hint: t.displayStyles.hints[value],
  }));

  const [url, setUrl] = useState(exhibit?.url ?? "");
  const [title, setTitle] = useState(exhibit?.title ?? "");
  const [imageUrl, setImageUrl] = useState(exhibit?.imageUrl ?? "");
  const [description, setDescription] = useState(exhibit?.description ?? "");
  const [personalNote, setPersonalNote] = useState(exhibit?.personalNote ?? "");
  const [room, setRoom] = useState<RoomId>(
    exhibit?.room ?? initialRoom ?? "web",
  );
  const [type, setType] = useState<ExhibitType>(
    exhibit?.type ?? (initialRoom ? typeForRoom(initialRoom) : "website"),
  );
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>(
    exhibit?.displayStyle ??
      DEFAULT_DISPLAY_STYLE_BY_TYPE[
        exhibit?.type ?? (initialRoom ? typeForRoom(initialRoom) : "website")
      ],
  );
  const [lookup, setLookup] = useState<LookupOutcome>({ status: "idle" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const lastLookedUp = useRef<string | null>(null);
  const roomChosen = useRef(mode === "edit");
  const styleChosen = useRef(mode === "edit");

  const applyMetadata = useCallback((data: ExhibitMetadata) => {
    // Only ever fill in what is still empty, so nothing typed is overwritten.
    setTitle((current) => (current.trim() ? current : (data.title ?? "")));
    setImageUrl((current) => (current.trim() ? current : (data.imageUrl ?? "")));
    setDescription((current) =>
      current.trim() ? current : (data.description ?? ""),
    );
    setLookup(
      data.ok
        ? { status: "done", hostname: data.hostname }
        : { status: "failed", reason: data.reason ?? "network" },
    );
  }, []);

  const readPage = useCallback(
    async (target: string, signal?: AbortSignal) => {
      lastLookedUp.current = target;
      setLookup({ status: "loading" });
      try {
        const response = await fetch(
          `/api/metadata?url=${encodeURIComponent(target)}`,
          { signal },
        );
        if (!response.ok) {
          throw new Error(`The lookup returned ${response.status}.`);
        }
        const data = (await response.json()) as ExhibitMetadata;
        if (signal?.aborted) {
          return;
        }
        applyMetadata(data);
      } catch (error) {
        if (
          signal?.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
        lastLookedUp.current = null;
        setLookup({ status: "failed", reason: "network" });
      }
    },
    [applyMetadata],
  );

  // In the New Exhibit room the address is looked up on its own, once the
  // visitor stops typing. An edit keeps whatever is already on the label.
  useEffect(() => {
    if (mode !== "create") {
      return;
    }
    const normalized = normalizeUrlInput(url);
    if (!isLookupableUrl(normalized) || lastLookedUp.current === normalized) {
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void readPage(normalized, controller.signal);
    }, 700);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [url, mode, readPage]);

  function chooseType(next: ExhibitType) {
    setType(next);
    if (mode === "create") {
      if (!roomChosen.current) {
        setRoom(DEFAULT_ROOM_BY_TYPE[next]);
      }
      if (!styleChosen.current) {
        setDisplayStyle(DEFAULT_DISPLAY_STYLE_BY_TYPE[next]);
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUrl = normalizeUrlInput(url);
    const finalTitle =
      title.trim() || titleFromUrl(normalizedUrl) || t.newExhibit.untitled;

    setFormError(null);
    setSaving(true);

    const draft: ExhibitDraft = {
      title: finalTitle,
      type,
      room,
      url: normalizedUrl,
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      personalNote: personalNote.trim(),
      displayStyle,
    };

    try {
      if (mode === "edit" && exhibit) {
        await editExhibit(exhibit.id, draft);
        router.push(`/exhibit/${exhibit.id}`);
      } else {
        const created = await addExhibit(draft);
        router.push(`/exhibit/${created.id}`);
      }
    } catch {
      setFormError(t.newExhibit.error);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="pt-16 pb-8 md:pt-24">
      <header className="max-w-[48ch]">
        <p className="label-caps">
          {mode === "edit" ? t.editExhibit.eyebrow : t.newExhibit.eyebrow}
        </p>
        <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] text-ink md:text-[3.4rem]">
          {mode === "edit" ? t.editExhibit.title : t.newExhibit.title}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-ink-soft">
          {mode === "edit" ? t.editExhibit.intro : t.newExhibit.intro}
        </p>
      </header>

      <div className="mt-14 space-y-9 md:mt-20">
        <FormRow
          label={t.newExhibit.fields.url}
          htmlFor="exhibit-url"
          hint={t.newExhibit.hints.url}
        >
          <input
            id="exhibit-url"
            name="url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            className="field"
            placeholder="https://…"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <LookupNote
              status={lookup.status}
              message={lookupMessage(lookup, t)}
              onRetry={() => {
                const normalized = normalizeUrlInput(url);
                if (isLookupableUrl(normalized)) {
                  void readPage(normalized);
                }
              }}
            />
            {mode === "create" && isLookupableUrl(url) ? (
              <button
                type="button"
                className="label-caps link-quiet"
                onClick={() => {
                  const normalized = normalizeUrlInput(url);
                  if (isLookupableUrl(normalized)) {
                    void readPage(normalized);
                  }
                }}
              >
                {t.newExhibit.lookUp}
              </button>
            ) : null}
          </div>
        </FormRow>

        <FormRow label={t.newExhibit.fields.title} htmlFor="exhibit-title">
          <input
            id="exhibit-title"
            name="title"
            className="field"
            placeholder={t.newExhibit.placeholders.title}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </FormRow>

        <FormRow
          label={t.newExhibit.fields.image}
          htmlFor="exhibit-image"
          hint={t.newExhibit.hints.image}
        >
          <input
            id="exhibit-image"
            name="imageUrl"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            className="field"
            placeholder={t.newExhibit.placeholders.image}
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </FormRow>

        <FormRow
          label={t.newExhibit.fields.description}
          htmlFor="exhibit-description"
          hint={t.newExhibit.hints.description}
        >
          <textarea
            id="exhibit-description"
            name="description"
            rows={3}
            className="field"
            placeholder={t.newExhibit.placeholders.description}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormRow>

        <FormRow label={t.newExhibit.fields.room} hint={t.newExhibit.hints.room}>
          <ChoiceRow
            legend={t.newExhibit.fields.room}
            options={roomChoices}
            value={room}
            onChange={(next) => {
              roomChosen.current = true;
              setRoom(next);
            }}
          />
        </FormRow>

        <FormRow label={t.newExhibit.fields.type} hint={t.newExhibit.hints.type}>
          <ChoiceRow
            legend={t.newExhibit.fields.type}
            options={typeChoices}
            value={type}
            onChange={chooseType}
          />
        </FormRow>

        <FormRow
          label={t.newExhibit.fields.displayStyle}
          hint={t.newExhibit.hints.displayStyle}
        >
          <ChoiceRow
            legend={t.newExhibit.fields.displayStyle}
            options={styleChoices}
            value={displayStyle}
            onChange={(next) => {
              styleChosen.current = true;
              setDisplayStyle(next);
            }}
          />
        </FormRow>

        <FormRow
          label={t.newExhibit.fields.note}
          htmlFor="exhibit-note"
          hint={t.newExhibit.hints.note}
        >
          <textarea
            id="exhibit-note"
            name="personalNote"
            rows={4}
            className="field font-display text-base italic"
            placeholder={t.newExhibit.placeholders.note}
            value={personalNote}
            onChange={(event) => setPersonalNote(event.target.value)}
          />
        </FormRow>
      </div>

      <div className="mt-14 flex flex-wrap items-baseline gap-x-9 gap-y-4 border-t border-line pt-9">
        <button type="submit" className="btn-ink" disabled={saving}>
          {saving
            ? mode === "edit"
              ? t.editExhibit.submitting
              : t.newExhibit.submitting
            : mode === "edit"
              ? t.editExhibit.submit
              : t.newExhibit.submit}
        </button>
        <Link
          href={mode === "edit" && exhibit ? `/exhibit/${exhibit.id}` : "/"}
          className="label-caps link-quiet"
        >
          {t.newExhibit.cancel}
        </Link>
        {formError ? (
          <p role="alert" className="text-xs italic text-clay">
            {formError}
          </p>
        ) : null}
      </div>
    </form>
  );
}

