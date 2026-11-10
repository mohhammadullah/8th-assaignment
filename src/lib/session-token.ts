const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

const TOKEN_ISSUE_PATH = "/api/session/token";
const TOKEN_REFRESH_PATH = "/api/session/token/refresh";
const TOKEN_CLEAR_PATH = "/api/session/token/clear";
const CSRF_PATH = "/api/session/csrf";
const DEFAULT_CSRF_COOKIE_NAME = "studio_csrf";
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

let issuePromise: Promise<boolean> | null = null;
let refreshPromise: Promise<boolean> | null = null;
let csrfTokenMemory: string | null = null;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }
  return null;
}

export function getCsrfToken(): string | null {
  // CSRF token is kept in memory only (never localStorage/sessionStorage).
  // Cookie is used only as a readable fallback when available to the frontend.
  return csrfTokenMemory || getCookie(DEFAULT_CSRF_COOKIE_NAME);
}

export function setCsrfToken(token: string | null) {
  csrfTokenMemory = token;
}

export function isUnsafeMethod(method?: string) {
  return UNSAFE_METHODS.has((method || "GET").toUpperCase());
}

type SessionTokenResponse = {
  csrfToken?: string;
  csrf?: string;
  token?: string;
  [key: string]: unknown;
};

function extractCsrfToken(data?: SessionTokenResponse): string | null {
  const token = data?.csrfToken || data?.csrf || data?.token;
  return typeof token === "string" && token ? token : null;
}

async function requestJson(path: string, method: "GET" | "POST"): Promise<{ ok: boolean; data?: SessionTokenResponse }> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
    });
    const data = (await res.json().catch(() => undefined)) as SessionTokenResponse | undefined;
    const token = extractCsrfToken(data);
    if (token) {
      // Always prefer the latest token returned by the backend (covers issuance/refresh/rotation).
      csrfTokenMemory = token;
    }
    return { ok: res.ok, data };
  } catch {
    return { ok: false };
  }
}

export async function issueAccessToken(): Promise<boolean> {
  if (issuePromise) return issuePromise;
  issuePromise = requestJson(TOKEN_ISSUE_PATH, "POST")
    .then((r) => {
      if (r.ok && !csrfTokenMemory) {
        const cookieToken = getCookie(DEFAULT_CSRF_COOKIE_NAME);
        if (cookieToken) csrfTokenMemory = cookieToken;
      }
      return r.ok;
    })
    .finally(() => {
      issuePromise = null;
    });
  return issuePromise;
}

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = requestJson(TOKEN_REFRESH_PATH, "POST")
    .then((r) => {
      if (r.ok && !csrfTokenMemory) {
        const cookieToken = getCookie(DEFAULT_CSRF_COOKIE_NAME);
        if (cookieToken) csrfTokenMemory = cookieToken;
      }
      return r.ok;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export async function ensureCsrfToken(): Promise<string | null> {
  const { ok } = await requestJson(CSRF_PATH, "GET");
  if (!ok && !csrfTokenMemory) {
    const cookieToken = getCookie(DEFAULT_CSRF_COOKIE_NAME);
    if (cookieToken) csrfTokenMemory = cookieToken;
  }
  return getCsrfToken();
}

export async function syncAccessToken(): Promise<boolean> {
  return issueAccessToken();
}

export async function clearAccessToken(): Promise<void> {
  try {
    await requestJson(TOKEN_CLEAR_PATH, "POST");
  } catch {
    // Best effort
  } finally {
    csrfTokenMemory = null;
  }
}

export function withCsrfHeader(init: RequestInit = {}): RequestInit {
  const method = (init.method || "GET").toUpperCase();
  if (!isUnsafeMethod(method)) return init;
  const token = getCsrfToken();
  if (!token) return init;
  const headers = new Headers(init.headers || undefined);
  if (!headers.has("X-CSRF-Token")) {
    headers.set("X-CSRF-Token", token);
  }
  return { ...init, headers };
}

export const SESSION_TOKEN_PATHS = {
  issue: TOKEN_ISSUE_PATH,
  refresh: TOKEN_REFRESH_PATH,
  clear: TOKEN_CLEAR_PATH,
  csrf: CSRF_PATH,
};
