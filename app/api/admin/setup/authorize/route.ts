import { NextResponse } from "next/server";
import { publicUrl } from "@/lib/auth/public-url";
import { isCuratorSetupAllowed, getSetupCookieOptions, verifyCuratorSetupSecret } from "@/lib/auth/setup";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  if (!isCuratorSetupAllowed()) {
    return NextResponse.redirect(publicUrl("/admin/login", request));
  }

  const secret = new URL(request.url).searchParams.get("secret");
  if (!verifyCuratorSetupSecret(secret)) {
    return NextResponse.redirect(publicUrl("/admin/setup", request));
  }

  const response = NextResponse.redirect(publicUrl("/admin/setup", request));
  const cookie = getSetupCookieOptions();
  response.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });

  return response;
}
