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
  // callbackURL must be ABSOLUTE and on the frontend origin. Better Auth
  // resolves a relative "/" against the API baseURL (backend JSON page),
  // leaving the user on the backend instead of the StudioSpace frontend.
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: origin ? `${origin}/` : "/",
    newUserCallbackURL: origin ? `${origin}/` : "/",
  });

  if (error) {
    throw new Error(error.message || "Google sign-in failed");
  }
}
