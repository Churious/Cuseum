"use client";

import type { ReactNode } from "react";
import { RoomNavigation } from "./RoomNavigation";

export function MuseumRoomShell({ children }: { children: ReactNode }) {
  return (
    <div className="gallery-stage">
      <RoomNavigation side="left" />
      <div className="gallery-stage__viewport">{children}</div>
      <RoomNavigation side="right" />
    </div>
  );
}
