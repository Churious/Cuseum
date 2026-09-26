import { getAuthDatabase } from "./database";

export interface CuratorUserRef {
  id: string;
}

/** Returns the Better Auth user id of the single Cuseum Curator, if configured. */
export function getCuratorUserId(): string | null {
  const row = getAuthDatabase()
    .prepare("SELECT user_id FROM cuseum_curator WHERE id = 1")
    .get() as { user_id: string } | undefined;
  return row?.user_id ?? null;
}

/** True when a Curator account has already been provisioned. */
export function curatorExists(): boolean {
  return getCuratorUserId() !== null;
}

/**
 * Provider-independent Curator authorization.
 * Authentication method must never influence this check.
 */
export function isCurator(user: CuratorUserRef | null | undefined): boolean {
  if (!user?.id) {
    return false;
  }
  const curatorUserId = getCuratorUserId();
  return curatorUserId !== null && curatorUserId === user.id;
}

/**
 * Assigns the first (and only) Curator user.
 * Throws when a Curator is already configured.
 */
export function assignCurator(userId: string): void {
  if (curatorExists()) {
    throw new Error("Curator is already configured.");
  }

  getAuthDatabase()
    .prepare("INSERT INTO cuseum_curator (id, user_id, created_at) VALUES (1, ?, ?)")
    .run(userId, Date.now());
}
