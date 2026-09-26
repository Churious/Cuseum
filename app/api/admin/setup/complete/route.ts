import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { assignCurator } from "@/lib/auth/curator";
import { auth } from "@/lib/auth/server";
import {
  getSetupCookieClearOptions,
  isCuratorSetupAllowed,
  verifySetupCookieValue,
} from "@/lib/auth/setup";

export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  if (!isCuratorSetupAllowed()) {
    return NextResponse.json({ error: "Curator setup is no longer available." }, { status: 403 });
  }

  const jar = await cookies();
  const setupCookie = jar.get("cuseum.setup")?.value;
  if (!verifySetupCookieValue(setupCookie)) {
    return NextResponse.json({ error: "Invalid or expired setup authorization." }, { status: 403 });
  }

  const session = await auth.api.getSession({
    headers: new Headers({ cookie: jar.toString() }),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }

  try {
    assignCurator(session.user.id);
  } catch {
    return NextResponse.json({ error: "Curator is already configured." }, { status: 409 });
  }

  const response = NextResponse.json({ ok: true });
  const clear = getSetupCookieClearOptions();
  response.cookies.set(clear.name, clear.value, {
    httpOnly: clear.httpOnly,
    sameSite: clear.sameSite,
    secure: clear.secure,
    path: clear.path,
    maxAge: clear.maxAge,
  });

  return response;
}
