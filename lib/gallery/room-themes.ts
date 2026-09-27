import type { RoomId } from "@/lib/types";
import type { GalleryStop } from "./stops";

export interface RoomTheme {
  wall: string;
  wallDeep: string;
  wallAccent: string;
  floor: string;
  floorLight: string;
  ceiling: string;
  molding: string;
  baseboard: string;
  spotlight: string;
  spotlightWarm: string;
  caption: string;
  captionPlate: string;
  captionInk: string;
  frame: string;
  frameInner: string;
  accent: string;
  text: string;
  textSoft: string;
  headerBg: string;
  headerInk: string;
  navInk: string;
  void: string;
  floorKind: "wood" | "stone" | "tile" | "concrete" | "carpet";
}

export const LOBBY_THEME: RoomTheme = {
  wall: "#e8dcc8",
  wallDeep: "#d4c4a8",
  wallAccent: "#b85c42",
  floor: "#3d2a1f",
  floorLight: "#523629",
  ceiling: "#f5efe3",
  molding: "#c9a88a",
  baseboard: "#5c4030",
  spotlight: "rgba(255, 230, 200, 0.55)",
  spotlightWarm: "rgba(184, 92, 66, 0.18)",
  caption: "#6b5a48",
  captionPlate: "rgba(255, 248, 238, 0.92)",
  captionInk: "#3d3228",
  frame: "#f8f2e8",
  frameInner: "#d9cbb8",
  accent: "#b85c42",
  text: "#2a2218",
  textSoft: "#6b5a48",
  headerBg: "rgba(232, 220, 200, 0.94)",
  headerInk: "#2a2218",
  navInk: "#6b5a48",
  void: "#2a2218",
  floorKind: "wood",
};

