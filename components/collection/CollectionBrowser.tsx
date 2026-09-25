"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CollectionRow } from "./CollectionRow";
import { EmptyState, LoadingRoom } from "@/components/site/Notices";
import { useMuseum } from "@/hooks/useMuseum";
import { TYPE_VALUES } from "@/lib/exhibitFields";
import { countLabel, hostnameOf } from "@/lib/format";
import { useLocale } from "@/lib/i18n/useLocale";
import { ROOMS } from "@/lib/rooms";
import type { ExhibitType, RoomId } from "@/lib/types";

type RoomFilter = RoomId | "all";
type TypeFilter = ExhibitType | "all";
type SortOrder = "newest" | "oldest" | "title";

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

/**
 * The registrar's view: the only screen in Cuseum built for managing rather
 * than looking. It keeps the same type, the same hairlines, and stays out of
 * the way of the lobby.
 */
export function CollectionBrowser({ initialRoom }: { initialRoom?: RoomId }) {
  const { exhibits, ready } = useMuseum();
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState<RoomFilter>(initialRoom ?? "all");
  const [type, setType] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortOrder>("newest");

  const roomFilters: readonly FilterOption<RoomFilter>[] = [
    { value: "all", label: t.collection.allRooms },
    ...ROOMS.map((definition) => ({
      value: definition.id as RoomFilter,
      label: t.rooms.names[definition.id],
    })),
  ];

  const typeFilters: readonly FilterOption<TypeFilter>[] = [
    { value: "all", label: t.collection.allTypes },
    ...TYPE_VALUES.map((value) => ({
      value: value as TypeFilter,
      label: t.exhibitTypes.labels[value],
    })),
  ];

  const sortOptions: readonly FilterOption<SortOrder>[] = [
    { value: "newest", label: t.collection.newest },
    { value: "oldest", label: t.collection.oldest },
    { value: "title", label: t.collection.byTitle },
  ];

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = exhibits.filter((exhibit) => {
      if (room !== "all" && exhibit.room !== room) {
        return false;
      }
      if (type !== "all" && exhibit.type !== type) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const haystack = [
        exhibit.title,
        exhibit.description,
        exhibit.personalNote,
        hostnameOf(exhibit.url),
        exhibit.url,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    const sorted = [...filtered];
    if (sort === "oldest") {
      sorted.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
    return sorted;
  }, [exhibits, query, room, type, sort]);

  const hasFilters = query.trim().length > 0 || room !== "all" || type !== "all";

  function clearFilters() {
    setQuery("");
    setRoom("all");
    setType("all");
  }

  return (
    <div className="pt-16 md:pt-24">
      <header>
        <p className="label-caps">{t.collection.eyebrow}</p>
        <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] text-ink md:text-[3.6rem]">
          {t.collection.title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-ink-soft">
          {t.collection.intro}
        </p>
      </header>

      <div className="mt-14 space-y-6 border-t border-line pt-8">
        <div className="grid gap-3 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-6">
          <label htmlFor="collection-search" className="label-caps md:pt-1">
            {t.collection.searchLabel}
          </label>
          <input
            id="collection-search"
            type="search"
            className="field"
            aria-label={t.collection.searchAria}
            placeholder={t.collection.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <FilterRow
          legend={t.collection.legends.room}
          options={roomFilters}
          value={room}
          onChange={setRoom}
        />
        <FilterRow
          legend={t.collection.legends.type}
          options={typeFilters}
          value={type}
          onChange={setType}
        />
        <FilterRow
          legend={t.collection.legends.order}
          options={sortOptions}
          value={sort}
          onChange={setSort}
        />
      </div>

      <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-line pb-4">
        <h2 className="label-caps">
          {ready ? countLabel(results.length, locale) : "…"}
        </h2>
        {hasFilters ? (
          <button type="button" onClick={clearFilters} className="label-caps link-quiet">
            {t.collection.clear}
          </button>
        ) : null}
      </div>

      {!ready ? (
        <LoadingRoom label={t.loading.register} />
      ) : results.length === 0 ? (
        <EmptyState
          title={
            exhibits.length === 0
              ? t.collection.emptyMuseumTitle
              : t.collection.emptyFilterTitle
          }
          line={
            exhibits.length === 0
              ? t.collection.emptyMuseumLine
              : t.collection.emptyFilterLine
          }
          action={
            exhibits.length === 0 ? (
              <Link href="/new" className="btn-ink">
                {t.collection.addToMuseum}
              </Link>
            ) : (
              <button type="button" onClick={clearFilters} className="btn-line">
                {t.collection.clear}
              </button>
            )
          }
        />
      ) : (
        <ul>
          {results.map((exhibit) => (
            <CollectionRow key={exhibit.id} exhibit={exhibit} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterRow<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-6">
      <span className="label-caps md:pt-0.5">{legend}</span>
      <div role="group" aria-label={legend} className="flex flex-wrap gap-x-7 gap-y-3">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`label-caps border-b pb-0.5 text-[0.62rem] tracking-[0.16em] transition-colors duration-300 ${
                isSelected
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

