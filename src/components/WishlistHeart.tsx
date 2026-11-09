"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { cn } from "cn";

export function WishlistHeart({
  studioId,
  className,
}: {
  studioId: string;
  className?: string;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      apiFetch(
        `/api/wishlist/check?studioId=${encodeURIComponent(studioId)}`
      )
        .then(async (res) => {
          if (!res.ok) return;
          const data = (await res.json()) as { saved?: boolean };
          if (!cancelled) setSaved(Boolean(data.saved));
        })
        .catch(() => undefined);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [user, studioId]);

  const toggle = async () => {
    if (isLoading) return;
    if (!user) {
      toast.error("Please log in to save studios");
      router.push("/login");
      return;
    }

    const next = !saved;
    setSaved(next);
    setBusy(true);

    try {
      const res = next
        ? await apiFetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studioId }),
          })
        : await apiFetch(
            `/api/wishlist/${encodeURIComponent(studioId)}`,
            { method: "DELETE" }
          );

      if (!res.ok) {
        throw new Error("Could not update wishlist");
      }

      toast.success(
        next ? "Saved to wishlist" : "Removed from wishlist"
      );
    } catch {
      setSaved(!next);
      toast.error("Could not update wishlist");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      title={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition disabled:opacity-60",
        saved
          ? "bg-[#38BDF8] text-white"
          : "bg-[#0B1120]/60 text-white hover:bg-[#0B1120]/80",
        className
      )}
    >
      {busy ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Heart size={16} className={saved ? "fill-current" : undefined} />
      )}
    </button>
  );
}
