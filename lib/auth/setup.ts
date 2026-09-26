import { createHmac, timingSafeEqual } from "node:crypto";
import { authConfig } from "./config";
import { curatorExists } from "./curator";

export const SETUP_COOKIE_NAME = "cuseum.setup";
const SETUP_COOKIE_MAX_AGE_SECONDS = 60 * 30;

function signSetupToken(): string {
  return createHmac("sha256", authConfig.curatorSetupSecret)
    .update("cuseum-curator-setup")
    .digest("base64url");
}

/** Constant-time comparison for the Curator setup secret supplied by the installer. */
export function verifyCuratorSetupSecret(secret: string | null | undefined): boolean {
  if (!secret) {
    return false;
  }

  const expected = authConfig.curatorSetupSecret;
  const provided = Buffer.from(secret);
  const reference = Buffer.from(expected);

  if (provided.length !== reference.length) {
    return false;
  }

  return timingSafeEqual(provided, reference);
}

/** Whether first-time Curator setup is still allowed on this installation. */
export function isCuratorSetupAllowed(): boolean {
  return !curatorExists();
}

export function createSetupCookieValue(): string {
  return signSetupToken();
}

export function verifySetupCookieValue(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const expected = signSetupToken();
  const provided = Buffer.from(value);
  const reference = Buffer.from(expected);

  if (provided.length !== reference.length) {
    return false;
  }

  return timingSafeEqual(provided, reference);
}

export function getSetupCookieOptions() {
  return {
    name: SETUP_COOKIE_NAME,
    value: createSetupCookieValue(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: authConfig.isProduction,
    // Must cover /api/auth/* so passkey registration during setup receives this cookie.
    path: "/",
    maxAge: SETUP_COOKIE_MAX_AGE_SECONDS,
  };
}

export function getSetupCookieClearOptions() {
  return {
    name: SETUP_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: authConfig.isProduction,
    path: "/",
    maxAge: 0,
  };
}
