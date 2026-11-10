import { ensureCsrfToken, getCsrfToken, isUnsafeMethod, refreshAccessToken } from "@/lib/session-token";

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

if (
  process.env.NODE_ENV === "production" &&
  API_BASE_URL.includes("localhost")
) {
  console.warn(
    "[StudioSpace] NEXT_PUBLIC_API_URL still points to localhost in production. " +
      "Set it to your deployed API origin (e.g. https://your-api.example.com) in Vercel."
  );
}

export const API_BASE = API_BASE_URL;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSessionTokenPath(normalizedPath: string) {
  return normalizedPath.startsWith("/api/session/token") || normalizedPath === "/api/session/csrf";
}

function withAuthHeaders(init: RequestInit): RequestInit {
  const method = (init.method ?? "GET").toUpperCase();
  if (!isUnsafeMethod(method)) return init;
  const token = getCsrfToken();
  if (!token) return init;
  const headers = new Headers(init.headers || undefined);
  if (!headers.has("X-CSRF-Token")) headers.set("X-CSRF-Token", token);
  return { ...init, headers };
}

async function doFetch(url: string, init: RequestInit) {
  return fetch(url, {
    ...init,
    credentials: "include",
  });
}

// Cross-origin fetch with session cookies. Serverless cold starts can
// transiently fail (504 / connection reset); retry safe reads once so a
// single cold request doesn't surface as "Failed to fetch data" to the user.
// Integrates CSRF header for unsafe requests and one-time JWT refresh on 401.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const method = (init.method ?? "GET").toUpperCase();
  const retriableMethod = ["GET", "HEAD", "OPTIONS", "DELETE"].includes(method);
  const skipRefresh = isSessionTokenPath(normalizedPath);

  // Respect an explicit caller signal; otherwise bound the request so a
  // hanging cold start fails cleanly instead of spinning forever.
  const signal = init.signal ?? AbortSignal.timeout(20000);

  let refreshedAfter401 = false;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (!skipRefresh && isUnsafeMethod(method) && !getCsrfToken()) {
        // Best-effort: obtain CSRF token cookie/value when JWT auth flow may be active.
        await ensureCsrfToken();
      }

      const requestInit = withAuthHeaders({ ...init, signal });
      let res = await doFetch(`${API_BASE_URL}${normalizedPath}`, requestInit);

      if (res.status === 401 && !skipRefresh && !refreshedAfter401) {
        refreshedAfter401 = true;
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const retryInit = withAuthHeaders({ ...init, signal });
          res = await doFetch(`${API_BASE_URL}${normalizedPath}`, retryInit);
          return res;
        }
      }

      if (res.status >= 500 && retriableMethod && attempt === 0) {
        await delay(800);
        continue;
      }
      return res;
    } catch (error) {
      if (attempt === 0) {
        await delay(800);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Request failed");
}
