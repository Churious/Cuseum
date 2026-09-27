import { randomUUID } from "node:crypto";
import type { GenericEndpointContext } from "@better-auth/core";
import { passkey } from "@better-auth/passkey";
import { authConfig, isAuthMethodEnabled } from "../config";
import { curatorExists } from "../curator";
import { SETUP_COOKIE_NAME, verifySetupCookieValue } from "../setup";

function readCookie(ctx: GenericEndpointContext, name: string): string | undefined {
  const header = ctx.headers?.get("cookie");
  if (!header) {
    return undefined;
  }

  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${name}=`)) {
      return decodeURIComponent(trimmed.slice(name.length + 1));
    }
  }

  return undefined;
}

export function createPasskeyPlugin() {
  if (!isAuthMethodEnabled("passkey")) {
    return null;
  }

  return passkey({
    rpID: authConfig.passkey.rpId,
    rpName: "Cuseum",
    origin: authConfig.passkey.origin,
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
    registration: {
      requireSession: false,
      resolveUser: async ({ ctx }) => {
        if (curatorExists()) {
          throw new Error("Passkey registration requires an authenticated Curator session.");
        }

        const setupCookie = readCookie(ctx, SETUP_COOKIE_NAME);
        if (!verifySetupCookieValue(setupCookie)) {
          throw new Error("Curator setup authorization is required to register the first passkey.");
        }

        return {
          id: randomUUID(),
          name: "Curator",
          displayName: "Curator",
        };
      },
      afterVerification: async ({ user, ctx }) => {
        const existing = await ctx.context.internalAdapter.findUserById(user.id);
        if (existing) {
          return;
        }

        await ctx.context.internalAdapter.createUser(
          {
            id: user.id,
            name: user.name,
            email: `${user.id}@passkey.cuseum`,
            emailVerified: true,
          },
          { method: "passkey" },
        );
      },
    },
  });
}
