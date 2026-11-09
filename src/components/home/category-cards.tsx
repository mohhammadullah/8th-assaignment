import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Aperture,
  AudioLines,
  BriefcaseBusiness,
  Camera,
  Clapperboard,
  EighthNote,
  Film,
  Mic,
  MicVocal,
  Music,
  Palette,
  Shapes,
  type LucideIcon,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

// Unique icon per category (normalized-lowercase lookup below).
// Mic2/Music2 are the legacy Lucide names — in this release they are
// `MicVocal` and `EighthNote`.
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "creative workspace": BriefcaseBusiness,
  "film & video studio": Clapperboard,
  music: EighthNote,
  "music studio": AudioLines,
  "photo studios": Camera,
  "photography studio": Aperture,
  "podcast studio": MicVocal,
  // Legacy names kept so older listings/filter values keep their icons.
  "sound stages": Film,
  "podcast rooms": Mic,
  "music suites": Music,
  "art workshops": Palette,
};

// Demo/test category with lorem-ipsum data — hidden from display only
// (the MongoDB record itself is left untouched).
const HIDDEN_CATEGORIES = new Set(["voluptatem reprehend"]);

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function categoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[normalizeCategory(category)] ?? Shapes;
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      cache: "no-store",
      credentials: "include",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function CategoryCards() {
  const allCategories = await getCategories();
  const categories = allCategories.filter(
    (name: string) => !HIDDEN_CATEGORIES.has(normalizeCategory(name))
  );

  return (
    <section
      id="browse-categories"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
              Browse by Studio Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pick a category to see available spaces — your choice is pre-selected on the studios page.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.length > 0 ? (
            categories.map((categoryName: string) => {
              const IconComponent = categoryIcon(categoryName);
              return (
                <Link
                  key={categoryName}
                  href={`/studios?category=${encodeURIComponent(categoryName)}`}
                  className="block"
                >
                  <Card className="group/category-card h-full border border-border hover:border-primary/60 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-8 pb-6 text-center">
                      <div className="mx-auto mb-4 rounded-xl size-12 flex items-center justify-center bg-primary text-primary-foreground shadow-md transition-all duration-300 group-hover/category-card:scale-110 group-hover/category-card:bg-primary/90 group-hover/category-card:shadow-lg group-hover/category-card:shadow-primary/30">
                        <IconComponent className="size-6" />
                      </div>
                      <h3 className="font-heading text-base leading-snug font-medium mb-2 text-foreground">
                        {categoryName}
                      </h3>
                      <p className="text-xs text-muted-foreground">Explore available {categoryName.toLowerCase()}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <p className="text-muted-foreground col-span-full text-center">No categories found.</p>
          )}
        </div>
      </div>
    </section>
  );
}