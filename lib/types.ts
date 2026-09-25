/**
 * The Cuseum data model.
 *
 * An Exhibit is something the visitor found on the internet and decided to put
 * on display. It is never called a "bookmark" anywhere in this codebase.
 */

export type ExhibitType = "website" | "image" | "music" | "object" | "memory";

export type RoomId = "web" | "images" | "music" | "objects" | "archive";

export type DisplayStyle = "frame" | "poster" | "object" | "screen" | "document";

export interface Exhibit {
  id: string;
  title: string;
  type: ExhibitType;
  room: RoomId;
  url: string;
  imageUrl: string;
  description: string;
  personalNote: string;
  displayStyle: DisplayStyle;
  /** Epoch milliseconds. Used for "Added September 25, 2026". */
  createdAt: number;
  /** True only for the built-in sample set, so it can be removed in one step. */
  sample?: boolean;
}

/** Everything a new exhibit needs. id/createdAt are assigned by the repository. */
export type ExhibitDraft = Omit<Exhibit, "id" | "createdAt" | "sample">;

export function isExhibitType(value: string): value is ExhibitType {
  return (
    value === "website" ||
    value === "image" ||
    value === "music" ||
    value === "object" ||
    value === "memory"
  );
}

export function isDisplayStyle(value: string): value is DisplayStyle {
  return (
    value === "frame" ||
    value === "poster" ||
    value === "object" ||
    value === "screen" ||
    value === "document"
  );
}
