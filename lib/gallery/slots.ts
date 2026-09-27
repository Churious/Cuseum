import type { DisplayStyle, RoomId } from "@/lib/types";

export interface GallerySlotSpec {
  /** Grid column 1–3 on the back wall. */
  col: number;
  /** Grid row 1–2 on the back wall. */
  row: number;
  /** Preferred presentation when an exhibit occupies this slot. */
  presentation: DisplayStyle;
  /** Slight rotation for archive / organic layouts. */
  rotate?: string;
}

/** Fixed wall slots per room — exhibits map by index, empty slots stay designed. */
export const ROOM_GALLERY_SLOTS: Record<RoomId, readonly GallerySlotSpec[]> = {
  music: [
    { col: 1, row: 1, presentation: "poster" },
    { col: 2, row: 1, presentation: "poster" },
    { col: 3, row: 1, presentation: "poster" },
    { col: 1, row: 2, presentation: "poster" },
    { col: 2, row: 2, presentation: "poster" },
    { col: 3, row: 2, presentation: "poster" },
  ],
  web: [
    { col: 1, row: 1, presentation: "screen" },
    { col: 2, row: 1, presentation: "screen" },
    { col: 3, row: 1, presentation: "screen" },
    { col: 1, row: 2, presentation: "screen" },
    { col: 2, row: 2, presentation: "screen" },
    { col: 3, row: 2, presentation: "screen" },
  ],
  images: [
    { col: 1, row: 1, presentation: "frame" },
    { col: 2, row: 1, presentation: "frame" },
    { col: 3, row: 1, presentation: "frame" },
    { col: 1, row: 2, presentation: "frame" },
    { col: 2, row: 2, presentation: "frame" },
    { col: 3, row: 2, presentation: "frame" },
  ],
  objects: [
    { col: 1, row: 1, presentation: "object" },
    { col: 2, row: 1, presentation: "object" },
    { col: 3, row: 1, presentation: "object" },
    { col: 1, row: 2, presentation: "object" },
    { col: 2, row: 2, presentation: "object" },
    { col: 3, row: 2, presentation: "object" },
  ],
  archive: [
    { col: 1, row: 1, presentation: "document", rotate: "-1.5deg" },
    { col: 2, row: 1, presentation: "document", rotate: "1deg" },
    { col: 3, row: 1, presentation: "document", rotate: "-0.5deg" },
    { col: 1, row: 2, presentation: "document", rotate: "1.5deg" },
    { col: 2, row: 2, presentation: "document", rotate: "-1deg" },
    { col: 3, row: 2, presentation: "document", rotate: "0.5deg" },
  ],
};

export const EMPTY_SLOT_COUNT = 6;
