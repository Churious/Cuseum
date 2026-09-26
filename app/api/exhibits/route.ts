import { NextResponse } from "next/server";
import { CuratorAuthorizationError } from "@/lib/auth/errors";
import { requireCuratorSession } from "@/lib/auth/session";
import {
  createExhibit,
  listExhibits,
} from "@/lib/exhibits/server-repository";
import type { ExhibitDraft } from "@/lib/types";
import { isDisplayStyle, isExhibitType } from "@/lib/types";
import { isRoomId } from "@/lib/rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const exhibits = listExhibits();
  return NextResponse.json(exhibits, {
    headers: { "cache-control": "no-store" },
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    await requireCuratorSession();
  } catch (error) {
    if (error instanceof CuratorAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const draft = parseExhibitDraft(body);
  if (!draft) {
    return NextResponse.json({ error: "Invalid exhibit data." }, { status: 400 });
  }

  const exhibit = createExhibit(draft);
  return NextResponse.json(exhibit, { status: 201 });
}

function parseExhibitDraft(body: unknown): ExhibitDraft | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const value = body as Record<string, unknown>;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const type = typeof value.type === "string" ? value.type : "";
  const room = typeof value.room === "string" ? value.room : "";
  const displayStyle =
    typeof value.displayStyle === "string" ? value.displayStyle : "";

  if (!title || !isExhibitType(type) || !isRoomId(room) || !isDisplayStyle(displayStyle)) {
    return null;
  }

  return {
    title,
    type,
    room,
    url: typeof value.url === "string" ? value.url.trim() : "",
    imageUrl: typeof value.imageUrl === "string" ? value.imageUrl.trim() : "",
    description: typeof value.description === "string" ? value.description.trim() : "",
    personalNote:
      typeof value.personalNote === "string" ? value.personalNote.trim() : "",
    displayStyle,
  };
}
