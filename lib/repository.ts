import { cuseumDb } from "./db";
import type { Exhibit, ExhibitDraft, RoomId } from "./types";

/** A stable, readable id without pulling in a uuid dependency. */
export function createExhibitId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `exhibit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Newest first, which is how every room wall is hung. */
export async function listExhibits(): Promise<Exhibit[]> {
  const exhibits = await cuseumDb.exhibits.orderBy("createdAt").reverse().toArray();
  return exhibits;
}

export async function listRoomExhibits(room: RoomId): Promise<Exhibit[]> {
  const exhibits = await cuseumDb.exhibits.where("room").equals(room).toArray();
  return exhibits.sort((a, b) => b.createdAt - a.createdAt);
}

export async function createExhibit(draft: ExhibitDraft): Promise<Exhibit> {
  const exhibit: Exhibit = {
    ...draft,
    id: createExhibitId(),
    createdAt: Date.now(),
  };
  await cuseumDb.exhibits.add(exhibit);
  return exhibit;
}

export async function updateExhibit(
  id: string,
  patch: Partial<ExhibitDraft>,
): Promise<void> {
  await cuseumDb.exhibits.update(id, patch);
}

export async function removeExhibit(id: string): Promise<void> {
  await cuseumDb.exhibits.delete(id);
}

/** Inserts the sample exhibits, skipping any that are already on display. */
export async function insertSampleExhibits(
  samples: readonly Exhibit[],
): Promise<number> {
  const existing = await cuseumDb.exhibits.bulkGet(samples.map((s) => s.id));
  const missing = samples.filter((_, index) => !existing[index]);
  if (missing.length > 0) {
    await cuseumDb.exhibits.bulkAdd([...missing]);
  }
  return missing.length;
}

/** Removes only exhibits flagged as sample data. */
export async function removeSampleExhibits(): Promise<number> {
  const samples = (await cuseumDb.exhibits.toArray()).filter(
    (exhibit) => exhibit.sample === true,
  );
  await cuseumDb.exhibits.bulkDelete(samples.map((exhibit) => exhibit.id));
  return samples.length;
}
