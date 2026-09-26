"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createCuseumAuthClient, type CuseumAuthClient } from "@/lib/auth/client";
import type { AuthMethod } from "@/lib/auth/config";

const AuthClientContext = createContext<CuseumAuthClient | null>(null);

export function AuthClientProvider({
  methods,
  children,
}: {
  methods: readonly AuthMethod[];
  children: ReactNode;
}) {
  const client = useMemo(() => createCuseumAuthClient(methods), [methods]);
  return <AuthClientContext.Provider value={client}>{children}</AuthClientContext.Provider>;
}

export function useAuthClient(): CuseumAuthClient {
  const client = useContext(AuthClientContext);
  if (!client) {
    throw new Error("useAuthClient must be used within AuthClientProvider.");
  }
  return client;
}
