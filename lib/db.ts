import Dexie, { type EntityTable } from "dexie";
import type { Exhibit } from "./types";

/**
 * Cuseum keeps everything in the visitor's own browser.
 * There is no account, no server database, and no sync.
 *
 * This module touches IndexedDB, so it is only ever imported from client
 * components (through lib/repository.ts and lib/museumStore.ts).
 */
export const cuseumDb = new Dexie("cuseum") as Dexie & {
  exhibits: EntityTable<Exhibit, "id">;
};

cuseumDb.version(1).stores({
  exhibits: "id, room, type, createdAt",
});

export type CuseumDatabase = typeof cuseumDb;
