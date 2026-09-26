import { NextResponse } from "next/server";
import { CuratorAuthorizationError } from "@/lib/auth/errors";
import { requireCuratorSession } from "@/lib/auth/session";
import {
  getExhibit,
  removeExhibit,
  updateExhibit,
} from "@/lib/exhibits/server-repository";
import { isDisplayStyle, isExhibitType } from "@/lib/types";
import { isRoomId } from "@/lib/rooms";
import type { ExhibitDraft } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const exhibit = getExhibit(id);

  if (!exhibit) {
    return NextResponse.json({ error: "Exhibit not found." }, { status: 404 });
  }

  return NextResponse.json(exhibit, {
    headers: { "cache-control": "no-store" },
  });
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  try {
    await requireCuratorSession();
  } catch (error) {
    if (error instanceof CuratorAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const patch = parseExhibitPatch(body);
  if (!patch) {
    return NextResponse.json({ error: "Invalid exhibit data." }, { status: 400 });
  }

  const exhibit = updateExhibit(id, patch);
  if (!exhibit) {
    return NextResponse.json({ error: "Exhibit not found." }, { status: 404 });
  }

  return NextResponse.json(exhibit);
}

export async function DELETE(_request: Request, context: RouteContext): Promise<Response> {
  try {
    await requireCuratorSession();
  } catch (error) {
    if (error instanceof CuratorAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  const { id } = await context.params;
  const removed = removeExhibit(id);

  if (!removed) {
    return NextResponse.json({ error: "Exhibit not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

function parseExhibitPatch(body: unknown): Partial<ExhibitDraft> | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const value = body as Record<string, unknown>;
  const patch: Partial<ExhibitDraft> = {};

  if ("title" in value) {
    if (typeof value.title !== "string" || !value.title.trim()) {
      return null;
    }
    patch.title = value.title.trim();
  }

  if ("type" in value) {
    if (typeof value.type !== "string" || !isExhibitType(value.type)) {
      return null;
    }
    patch.type = value.type;
  }

  if ("room" in value) {
    if (typeof value.room !== "string" || !isRoomId(value.room)) {
      return null;
    }
    patch.room = value.room;
  }

  if ("displayStyle" in value) {
    if (typeof value.displayStyle !== "string" || !isDisplayStyle(value.displayStyle)) {
      return null;
    }
    patch.displayStyle = value.displayStyle;
  }

  if ("url" in value) {
    patch.url = typeof value.url === "string" ? value.url.trim() : "";
  }

  if ("imageUrl" in value) {
    patch.imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
  }

  if ("description" in value) {
    patch.description =
      typeof value.description === "string" ? value.description.trim() : "";
  }

  if ("personalNote" in value) {
    patch.personalNote =
      typeof value.personalNote === "string" ? value.personalNote.trim() : "";
  }

  if (Object.keys(patch).length === 0) {
    return null;
  }

  return patch;
}
