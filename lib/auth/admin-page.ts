import { redirect } from "next/navigation";
import { curatorExists, isCurator } from "./curator";
import { getSession } from "./session";

/** Redirects to setup, login, or returns when the viewer is the Curator. */
export async function requireCuratorPage(): Promise<void> {
  if (!curatorExists()) {
    redirect("/admin/setup");
  }

  const session = await getSession();
  if (!session?.user || !isCurator(session.user)) {
    redirect("/admin/login");
  }
}
