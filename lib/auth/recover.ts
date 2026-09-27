import { createHmac, timingSafeEqual } from "node:crypto";
import { authConfig } from "./config";
import { curatorExists } from "./curator";

export const RECOVER_COOKIE_NAME = "cuseum.recover";
const RECOVER_COOKIE_MAX_AGE_SECONDS = 60 * 30;

function signRecoverToken(): string {
  return createHmac("sha256", authConfig.curatorSetupSecret)
    .update("cuseum-curator-recover")
    .digest("base64url");
}

export function verifyCuratorRecoverSecret(secret: string | null | undefined): boolean {
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

export function isCuratorRecoverAllowed(): boolean {
  return curatorExists();
}

export function createRecoverCookieValue(): string {
  return signRecoverToken();
}

export function verifyRecoverCookieValue(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const expected = signRecoverToken();
  const provided = Buffer.from(value);
  const reference = Buffer.from(expected);

  if (provided.length !== reference.length) {
    return false;
  }

  return timingSafeEqual(provided, reference);
}

export function getRecoverCookieOptions() {
  return {
    name: RECOVER_COOKIE_NAME,
    value: createRecoverCookieValue(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: authConfig.isProduction,
    path: "/",
    maxAge: RECOVER_COOKIE_MAX_AGE_SECONDS,
  };
}

export function getRecoverCookieClearOptions() {
  return {
    name: RECOVER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: authConfig.isProduction,
    path: "/",
    maxAge: 0,
  };
}
