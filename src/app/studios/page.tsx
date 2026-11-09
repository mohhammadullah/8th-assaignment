import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { WishlistHeart } from "@/components/WishlistHeart";

type Studio = {
  _id: string;
  image?: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
};

// searchParams প্রপস যোগ করা হলো ক্যাটাগরি ধরার জন্য
async function getStudios(category?: string): Promise<Studio[]> {
  try {
    let url = `${API_BASE_URL}/api/studios`;
    if (category) {
      url = `${API_BASE_URL}/api/studios?category=${encodeURIComponent(category)}`;
    }
    const res = await fetch(url, { cache: "no-store", credentials: "include" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

// Next.js পেজে searchParams প্রপস রিসিভ করা
export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  
  const studios = await getStudios(category);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1120] px-4 py-12 text-slate-900 dark:text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Explore Creative <span className="text-[#38BDF8]">Studios</span>
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-[#94A3B8]">
            {category 
              ? `Showing studios for category: "${category}"`
              : "Discover top-rated spaces for photography, film, podcast, and music."}
          </p>
        </div>

        {/* Studios Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.length > 0 ? (
            studios.map((studio) => (
              <div
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] transition duration-300 hover:border-[#38BDF8]/50 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white dark:bg-[#0B1120]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={studio.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"}
                    alt={studio.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/80 dark:bg-white dark:bg-[#0B1120]/80 px-3 py-1 text-xs font-semibold text-[#38BDF8] backdrop-blur-md">
                    {studio.category}
                  </span>
                  <span className="absolute right-3 top-3">
                    <WishlistHeart studioId={studio._id} />
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#38BDF8]" />
                      {studio.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#818CF8]">
                      <Star size={14} className="fill-[#818CF8]" /> 4.9
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-[#F1F5F9]">{studio.title}</h3>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 dark:border-[#334155] pt-4">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-[#94A3B8]">Hourly Rate</span>
                      <p className="font-bold text-[#38BDF8]">${studio.hourlyRate} / hr</p>
                    </div>
                    <Link
                      href={`/studios/${studio._id}`}
                      className="rounded-xl bg-[#38BDF8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0EA5E9]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-500 dark:text-[#94A3B8]">
              <p className="text-lg">No studios found for this category.</p>
              <p className="mt-1 text-sm">Try selecting another category or view all studios!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}