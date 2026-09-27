import { createCuratorPasskeyLoginOptions } from "@/lib/auth/curator-passkey-login";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return createCuratorPasskeyLoginOptions();
}
