import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { assignCurator } from "@/lib/auth/curator";
import { createPasswordCuratorUser } from "@/lib/auth/create-password-curator";
import { isAuthMethodEnabled } from "@/lib/auth/config";
import { auth } from "@/lib/auth/server";
import {
  getSetupCookieClearOptions,
  isCuratorSetupAllowed,
  verifySetupCookieValue,
} from "@/lib/auth/setup";

export const dynamic = "force-dynamic";

interface SetupPasswordBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthMethodEnabled("password")) {
    return NextResponse.json({ error: "Password authentication is not enabled." }, { status: 404 });
  }

  if (!isCuratorSetupAllowed()) {
    return NextResponse.json({ error: "Curator setup is no longer available." }, { status: 403 });
  }

  const jar = await cookies();
  const setupCookie = jar.get("cuseum.setup")?.value;
  if (!verifySetupCookieValue(setupCookie)) {
    return NextResponse.json({ error: "Invalid or expired setup authorization." }, { status: 403 });
  }

  let body: SetupPasswordBody;
  try {
    body = (await request.json()) as SetupPasswordBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (password.length < 12) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters." },
      { status: 400 },
    );
  }

  try {
    await createPasswordCuratorUser(email, password);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create Curator account." },
      { status: 400 },
    );
  }

  const signIn = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    asResponse: true,
  });

  if (!signIn.ok) {
    return NextResponse.json(
      { error: "Curator account was created but sign-in failed." },
      { status: 500 },
    );
  }

  const session = await auth.api.getSession({
    headers: signIn.headers,
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Curator account was created but no session was issued." },
      { status: 500 },
    );
  }

  try {
    assignCurator(session.user.id);
  } catch {
    return NextResponse.json({ error: "Curator is already configured." }, { status: 409 });
  }

  const response = NextResponse.json({ ok: true });
  for (const [key, value] of signIn.headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      response.headers.append("set-cookie", value);
    }
  }

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
