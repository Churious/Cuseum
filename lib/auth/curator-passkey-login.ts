import { generateAuthenticationOptions, type AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { generateRandomString } from "better-auth/crypto";
import { serializeSignedCookie } from "better-call";
import { authConfig } from "./config";
import { getCuratorUserId } from "./curator";
import { auth } from "./server";

/** Must match @better-auth/passkey default `advanced.webAuthnChallengeCookie`. */
const WEBAUTHN_CHALLENGE_COOKIE = "better-auth-passkey";
const MAX_AGE_SECONDS = 300;

interface StoredPasskey {
  credentialID: string;
  transports?: string | null;
}

/**
 * Curator passkey login must send allowCredentials for every stored passkey.
 * Better Auth only adds them when a session already exists, which login does not have.
 */
export async function createCuratorPasskeyLoginOptions(): Promise<Response> {
  const userId = getCuratorUserId();
  if (!userId) {
    return Response.json({ error: "Curator is not configured." }, { status: 404 });
  }

  const ctx = await auth.$context;
  const userPasskeys = (await ctx.adapter.findMany({
    model: "passkey",
    where: [{ field: "userId", value: userId }],
  })) as StoredPasskey[];

  if (userPasskeys.length === 0) {
    return Response.json({ error: "No passkey is registered for this Curator." }, { status: 404 });
  }

  const options = await generateAuthenticationOptions({
    rpID: authConfig.passkey.rpId,
    userVerification: "preferred",
    allowCredentials: userPasskeys.map((passkey) => ({
      id: passkey.credentialID,
      transports: passkey.transports?.split(",") as AuthenticatorTransportFuture[] | undefined,
    })),
  });

  const verificationToken = generateRandomString(32);
  const webAuthnCookie = ctx.createAuthCookie(WEBAUTHN_CHALLENGE_COOKIE);
  const expirationTime = new Date(Date.now() + MAX_AGE_SECONDS * 1000);

  await ctx.internalAdapter.createVerificationValue({
    identifier: verificationToken,
    value: JSON.stringify({
      type: "authentication",
      expectedChallenge: options.challenge,
      userData: { id: userId },
    }),
    expiresAt: expirationTime,
  });

  const signedCookie = await serializeSignedCookie(
    webAuthnCookie.name,
    verificationToken,
    ctx.secret,
    { ...webAuthnCookie.attributes, maxAge: MAX_AGE_SECONDS },
  );

  return Response.json(options, {
    status: 200,
    headers: { "Set-Cookie": signedCookie },
  });
}
