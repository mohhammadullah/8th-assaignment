import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      // Studio images are user-supplied URLs, so any http(s) host is allowed.
      // The StudioImage component falls back to a designed placeholder when a
      // host is dead, so this stays permissive without showing broken icons.
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // 🔴 rewrites অংশটি এখান থেকে মুছে দিন
};

export default nextConfig;