"use client";

import type { ReactNode } from "react";

// Google sign-in is now handled by the Better Auth server (social provider,
// redirect flow) instead of the Google Identity Services SDK. This wrapper is
// kept so the existing layout composition stays unchanged.
export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
