"use client";

// Deprecated shim: canonical auth now lives in @/hooks/use-user.
// These re-exports keep any stale `useAuth` / `AuthProvider` imports
// working without a second, divergent session store.
export { AuthProvider, useAuth, useUser, type AuthUser, type UserType } from "@/hooks/use-user";
