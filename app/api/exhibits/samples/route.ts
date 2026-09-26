import { NextResponse } from "next/server";
import { CuratorAuthorizationError } from "@/lib/auth/errors";
import { requireCuratorSession } from "@/lib/auth/session";
import {
  insertSampleExhibits,
  removeSampleExhibits,
} from "@/lib/exhibits/server-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  try {
    await requireCuratorSession();
  } catch (error) {
    if (error instanceof CuratorAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  const inserted = insertSampleExhibits();
  return NextResponse.json({ inserted });
}

export async function DELETE(): Promise<Response> {
  try {
    await requireCuratorSession();
  } catch (error) {
    if (error instanceof CuratorAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  const removed = removeSampleExhibits();
  return NextResponse.json({ removed });
}
