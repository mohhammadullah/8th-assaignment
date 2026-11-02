import Link from "next/link"

import { getFeaturedStudios } from "@/lib/studios"
import { Button } from "@/components/ui/button"
import { StudioCard } from "@/components/home/studio-card"

export async function FeaturedStudios() {
  const studios = await getFeaturedStudios()

  return (
    <section
      id="featured-studios"
      data-slot="featured-studios"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Featured Studios
          </h2>
          <p className="mt-2 text-muted-foreground">
            Top-rated and newly listed spaces on StudioSpace — book them by the
            hour, straight from the host.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/studios" />}>
          View All Studios
        </Button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio.slug} studio={studio} />
        ))}
      </div>
    </section>
  )
}
