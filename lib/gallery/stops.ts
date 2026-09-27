import { ROOMS } from "@/lib/rooms";
import type { RoomId } from "@/lib/types";

export type GalleryStop = "lobby" | RoomId;

export const GALLERY_STOPS: readonly GalleryStop[] = [
  "lobby",
  ...ROOMS.map((room) => room.id),
];

export function galleryStopIndex(stop: GalleryStop): number {
  return GALLERY_STOPS.indexOf(stop);
}

export function galleryStopFromIndex(index: number): GalleryStop {
  const normalized = ((index % GALLERY_STOPS.length) + GALLERY_STOPS.length) % GALLERY_STOPS.length;
  return GALLERY_STOPS[normalized];
}

export function galleryStopFromPath(pathname: string): GalleryStop {
  if (pathname === "/" || pathname === "/rooms") {
    return "lobby";
  }
  const match = pathname.match(/^\/rooms\/([^/]+)/);
  if (match && ROOMS.some((room) => room.id === match[1])) {
    return match[1] as RoomId;
  }
  return "lobby";
}

export function pathForGalleryStop(stop: GalleryStop): string {
  if (stop === "lobby") {
    return "/";
  }
  return `/rooms/${stop}`;
}
