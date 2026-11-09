"use client";

import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

/**
 * Wraps the app in GoogleOAuthProvider when NEXT_PUBLIC_GOOGLE_CLIENT_ID is
 * configured, and renders children unchanged otherwise (so the app never
 * crashes when the env var is missing).
 */
export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <>{children}</>;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
