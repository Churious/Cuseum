"use client";

import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import type { AuthMethod } from "./config";

function buildClientPlugins(methods: readonly AuthMethod[]) {
  const plugins = [];
  if (methods.includes("passkey")) {
    plugins.push(passkeyClient());
  }
  return plugins;
}

/**
 * Creates a Better Auth client configured for the enabled authentication methods.
 * Server components pass `methods` from `enabledAuthMethods` so UI and client
 * plugins stay aligned with server configuration.
 */
export function createCuseumAuthClient(methods: readonly AuthMethod[]) {
  return createAuthClient({
    plugins: buildClientPlugins(methods),
  });
}

export type CuseumAuthClient = ReturnType<typeof createCuseumAuthClient>;
