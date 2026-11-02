import Link from "next/link"
import { Aperture } from "lucide-react"

import { cn } from "cn"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      data-slot="logo"
      aria-label="StudioSpace home"
      className={cn(
        "flex items-center gap-2 rounded-lg text-lg font-semibold tracking-tight outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Aperture className="size-4" />
      </span>
      <span>
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  )
}
