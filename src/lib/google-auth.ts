import { authClient } from "@/lib/auth-client";

/**
 * Start the Better Auth Google OAuth flow (redirect-based).
 *
 * Google is configured as a social provider in the Express server's
 * Better Auth instance (studio-space-server/lib/auth.js). The browser is
 * redirected to Google and back, which creates or retrieves the user and
 * sets the session cookie.
 */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });

  if (error) {
    throw new Error(error.message || "Google sign-in failed");
  }
}
