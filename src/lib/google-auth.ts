import { apiFetch } from "@/lib/api";

export type GoogleUser = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
};

/**
 * Exchanges a Google `credential` (ID token) for our app session.
 * The backend verifies it with google-auth-library and sets the
 * HTTPOnly `token` cookie; `apiFetch` sends `credentials: "include"`.
 */
export async function sendGoogleCredential(
  credential: string
): Promise<GoogleUser> {
  const res = await apiFetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });

  const data = (await res.json().catch(() => null)) as {
    message?: string;
    user?: GoogleUser;
  } | null;

  if (!res.ok || !data?.user) {
    throw new Error(data?.message || "Google sign-in failed");
  }

  return data.user;
}
