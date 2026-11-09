"use client";

import { createAuthClient } from "better-auth/react";
import { API_BASE_URL } from "@/lib/api";

// Better Auth is hosted on the Express API (see studio-space-server/lib/auth.js).
// The client base URL is the API origin; better-auth addresses its endpoints
// under /api/auth on that origin (e.g. POST {origin}/api/auth/sign-in/email).
export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
});
