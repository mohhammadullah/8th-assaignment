import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE: this is an optimistic redirect only. It checks for the presence of
// the Better Auth session cookie so unauthenticated visitors get sent to
// /login immediately, but it does NOT prove the session is valid.
//
// Authoritative authorization happens on the Express API (its session is
// validated on every protected request via authMiddleware), and the
// ProtectedRoute component re-checks the live session from the auth client.
//
// Local development: the session cookie is set on "localhost", so the
// browser sends it to both the API (:5000) and this app (:3000).
// If the frontend and API are deployed on different registrable domains,
// the cookie will not reach this proxy — ProtectedRoute + the API checks
// still protect the app in that case.

const SESSION_COOKIE = "better-auth.session_token";
const SECURE_SESSION_COOKIE = "__Secure-better-auth.session_token";

export function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.has(SESSION_COOKIE) ||
    request.cookies.has(SECURE_SESSION_COOKIE);

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/wishlist/:path*",
    "/add-studio/:path*",
    "/studios/new/:path*",
    "/studios/:id/edit/:path*",
  ],
};
