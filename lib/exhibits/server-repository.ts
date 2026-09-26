import { randomUUID } from "node:crypto";
import { getAuthDatabase } from "@/lib/auth/database";
import { SAMPLE_EXHIBITS } from "@/lib/sampleExhibits";
import type { Exhibit, ExhibitDraft, RoomId } from "@/lib/types";

interface ExhibitRow {
  id: string;
  title: string;
  type: string;
  room: string;
  url: string;
  image_url: string;
  description: string;
  personal_note: string;
  display_style: string;
  created_at: number;
  sample: number;
}

function rowToExhibit(row: ExhibitRow): Exhibit {
  const exhibit: Exhibit = {
    id: row.id,
    title: row.title,
    type: row.type as Exhibit["type"],
    room: row.room as RoomId,
    url: row.url,
    imageUrl: row.image_url,
    description: row.description,
    personalNote: row.personal_note,
    displayStyle: row.display_style as Exhibit["displayStyle"],
    createdAt: row.created_at,
  };
  if (row.sample === 1) {
    exhibit.sample = true;
  }
  return exhibit;
}

function createExhibitId(): string {
  return randomUUID();
}

/** Newest first, which is how every room wall is hung. */
export function listExhibits(): Exhibit[] {
  const db = getAuthDatabase();
  const rows = db
    .prepare(
      `SELECT id, title, type, room, url, image_url, description, personal_note,
              display_style, created_at, sample
       FROM cuseum_exhibits
       ORDER BY created_at DESC`,
    )
    .all() as ExhibitRow[];
  return rows.map(rowToExhibit);
}

export function getExhibit(id: string): Exhibit | null {
  const db = getAuthDatabase();
  const row = db
    .prepare(
      `SELECT id, title, type, room, url, image_url, description, personal_note,
              display_style, created_at, sample
       FROM cuseum_exhibits
       WHERE id = ?`,
    )
    .get(id) as ExhibitRow | undefined;
  return row ? rowToExhibit(row) : null;
}

export function createExhibit(draft: ExhibitDraft): Exhibit {
  const db = getAuthDatabase();
  const exhibit: Exhibit = {
    ...draft,
    id: createExhibitId(),
    createdAt: Date.now(),
  };

  db.prepare(
    `INSERT INTO cuseum_exhibits (
       id, title, type, room, url, image_url, description, personal_note,
       display_style, created_at, sample
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
  ).run(
    exhibit.id,
    exhibit.title,
    exhibit.type,
    exhibit.room,
    exhibit.url,
    exhibit.imageUrl,
    exhibit.description,
    exhibit.personalNote,
    exhibit.displayStyle,
    exhibit.createdAt,
  );

  return exhibit;
}

export function updateExhibit(id: string, patch: Partial<ExhibitDraft>): Exhibit | null {
  const existing = getExhibit(id);
  if (!existing) {
    return null;
  }

  const next: Exhibit = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    sample: existing.sample,
  };

  const db = getAuthDatabase();
  db.prepare(
    `UPDATE cuseum_exhibits
     SET title = ?, type = ?, room = ?, url = ?, image_url = ?, description = ?,
         personal_note = ?, display_style = ?
     WHERE id = ?`,
  ).run(
    next.title,
    next.type,
    next.room,
    next.url,
    next.imageUrl,
    next.description,
    next.personalNote,
    next.displayStyle,
    id,
  );

  return next;
}

export function removeExhibit(id: string): boolean {
  const db = getAuthDatabase();
  const result = db.prepare("DELETE FROM cuseum_exhibits WHERE id = ?").run(id);
  return result.changes > 0;
}

/** Inserts the sample exhibits, skipping any that are already on display. */
export function insertSampleExhibits(): number {
  const db = getAuthDatabase();
  const insert = db.prepare(
    `INSERT OR IGNORE INTO cuseum_exhibits (
       id, title, type, room, url, image_url, description, personal_note,
       display_style, created_at, sample
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
  );

  let inserted = 0;
  const insertMany = db.transaction((samples: readonly Exhibit[]) => {
    for (const sample of samples) {
      const result = insert.run(
        sample.id,
        sample.title,
        sample.type,
        sample.room,
        sample.url,
        sample.imageUrl,
        sample.description,
        sample.personalNote,
        sample.displayStyle,
        sample.createdAt,
      );
      if (result.changes > 0) {
        inserted += 1;
      }
    }
  });

  insertMany(SAMPLE_EXHIBITS);
  return inserted;
}

/** Removes only exhibits flagged as sample data. */
export function removeSampleExhibits(): number {
  const db = getAuthDatabase();
  const result = db.prepare("DELETE FROM cuseum_exhibits WHERE sample = 1").run();
  return result.changes;
}
