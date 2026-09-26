import { emptyRoomCounts } from "./rooms";
import type { Exhibit, ExhibitDraft, RoomId } from "./types";

export interface MuseumState {
  exhibits: Exhibit[];
  /** False until the collection has loaded once. */
  ready: boolean;
  /** A code, not a sentence: the interface translates it. */
  error: MuseumErrorCode | null;
}

/** Set when the museum collection cannot be loaded from the server. */
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

/** Loads the collection from the server. Safe to call repeatedly. */
export function initMuseum(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (!initPromise) {
    initPromise = refresh().catch(reportLoadFailure);
  }
  return initPromise;
}

async function refresh(): Promise<void> {
  const response = await fetch("/api/exhibits", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load exhibits (${response.status}).`);
  }
  const exhibits = (await response.json()) as Exhibit[];
  setState({ exhibits, ready: true, error: null });
}

function reportLoadFailure(error: unknown): void {
  console.error("[Cuseum] the museum collection could not be loaded:", error);
  setState({ ...state, ready: true, error: "storage-unavailable" });
}

async function mutate(operation: () => Promise<void>): Promise<void> {
  try {
    await operation();
    await refresh();
  } catch (error) {
    reportLoadFailure(error);
    throw error;
  }
}

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

async function patchJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

async function deleteRequest(url: string): Promise<void> {
  const response = await fetch(url, { method: "DELETE", cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }
}

export async function addExhibit(draft: ExhibitDraft): Promise<Exhibit> {
  let created: Exhibit | null = null;
  await mutate(async () => {
    created = await postJson<Exhibit>("/api/exhibits", draft);
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
  await mutate(async () => {
    await patchJson<Exhibit>(`/api/exhibits/${id}`, patch);
  });
}

export async function withdrawExhibit(id: string): Promise<void> {
  await mutate(async () => {
    await deleteRequest(`/api/exhibits/${id}`);
  });
}

export async function addSampleExhibits(): Promise<number> {
  let inserted = 0;
  await mutate(async () => {
    const result = await postJson<{ inserted: number }>("/api/exhibits/samples");
    inserted = result.inserted;
  });
  return inserted;
}

export async function withdrawSampleExhibits(): Promise<number> {
  let removed = 0;
  await mutate(async () => {
    const response = await fetch("/api/exhibits/samples", {
      method: "DELETE",
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}).`);
    }
    const result = (await response.json()) as { removed: number };
    removed = result.removed;
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
