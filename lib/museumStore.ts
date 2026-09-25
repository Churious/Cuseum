import { emptyRoomCounts } from "./rooms";
import {
  createExhibit,
  insertSampleExhibits,
  listExhibits,
  removeExhibit,
  removeSampleExhibits,
  updateExhibit,
} from "./repository";
import { SAMPLE_EXHIBITS } from "./sampleExhibits";
import type { Exhibit, ExhibitDraft, RoomId } from "./types";

export interface MuseumState {
  exhibits: Exhibit[];
  /** False until IndexedDB has answered once. */
  ready: boolean;
  /** A code, not a sentence: the interface translates it. */
  error: MuseumErrorCode | null;
}

/** Set when the browser refuses to open IndexedDB (e.g. strict private mode). */
export type MuseumErrorCode = "storage-unavailable";

export interface MuseumStats {
  total: number;
  byRoom: Record<RoomId, number>;
  /** Epoch ms of the oldest exhibit, or null when the museum is empty. */
  firstCollectedAt: number | null;
  sampleCount: number;
}

const EMPTY_STATE: MuseumState = { exhibits: [], ready: false, error: null };

/**
 * A very small external store. Pages read it with useSyncExternalStore
 * (see hooks/useMuseum.ts); mutations go through the functions below.
 * No state management library, on purpose.
 */
let state: MuseumState = EMPTY_STATE;
const listeners = new Set<() => void>();

function setState(next: MuseumState): void {
  state = next;
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeToMuseum(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMuseumState(): MuseumState {
  return state;
}

/** Stable snapshot used during server rendering, so hydration never mismatches. */
export function getServerMuseumState(): MuseumState {
  return EMPTY_STATE;
}

let initPromise: Promise<void> | null = null;

/** Opens the database and loads the collection. Safe to call repeatedly. */
export function initMuseum(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (!initPromise) {
    initPromise = refresh().catch(reportStorageFailure);
  }
  return initPromise;
}

async function refresh(): Promise<void> {
  const exhibits = await listExhibits();
  setState({ exhibits, ready: true, error: null });
}

/**
 * Records that the browser would not give us a museum. The detail goes to the
 * console for developers; the visitor sees a translated sentence instead.
 */
function reportStorageFailure(error: unknown): void {
  console.error("[Cuseum] local storage is unavailable:", error);
  setState({ ...state, ready: true, error: "storage-unavailable" });
}

async function mutate(operation: () => Promise<void>): Promise<void> {
  try {
    await operation();
    await refresh();
  } catch (error) {
    reportStorageFailure(error);
    throw error;
  }
}

export async function addExhibit(draft: ExhibitDraft): Promise<Exhibit> {
  let created: Exhibit | null = null;
  await mutate(async () => {
    created = await createExhibit(draft);
  });
  if (!created) {
    throw new Error("The exhibit could not be placed in the museum.");
  }
  return created;
}

export async function editExhibit(
  id: string,
  patch: Partial<ExhibitDraft>,
): Promise<void> {
  await mutate(() => updateExhibit(id, patch));
}

export async function withdrawExhibit(id: string): Promise<void> {
  await mutate(() => removeExhibit(id));
}

export async function addSampleExhibits(): Promise<number> {
  let inserted = 0;
  await mutate(async () => {
    inserted = await insertSampleExhibits(SAMPLE_EXHIBITS);
  });
  return inserted;
}

export async function withdrawSampleExhibits(): Promise<number> {
  let removed = 0;
  await mutate(async () => {
    removed = await removeSampleExhibits();
  });
  return removed;
}

export function selectMuseumStats(exhibits: Exhibit[]): MuseumStats {
  const byRoom = emptyRoomCounts();
  let firstCollectedAt: number | null = null;
  let sampleCount = 0;

  for (const exhibit of exhibits) {
    byRoom[exhibit.room] += 1;
    if (exhibit.sample === true) {
      sampleCount += 1;
    }
    if (firstCollectedAt === null || exhibit.createdAt < firstCollectedAt) {
      firstCollectedAt = exhibit.createdAt;
    }
  }

  return { total: exhibits.length, byRoom, firstCollectedAt, sampleCount };
}

/** Picks one exhibit at random, for "Take me somewhere". */
export function pickRandomExhibit(exhibits: readonly Exhibit[]): Exhibit | null {
  if (exhibits.length === 0) {
    return null;
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return exhibits[buffer[0] % exhibits.length] ?? null;
  }
  return exhibits[Math.floor(Math.random() * exhibits.length)] ?? null;
}

export function selectExhibitsByRoom(
  exhibits: readonly Exhibit[],
  room: RoomId,
): Exhibit[] {
  return exhibits.filter((exhibit) => exhibit.room === room);
}
