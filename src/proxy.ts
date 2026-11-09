import { NextResponse } from "next/server";

// Production architecture: Better Auth is hosted on the Express API
// (https://studio-space-server-olive.vercel.app) while this Next.js app is
// https://studio-space-pearl.vercel.app — DIFFERENT domains. The session
// cookie (SameSite=None; Secure) is therefore set on the API domain and is
// NEVER sent to this frontend origin on page navigations, so an edge cookie
// check here cannot prove an authenticated user is logged in and would
// wrongly bounce every logged-in user to /login (including on refresh).
//
// Authorization therefore happens in two places:
// 1. `ProtectedRoute` (client) — waits for `useSession()` to finish
//    (`isPending === false`) and only redirects to /login when there is
//    definitively no user. It never redirects while loading.
// 2. The Express API (authoritative) — every protected endpoint re-validates
//    the session server-side via `verifyAuth`.
//
// This proxy is intentionally pass-through so authenticated deep-links and
// refreshes (e.g. /add-studio) render and let ProtectedRoute decide.

export function proxy() {
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
    "/studios/edit/:path*",
    "/studios/:id/edit/:path*",
  ],
};
