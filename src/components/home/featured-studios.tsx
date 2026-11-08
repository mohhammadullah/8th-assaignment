import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudioCard } from "@/components/home/studio-card";
import type { Studio } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";

async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/studios/featured`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch featured studios:", error);
    return [];
  }
}

export async function FeaturedStudios() {
  const studios = await getFeaturedStudios();

  return (
    <section
      id="featured-studios"
      data-slot="featured-studios"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E293B]/40 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
              Featured Studios
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top-rated and newly listed spaces on StudioSpace — book them by the
              hour, straight from the host.
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/studios" />}
            className="border-border text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary-foreground transition-all duration-300"
          >
            View All Studios
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.length > 0 ? (
            studios.map((studio) => (
            
              <StudioCard key={studio._id} studio={studio} />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center">
              No featured studios found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}