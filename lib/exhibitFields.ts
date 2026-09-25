import type { DisplayStyle, ExhibitType, RoomId } from "./types";

/**
 * The structural side of exhibit fields: which values exist and where they
 * belong by default.
 *
 * Every human-readable label and hint now lives in the dictionaries
 * (`lib/i18n/translations.ts`) under `exhibitTypes` and `displayStyles`, keyed
 * by these same values — the stored value never changes with the language:
 *
 *   type: "website"  → EN "Website"  / KO "웹사이트"
 */

export const TYPE_VALUES: readonly ExhibitType[] = [
  "website",
  "image",
  "music",
  "object",
  "memory",
] as const;

export const DISPLAY_STYLE_VALUES: readonly DisplayStyle[] = [
  "frame",
  "poster",
  "object",
  "screen",
  "document",
] as const;

/** Where a type naturally belongs when the visitor has not chosen a room yet. */
export const DEFAULT_ROOM_BY_TYPE: Record<ExhibitType, RoomId> = {
  website: "web",
  image: "images",
  music: "music",
  object: "objects",
  memory: "archive",
};

/** How a type is presented when the visitor has not chosen a display style. */
export const DEFAULT_DISPLAY_STYLE_BY_TYPE: Record<ExhibitType, DisplayStyle> = {
  website: "screen",
  image: "frame",
  music: "poster",
  object: "object",
  memory: "document",
};

export function typeForRoom(room: RoomId): ExhibitType {
  const match = TYPE_VALUES.find((value) => DEFAULT_ROOM_BY_TYPE[value] === room);
  return match ?? "website";
}

