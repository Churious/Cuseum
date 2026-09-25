import { fetchExhibitMetadata } from "@/lib/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/metadata?url=https://example.com
 *
 * Reads the Open Graph information a page publishes about itself so the
 * New Exhibit room can be filled in automatically. This is the only piece of
 * Cuseum that talks to the network.
 */
export async function GET(request: Request): Promise<Response> {
  const rawUrl = new URL(request.url).searchParams.get("url") ?? "";

  if (!rawUrl.trim()) {
    return Response.json(
      {
        ok: false,
        url: "",
        hostname: "",
        title: "",
        description: "",
        imageUrl: "",
        siteName: "",
        reason: "invalid-url",
        error: "No address was given.",
      },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  const metadata = await fetchExhibitMetadata(rawUrl);

  return Response.json(metadata, {
    status: 200,
    headers: { "cache-control": "no-store" },
  });
}
