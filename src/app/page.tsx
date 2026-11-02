import { Suspense } from "react";

import { SiteHero } from "@/components/home/hero-slider";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { FeaturedStudiosSkeleton } from "@/components/home/featured-studios-skeleton";

export default function Home() {
  return (
    <>
      <SiteHero />
      {/* Studios stream in fresh from MongoDB; skeletons show instantly. */}
      <Suspense fallback={<FeaturedStudiosSkeleton />}>
        <FeaturedStudios />
      </Suspense>
    </>
  );
}
