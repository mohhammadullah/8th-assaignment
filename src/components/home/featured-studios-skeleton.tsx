import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedStudiosSkeleton() {
  return (
    <section
      data-slot="featured-studios-skeleton"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
      aria-hidden
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="pt-0 border border-border/50">
            <Skeleton className="aspect-[4/3] w-full bg-card" />
            <div className="flex flex-col gap-2 pt-4 pb-4">
              <Skeleton className="h-5 w-3/4 bg-card" />
              <Skeleton className="h-4 w-1/2 bg-card" />
              <Skeleton className="mt-2 h-8 w-full bg-card" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
