import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"

import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Studio } from "@/lib/types"

export function StudioCard({
  studio,
  className,
}: {
  studio: Studio
  className?: string
}) {
  return (
    <Card className={cn("group/card pt-0", className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={studio.image}
          alt={studio.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover/card:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-background/85 text-foreground backdrop-blur-sm">
          {studio.category}
        </Badge>
        <Badge className="absolute top-3 right-3 border-0 bg-black/60 text-white">
          <Star className="fill-current" /> {studio.rating.toFixed(1)}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <h3 className="font-heading text-base leading-snug font-medium">
          {studio.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {studio.location}
        </div>

        <div className="mt-auto pt-2 text-base">
          <span className="font-semibold">${studio.hourlyRate}</span>
          <span className="text-muted-foreground"> / hr</span>
        </div>

        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/studios/${studio.slug}`} />}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
