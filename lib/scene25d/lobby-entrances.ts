import type { RoomId } from "@/lib/types";

export interface LobbyEntrance {
  room: RoomId;
  left: string;
  top: string;
  width: string;
  height: string;
}

/** Screen-space hit areas aligned to the lobby isometric SVG archways. */
export const LOBBY_ENTRANCES: readonly LobbyEntrance[] = [
  { room: "music", left: "8%", top: "42%", width: "14%", height: "22%" },
  { room: "web", left: "26%", top: "38%", width: "14%", height: "24%" },
  { room: "images", left: "44%", top: "34%", width: "14%", height: "26%" },
  { room: "objects", left: "62%", top: "38%", width: "14%", height: "24%" },
  { room: "archive", left: "80%", top: "42%", width: "14%", height: "22%" },
];
