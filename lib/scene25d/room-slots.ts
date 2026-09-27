import type { RoomId } from "@/lib/types";

/** Maximum exhibits shown in a 2.5D room wall before linking to collection. */
export const SCENE_SLOT_LIMIT = 12;

export interface SceneSlotLayout {
  left: string;
  top: string;
  width: string;
  zIndex: number;
  rotate?: string;
  translateY?: string;
}

/** Index-based slot positions inside each room's isometric backdrop. */
const ROOM_SLOT_LAYOUTS: Record<RoomId, readonly SceneSlotLayout[]> = {
  music: [
    { left: "8%", top: "30%", width: "14%", zIndex: 3 },
    { left: "24%", top: "28%", width: "14%", zIndex: 4 },
    { left: "40%", top: "30%", width: "14%", zIndex: 3 },
    { left: "56%", top: "28%", width: "14%", zIndex: 4 },
    { left: "72%", top: "30%", width: "14%", zIndex: 3 },
    { left: "82%", top: "28%", width: "12%", zIndex: 2 },
    { left: "10%", top: "52%", width: "14%", zIndex: 5 },
    { left: "26%", top: "50%", width: "14%", zIndex: 6 },
    { left: "42%", top: "52%", width: "14%", zIndex: 5 },
    { left: "58%", top: "50%", width: "14%", zIndex: 6 },
    { left: "74%", top: "52%", width: "14%", zIndex: 5 },
    { left: "16%", top: "70%", width: "14%", zIndex: 7 },
  ],
  images: [
    { left: "10%", top: "18%", width: "16%", zIndex: 2 },
    { left: "28%", top: "16%", width: "16%", zIndex: 3 },
    { left: "46%", top: "18%", width: "16%", zIndex: 2 },
    { left: "64%", top: "16%", width: "16%", zIndex: 3 },
    { left: "82%", top: "18%", width: "14%", zIndex: 2 },
    { left: "12%", top: "42%", width: "16%", zIndex: 4 },
    { left: "30%", top: "40%", width: "16%", zIndex: 5 },
    { left: "48%", top: "42%", width: "16%", zIndex: 4 },
    { left: "66%", top: "40%", width: "16%", zIndex: 5 },
    { left: "84%", top: "42%", width: "12%", zIndex: 4 },
    { left: "22%", top: "66%", width: "16%", zIndex: 6 },
    { left: "52%", top: "64%", width: "16%", zIndex: 7 },
  ],
  web: [
    { left: "12%", top: "22%", width: "18%", zIndex: 2 },
    { left: "36%", top: "20%", width: "18%", zIndex: 3 },
    { left: "60%", top: "22%", width: "18%", zIndex: 2 },
    { left: "78%", top: "20%", width: "16%", zIndex: 3 },
    { left: "10%", top: "46%", width: "18%", zIndex: 4 },
    { left: "34%", top: "44%", width: "18%", zIndex: 5 },
    { left: "58%", top: "46%", width: "18%", zIndex: 4 },
    { left: "76%", top: "44%", width: "16%", zIndex: 5 },
    { left: "14%", top: "68%", width: "18%", zIndex: 6 },
    { left: "38%", top: "66%", width: "18%", zIndex: 7 },
    { left: "62%", top: "68%", width: "18%", zIndex: 6 },
    { left: "80%", top: "66%", width: "14%", zIndex: 5 },
  ],
  objects: [
    { left: "14%", top: "38%", width: "16%", zIndex: 3, translateY: "0" },
    { left: "34%", top: "34%", width: "16%", zIndex: 4, translateY: "-4px" },
    { left: "54%", top: "38%", width: "16%", zIndex: 3, translateY: "0" },
    { left: "74%", top: "34%", width: "16%", zIndex: 4, translateY: "-4px" },
    { left: "22%", top: "58%", width: "16%", zIndex: 5 },
    { left: "44%", top: "54%", width: "16%", zIndex: 6, translateY: "-6px" },
    { left: "66%", top: "58%", width: "16%", zIndex: 5 },
    { left: "10%", top: "72%", width: "14%", zIndex: 2 },
    { left: "30%", top: "74%", width: "14%", zIndex: 3 },
    { left: "50%", top: "72%", width: "14%", zIndex: 2 },
    { left: "70%", top: "74%", width: "14%", zIndex: 3 },
    { left: "84%", top: "70%", width: "12%", zIndex: 2 },
  ],
  archive: [
    { left: "18%", top: "34%", width: "14%", zIndex: 3, rotate: "-2deg" },
    { left: "32%", top: "32%", width: "14%", zIndex: 4, rotate: "1.5deg" },
    { left: "46%", top: "34%", width: "14%", zIndex: 3, rotate: "-1deg" },
    { left: "60%", top: "32%", width: "14%", zIndex: 4, rotate: "2deg" },
    { left: "74%", top: "34%", width: "14%", zIndex: 3, rotate: "-1.5deg" },
    { left: "24%", top: "52%", width: "14%", zIndex: 5, rotate: "1deg" },
    { left: "38%", top: "50%", width: "14%", zIndex: 6, rotate: "-2deg" },
    { left: "52%", top: "52%", width: "14%", zIndex: 5, rotate: "1.5deg" },
    { left: "66%", top: "50%", width: "14%", zIndex: 6, rotate: "-1deg" },
    { left: "30%", top: "68%", width: "14%", zIndex: 7, rotate: "2deg" },
    { left: "48%", top: "66%", width: "14%", zIndex: 8, rotate: "-1.5deg" },
    { left: "66%", top: "68%", width: "14%", zIndex: 7, rotate: "1deg" },
  ],
};

export function sceneBackdropForRoom(room: RoomId): string {
  return `/scenes/room-${room}.svg`;
}

export function slotLayoutForIndex(room: RoomId, index: number): SceneSlotLayout {
  const layouts = ROOM_SLOT_LAYOUTS[room];
  return layouts[index % layouts.length];
}
