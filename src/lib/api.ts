export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const API_BASE = API_BASE_URL;

/**
 * Single fetch wrapper for the Express backend.
 *
 * Cookie-based auth: the backend sets an HTTPOnly `token` cookie on
 * login/register, and every request MUST send it back to Express
 * (port 5000) via `credentials: "include"`. Keeping `credentials`
 * after `...init` prevents call-sites from accidentally overriding it.
 */
export async function apiFetch(path: string, init: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...init,
    credentials: "include",
  });
}