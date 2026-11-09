"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, Loader2, MapPin, Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { StudioImage } from "@/components/studio-image";
import { useUser } from "@/hooks/use-user";
import ProtectedRoute from "@/components/ProtectedRoute";

type SavedStudio = {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  image?: string;
  rating?: number;
};

function WishlistContent() {
  const { user } = useUser();
  const [studios, setStudios] = useState<SavedStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/api/wishlist");
      if (!res.ok) {
        throw new Error("Failed to load wishlist");
      }
      const data = (await res.json()) as { studios?: SavedStudio[] };
      setStudios(data.studios ?? []);
    } catch (err) {
      console.error("Wishlist load error:", err);
      toast.error("Failed to load your wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const remove = async (id: string) => {
    setRemovingId(id);
    try {
      const res = await apiFetch(
        `/api/wishlist/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        throw new Error("Failed to remove saved studio");
      }
      setStudios((prev) => prev.filter((s) => s._id !== id));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Wishlist remove error:", err);
      toast.error("Failed to remove saved studio");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1120] dark:text-[#F1F5F9]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Heart size={26} className="fill-sky-500 text-sky-500" />
              Saved Studios
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
              {user?.name ?? "Your"} wishlist — {loading ? "…" : `${studios.length} saved`}
            </p>
          </div>
          <Link
            href="/studios"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:border-sky-500/60 dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#F1F5F9] dark:hover:border-[#38BDF8]/60"
          >
            Explore more
          </Link>
        </header>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-slate-600 dark:text-[#94A3B8]">
            <Loader2 className="h-7 w-7 animate-spin text-sky-600 dark:text-[#38BDF8]" />
            <span className="text-sm">Loading your wishlist…</span>
          </div>
        ) : studios.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm dark:border-[#334155] dark:bg-[#1E293B]">
            <Heart size={36} className="mx-auto mb-4 text-slate-400" />
            <p className="text-lg font-semibold">No saved studios yet</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
              Tap the heart on any studio card to save it here.
            </p>
            <Link
              href="/studios"
              className="mt-5 inline-block rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-sky-400 active:scale-[0.98]"
            >
              Browse studios
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-sky-500/50 hover:shadow-md dark:border-[#334155] dark:bg-[#1E293B] dark:hover:border-[#38BDF8]/50"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1120]">
                  <StudioImage
                    src={studio.image}
                    alt={studio.title}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-600 backdrop-blur-md dark:bg-[#0B1120]/80 dark:text-[#38BDF8]">
                    {studio.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => void remove(studio._id)}
                    disabled={removingId === studio._id}
                    aria-label={`Remove ${studio.title} from wishlist`}
                    title="Remove from wishlist"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-slate-950 backdrop-blur-md transition-all duration-300 hover:bg-sky-400 active:scale-95 disabled:opacity-60"
                  >
                    {removingId === studio._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Heart size={16} className="fill-current" />
                    )}
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-sky-600 dark:text-[#38BDF8]" />
                      {studio.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-sky-600 dark:text-[#38BDF8]">
                      <Star size={14} className="fill-current" />
                      {studio.rating?.toFixed(1) ?? "5.0"}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-bold">{studio.title}</h3>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-[#334155]">
                    <div>
                      <span className="text-xs text-slate-600 dark:text-[#94A3B8]">Hourly Rate</span>
                      <p className="font-bold text-sky-600 dark:text-[#38BDF8]">
                        ${studio.hourlyRate} / hr
                      </p>
                    </div>
                    <Link
                      href={`/studios/${studio._id}`}
                      className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-sky-400 active:scale-[0.98]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function WishlistPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-[#38BDF8]" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {user ? (
        <WishlistContent />
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120]">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-[#38BDF8]" />
        </div>
      )}
    </ProtectedRoute>
  );
}
