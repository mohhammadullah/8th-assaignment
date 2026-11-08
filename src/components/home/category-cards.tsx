import Link from "next/link";
import { cn } from "cn";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Film, Mic, Music, Palette, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "Photo Studios": Camera,
  "Sound Stages": Film,
  "Podcast Rooms": Mic,
  "Music Suites": Music,
  "Art Workshops": Palette,
};

async function getCategories() {
  try {
    const res = await fetch("http://localhost:5000/api/categories", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export async function CategoryCards() {
  const categories = await getCategories();

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
              const IconComponent = iconMap[categoryName] || Camera;
              return (
                <Link
                  key={categoryName}
                  href={`/studios?category=${encodeURIComponent(categoryName)}`}
                  className="block"
                >
                  <Card className="group/category-card h-full border border-border hover:border-primary/60 hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-8 pb-6 text-center">
                      <div className="mx-auto mb-4 rounded-xl size-12 flex items-center justify-center bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                        <IconComponent className="size-5" />
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