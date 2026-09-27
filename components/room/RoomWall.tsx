"use client";

import { RoomWall25D } from "./RoomWall25D";
import { RoomWallClassic } from "./RoomWallClassic";
import type { RoomId } from "@/lib/types";

/**
 * Responsive room wall: 2D on mobile and when reduced motion is preferred;
 * isometric 2.5D on desktop with motion allowed.
 */
export function RoomWall({ room }: { room: RoomId }) {
  return (
    <>
      <div className="md:motion-safe:hidden">
        <RoomWallClassic room={room} />
      </div>
      <div className="hidden md:motion-safe:block">
        <RoomWall25D room={room} />
      </div>
    </>
  );
}
