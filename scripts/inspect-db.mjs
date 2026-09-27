import Database from "better-sqlite3";

const db = new Database(process.argv[2] ?? "/app/data/cuseum.db");

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  .all();

const users = db.prepare("SELECT id, email, name FROM user").all();
const passkeys = db
  .prepare(
    "SELECT id, userId, name, credentialID, deviceType, backedUp, transports, length(credentialID) as credLen FROM passkey",
  )
  .all();
const curator = db.prepare("SELECT user_id, created_at FROM cuseum_curator").all();
const accounts = db
  .prepare("SELECT id, userId, providerId, accountId FROM account")
  .all();

console.log(JSON.stringify({ tables, users, passkeys, curator, accounts }, null, 2));
