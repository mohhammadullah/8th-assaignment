"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "cn";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800";

function isRemoteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isDataUrl(value: string): boolean {
  return value.startsWith("data:image/");
}

function isValidImageValue(value?: string | null): value is string {
  if (!value) return false;
  if (isDataUrl(value)) return true;
  return isRemoteHttpUrl(value);
}

export function validateImageUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Image URL is required";
  if (trimmed.startsWith("blob:")) return "Blob URLs cannot be stored — use a public https image URL instead";
  if (trimmed.startsWith("data:")) {
    return trimmed.length > 50000
      ? "Data URLs are too large — please paste a public https image URL instead"
      : null;
  }
  if (!isRemoteHttpUrl(trimmed)) return "Please enter a valid http(s) image URL";
  return null;
}

/**
 * Resilient studio image: uses next/image for http(s) URLs (remotePatterns
 * allow any https host) and a plain img for data: URLs. On error (dead host,
 * 404, non-image response) it shows a designed gradient placeholder so the
 * card never renders a broken-image icon.
 */
export function StudioImage({
  src,
  alt,
  className,
  priority = false,
  fill = true,
  sizes = "100vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const value = typeof src === "string" ? src.trim() : "";

  if (!isValidImageValue(value) || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-[#1E293B] dark:via-[#162033] dark:to-[#0B1120]",
          className
        )}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-[#38BDF8]">
            <ImageOff size={20} />
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-[#64748B]">
            {alt || "Studio image unavailable"}
          </span>
        </div>
      </div>
    );
  }

  if (isDataUrl(value)) {
    // next/image cannot optimize data: URLs, so a plain img is required here.
    return (
      <img
        src={value}
        alt={alt}
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={value}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
