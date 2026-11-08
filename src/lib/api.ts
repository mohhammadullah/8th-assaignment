/**
 * Single source of truth for the separate Express backend.
 *
 * The Next.js app runs on http://localhost:3000 and the Express API on
 * http://localhost:5000. Every frontend fetch to the backend must go through
 * this base URL and use `credentials: "include"` so the browser sends and
 * stores the HTTPOnly `token` cookie.
 *
 * Override per environment with NEXT_PUBLIC_API_URL (see .env.example).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/** Back-compat alias used by older imports. */
export const API_BASE = API_BASE_URL;

/**
 * Fetch helper for authenticated Express calls.
 * Always sends HTTPOnly cookies. Callers only supply the path + init.
 */
export async function apiFetch(path: string, init: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...init,
    credentials: "include",
  });
}
