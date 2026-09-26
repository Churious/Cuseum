import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public museum routes are read-only. Curators manage exhibits under /admin only.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === "/new") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const editMatch = pathname.match(/^\/exhibit\/([^/]+)\/edit$/);
  if (editMatch) {
    return NextResponse.redirect(new URL(`/exhibit/${editMatch[1]}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/new", "/exhibit/:id/edit"],
};
