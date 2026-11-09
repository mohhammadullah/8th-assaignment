
export function FeaturedStudiosSkeleton() {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="Loading featured studios"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6"
    >
      <div className="animate-pulse">
        {/* Heading Skeleton */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl w-full space-y-3">
            <div className="h-9 w-64 rounded-lg bg-muted" />
            <div className="h-5 w-full max-w-md rounded bg-muted" />
          </div>

          <div className="h-10 w-36 rounded-lg bg-muted" />
        </div>

        {/* Studio Cards Skeleton */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-xl border border-border"
            >
              <div className="aspect-[4/3] w-full bg-muted" />

              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />

                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 rounded bg-muted" />
                  <div className="h-9 w-28 rounded-lg bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
