import { authConfig } from "./config";

function isLocalHost(host: string): boolean {
  const value = host.toLowerCase();
  return value.startsWith("localhost") || value.startsWith("127.0.0.1") || value.startsWith("[::1]");
}

/**
 * Public site origin for redirects behind reverse proxies (Cloudflare Tunnel, Traefik).
 * Never trust request.url alone — upstream often forwards with an internal host.
 */
export function getPublicOrigin(request?: Request): string {
  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

    if (forwardedHost && !isLocalHost(forwardedHost)) {
      return `${forwardedProto ?? "https"}://${forwardedHost}`;
    }

    const host = request.headers.get("host")?.split(",")[0]?.trim();
    if (host && !isLocalHost(host)) {
      return `${forwardedProto ?? "https"}://${host}`;
    }
  }

  return authConfig.betterAuthUrl;
}

export function publicUrl(path: string, request?: Request): URL {
  return new URL(path, getPublicOrigin(request));
}
