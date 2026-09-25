import { isLookupableUrl, normalizeUrlInput, titleFromUrl } from "./format";

export interface ExhibitMetadata {
  ok: boolean;
  /** Final URL, after redirects. */
  url: string;
  hostname: string;
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
  /**
   * Machine-readable failure cause. The interface translates this itself, so
   * technical wording never reaches the visitor.
   */
  reason: MetadataFailureReason | null;
  /** English developer-facing detail, for logs. Never shown in the UI. */
  error: string | null;
}

export type MetadataFailureReason =
  | "invalid-url"
  | "private-host"
  | "http-error"
  | "not-readable"
  | "timeout"
  | "network";


const REQUEST_TIMEOUT_MS = 9000;
const MAX_HTML_CHARS = 500_000;

/** Hosts the museum will not try to read (loopback, link-local, private ranges). */
const BLOCKED_HOST_PATTERNS: readonly RegExp[] = [
  /^localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^\[?::1\]?$/,
  /^\[?f[cd][0-9a-f]{2}:/i,
  /^\[?fe80:/i,
  /\.local$/i,
];

export function isFetchableHost(hostname: string): boolean {
  return !BLOCKED_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

function emptyMetadata(overrides: Partial<ExhibitMetadata> = {}): ExhibitMetadata {
  return {
    ok: false,
    url: "",
    hostname: "",
    title: "",
    description: "",
    imageUrl: "",
    siteName: "",
    reason: null,
    error: null,
    ...overrides,
  };
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  middot: "·",
};

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(
      /&([a-z]+);/gi,
      (entity, name: string) => ENTITIES[name.toLowerCase()] ?? entity,
    );
}

function readAttribute(tag: string, name: string): string | null {
  const pattern = new RegExp(
    `${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
    "i",
  );
  const match = pattern.exec(tag);
  if (!match) {
    return null;
  }
  return decodeEntities(match[1] ?? match[2] ?? match[3] ?? "");
}

function firstNonEmpty(...values: (string | undefined)[]): string {
  for (const value of values) {
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function absoluteUrl(candidate: string, base: string): string {
  if (!candidate) {
    return "";
  }
  try {
    return new URL(candidate, base).toString();
  } catch {
    return "";
  }
}

/** Reads <meta name/property> pairs and the document title out of raw HTML. */
function readDocumentFields(html: string): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const key = readAttribute(tag, "property") ?? readAttribute(tag, "name");
    const content = readAttribute(tag, "content");
    if (!key || content === null) {
      continue;
    }
    const normalizedKey = key.trim().toLowerCase();
    if (normalizedKey && fields[normalizedKey] === undefined && content.trim()) {
      fields[normalizedKey] = content.trim();
    }
  }

  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (titleMatch) {
    const title = decodeEntities(titleMatch[1]).replace(/\s+/g, " ").trim();
    if (title) {
      fields.title = fields.title ?? title;
    }
  }

  return fields;
}

/**
 * Reads what a page says about itself.
 *
 * Never throws: a failed lookup simply returns ok: false so the visitor can
 * describe the exhibit by hand.
 */
export async function fetchExhibitMetadata(
  rawUrl: string,
): Promise<ExhibitMetadata> {
  const normalized = normalizeUrlInput(rawUrl);
  if (!normalized) {
    return emptyMetadata({
      reason: "invalid-url",
      error: "That does not look like a web address.",
    });
  }

  let target: URL;
  try {
    target = new URL(normalized);
  } catch {
    return emptyMetadata({
      reason: "invalid-url",
      error: "That does not look like a web address.",
    });
  }

  const hostname = target.hostname.replace(/^www\./, "");

  if (!isFetchableHost(target.hostname)) {
    return emptyMetadata({
      url: normalized,
      hostname,
      reason: "private-host",
      error: "The address is on a private network and was refused.",
    });
  }

  if (!isLookupableUrl(normalized)) {
    return emptyMetadata({
      url: normalized,
      hostname,
      reason: "invalid-url",
      error: "That does not look like a web address.",
    });
  }

  try {
    const response = await fetch(target.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Cuseum/0.1; personal museum reader)",
        accept: "text/html,application/xhtml+xml,image/*;q=0.8,*/*;q=0.5",
        "accept-language": "en-US,en;q=0.9",
      },
    });

    const finalUrl = response.url || normalized;
    const contentType = (response.headers.get("content-type") ?? "").toLowerCase();

    if (!response.ok) {
      return emptyMetadata({
        url: finalUrl,
        hostname,
        title: titleFromUrl(finalUrl),
        reason: "http-error",
        error: `The page answered with ${response.status}.`,
      });
    }

    // A direct image link is already the artwork.
    if (contentType.startsWith("image/")) {
      return emptyMetadata({
        ok: true,
        url: finalUrl,
        hostname,
        title: titleFromUrl(finalUrl),
        imageUrl: finalUrl,
      });
    }

    if (
      contentType &&
      !contentType.includes("html") &&
      !contentType.includes("xml")
    ) {
      return emptyMetadata({
        url: finalUrl,
        hostname,
        title: titleFromUrl(finalUrl),
        reason: "not-readable",
        error: "The link is not a readable page.",
      });
    }

    const html = (await response.text()).slice(0, MAX_HTML_CHARS);
    const fields = readDocumentFields(html);

    const title = firstNonEmpty(
      fields["og:title"],
      fields["twitter:title"],
      fields.title,
    );
    const description = firstNonEmpty(
      fields["og:description"],
      fields["twitter:description"],
      fields.description,
    );
    const image = firstNonEmpty(
      fields["og:image:secure_url"],
      fields["og:image"],
      fields["og:image:url"],
      fields["twitter:image"],
      fields["twitter:image:src"],
      fields.image,
    );
    const siteName = firstNonEmpty(
      fields["og:site_name"],
      fields["application-name"],
    );
    const imageUrl = absoluteUrl(image, finalUrl);

    return {
      ok: Boolean(title || imageUrl),
      url: finalUrl,
      hostname,
      title: title || titleFromUrl(finalUrl),
      description,
      imageUrl,
      siteName,
      reason: null,
      error: null,
    };


  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return emptyMetadata({
      url: normalized,
      hostname,
      reason: timedOut ? "timeout" : "network",
      error: timedOut ? "The page took too long to answer." : "The page could not be read.",
    });
  }
}