export const ROOM_THEMES: Record<RoomId, RoomTheme> = {
  music: {
    wall: "#1a2332",
    wallDeep: "#121a26",
    wallAccent: "#2e3f58",
    floor: "#0f141c",
    floorLight: "#1a222e",
    ceiling: "#232d3d",
    molding: "#3d4f68",
    baseboard: "#2a3548",
    spotlight: "rgba(255, 180, 80, 0.22)",
    spotlightWarm: "rgba(255, 140, 40, 0.12)",
    caption: "#c4b8a8",
    captionPlate: "rgba(26, 35, 50, 0.88)",
    captionInk: "#e8dcc8",
    frame: "#2a3548",
    frameInner: "#1e2838",
    accent: "#e8a04a",
    text: "#f0e8dc",
    textSoft: "#a89f90",
    headerBg: "rgba(18, 26, 38, 0.92)",
    headerInk: "#f0e8dc",
    navInk: "#c4b8a8",
    void: "#0a0e14",
    floorKind: "carpet",
  },
  web: {
    wall: "#2c4a7c",
    wallDeep: "#1e3558",
    wallAccent: "#4a6fa8",
    floor: "#2a2e36",
    floorLight: "#3a404a",
    ceiling: "#eef2f8",
    molding: "#6a8fc4",
    baseboard: "#4a5260",
    spotlight: "rgba(200, 230, 255, 0.35)",
    spotlightWarm: "rgba(120, 180, 255, 0.15)",
    caption: "#c8d4e8",
    captionPlate: "rgba(30, 53, 88, 0.9)",
    captionInk: "#eef4ff",
    frame: "#1a1e28",
    frameInner: "#0f1218",
    accent: "#78b4ff",
    text: "#eef4ff",
    textSoft: "#a8b8d0",
    headerBg: "rgba(30, 53, 88, 0.92)",
    headerInk: "#eef4ff",
    navInk: "#c8d4e8",
    void: "#141820",
    floorKind: "concrete",
  },
  images: {
    wall: "#4a2c35",
    wallDeep: "#3a222a",
    wallAccent: "#5c6647",
    floor: "#2a2420",
    floorLight: "#3a322c",
    ceiling: "#f0ebe0",
    molding: "#8a6a58",
    baseboard: "#4a3a32",
    spotlight: "rgba(255, 248, 235, 0.28)",
    spotlightWarm: "rgba(180, 140, 100, 0.14)",
    caption: "#d8cfc0",
    captionPlate: "rgba(58, 34, 42, 0.9)",
    captionInk: "#f5efe3",
    frame: "#f8f2e8",
    frameInner: "#d4c4b0",
    accent: "#5c6647",
    text: "#f5efe3",
    textSoft: "#c4b8a8",
    headerBg: "rgba(58, 34, 42, 0.92)",
    headerInk: "#f5efe3",
    navInk: "#d8cfc0",
    void: "#1a1418",
    floorKind: "stone",
  },
  objects: {
    wall: "#8a8580",
    wallDeep: "#757068",
    wallAccent: "#a89888",
    floor: "#4a3a2e",
    floorLight: "#5c4a3a",
    ceiling: "#f2ede6",
    molding: "#c4b8a8",
    baseboard: "#6a5a48",
    spotlight: "rgba(255, 245, 230, 0.4)",
    spotlightWarm: "rgba(255, 220, 180, 0.16)",
    caption: "#4a4038",
    captionPlate: "rgba(255, 250, 242, 0.94)",
    captionInk: "#3a3228",
    frame: "#faf6f0",
    frameInner: "#e8e0d4",
    accent: "#8a6858",
    text: "#2a2420",
    textSoft: "#5a5048",
    headerBg: "rgba(138, 133, 128, 0.94)",
    headerInk: "#2a2420",
    navInk: "#4a4038",
    void: "#3a3228",
    floorKind: "wood",
  },
  archive: {
    wall: "#3d2e24",
    wallDeep: "#2a2018",
    wallAccent: "#5c4a38",
    floor: "#2a2018",
    floorLight: "#3a2e24",
    ceiling: "#e8dcc8",
    molding: "#8a7358",
    baseboard: "#4a3a2e",
    spotlight: "rgba(255, 240, 210, 0.22)",
    spotlightWarm: "rgba(200, 160, 100, 0.12)",
    caption: "#c4b8a0",
    captionPlate: "rgba(58, 46, 36, 0.92)",
    captionInk: "#f0e8dc",
    frame: "#e8dcc8",
    frameInner: "#d4c4a8",
    accent: "#a88858",
    text: "#f0e8dc",
    textSoft: "#a89880",
    headerBg: "rgba(45, 34, 24, 0.94)",
    headerInk: "#f0e8dc",
    navInk: "#c4b8a0",
    void: "#1a1410",
    floorKind: "tile",
  },
};

export function themeForStop(stop: GalleryStop): RoomTheme {
  if (stop === "lobby") {
    return LOBBY_THEME;
  }
  return ROOM_THEMES[stop];
}

export function themeToStyle(theme: RoomTheme): Record<string, string> {
  return {
    "--rs-wall": theme.wall,
    "--rs-wall-deep": theme.wallDeep,
    "--rs-wall-accent": theme.wallAccent,
    "--rs-floor": theme.floor,
    "--rs-floor-light": theme.floorLight,
    "--rs-ceiling": theme.ceiling,
    "--rs-molding": theme.molding,
    "--rs-baseboard": theme.baseboard,
    "--rs-spotlight": theme.spotlight,
    "--rs-spotlight-warm": theme.spotlightWarm,
    "--rs-caption": theme.caption,
    "--rs-caption-plate": theme.captionPlate,
    "--rs-caption-ink": theme.captionInk,
    "--rs-frame": theme.frame,
    "--rs-frame-inner": theme.frameInner,
    "--rs-accent": theme.accent,
    "--rs-text": theme.text,
    "--rs-text-soft": theme.textSoft,
    "--rs-header-bg": theme.headerBg,
    "--rs-header-ink": theme.headerInk,
    "--rs-nav-ink": theme.navInk,
    "--rs-void": theme.void,
  };
}
