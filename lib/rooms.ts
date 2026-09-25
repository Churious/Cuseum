import type { RoomId } from "./types";

export interface RoomDefinition {
  id: RoomId;
  /** Roman numeral used as a room marker in the lobby. Never translated. */
  numeral: string;
}

/**
 * The five rooms of v0.1. Order is the canonical order used everywhere:
 * lobby index, selectors, filters.
 *
 * A room holds only structural facts. Its name, tagline, and empty-state line
 * are interface text, so they live in the dictionaries
 * (`lib/i18n/translations.ts`) keyed by these same ids:
 *
 *   music → EN "Music" / KO "음악"
 *
 * The stored value itself never changes with the language.
 */
export const ROOMS: readonly RoomDefinition[] = [
  { id: "music", numeral: "I" },
  { id: "web", numeral: "II" },
  { id: "images", numeral: "III" },
  { id: "objects", numeral: "IV" },
  { id: "archive", numeral: "V" },
] as const;

export const ROOM_IDS: readonly RoomId[] = ROOMS.map((room) => room.id);

export function isRoomId(value: string): value is RoomId {
  return ROOMS.some((room) => room.id === value);
}

export function roomById(id: RoomId): RoomDefinition {
  const room = ROOMS.find((candidate) => candidate.id === id);
  if (!room) {
    throw new Error(`Unknown room: ${id}`);
  }
  return room;
}

/** RoomId -> 0, so counts can be read without guarding for undefined. */
export function emptyRoomCounts(): Record<RoomId, number> {
  return ROOMS.reduce(
    (counts, room) => {
      counts[room.id] = 0;
      return counts;
    },
    {} as Record<RoomId, number>,
  );
}
