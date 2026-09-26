import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { authConfig } from "./config";

let database: Database.Database | undefined;

function ensureDatabaseDirectory(filePath: string): void {
  const directory = path.dirname(path.resolve(filePath));
  fs.mkdirSync(directory, { recursive: true });
}

function resolveDatabasePath(): string {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return ":memory:";
  }
  return authConfig.databasePath;
}

/** Shared SQLite database for Better Auth and Cuseum metadata tables. */
export function getAuthDatabase(): Database.Database {
  if (!database) {
    const databasePath = resolveDatabasePath();
    if (databasePath !== ":memory:") {
      ensureDatabaseDirectory(databasePath);
    }
    database = new Database(databasePath);
    database.pragma("journal_mode = WAL");
    database.pragma("foreign_keys = ON");
    ensureCuratorTable(database);
    ensureExhibitsTable(database);
  }
  return database;
}

function ensureCuratorTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cuseum_curator (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_id TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );
  `);
}

function ensureExhibitsTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cuseum_exhibits (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      room TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      personal_note TEXT NOT NULL DEFAULT '',
      display_style TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      sample INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_cuseum_exhibits_room ON cuseum_exhibits(room);
    CREATE INDEX IF NOT EXISTS idx_cuseum_exhibits_created_at ON cuseum_exhibits(created_at);
  `);
}
