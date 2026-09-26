import { headers } from "next/headers";
import { auth } from "./server";
import { isCurator } from "./curator";
import { CuratorAuthorizationError } from "./errors";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

/** Returns the session only when the signed-in user is the Cuseum Curator. */
export async function requireCuratorSession() {
  const session = await getSession();

  if (!session?.user || !isCurator(session.user)) {
    throw new CuratorAuthorizationError();
  }

  return session;
}
