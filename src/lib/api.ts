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

// Cross-origin fetch with session cookies. Serverless cold starts can
// transiently fail (504 / connection reset); retry safe reads once so a
// single cold request doesn't surface as "Failed to fetch data" to the user.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const method = (init.method ?? "GET").toUpperCase();
  const retriableMethod = ["GET", "HEAD", "OPTIONS", "DELETE"].includes(method);

  // Respect an explicit caller signal; otherwise bound the request so a
  // hanging cold start fails cleanly instead of spinning forever.
  const signal = init.signal ?? AbortSignal.timeout(20000);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}${normalizedPath}`, {
        ...init,
        credentials: "include",
        signal,
      });
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