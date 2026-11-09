import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WishlistHeart } from "@/components/WishlistHeart"
import type { Studio } from "@/lib/types"

export function StudioCard({
  studio,
  className,
}: {
  studio: Studio
  className?: string
}) {
  return (
    <Card
      className={cn(
        "group/card pt-0 border-slate-200 dark:border-[#334155] border-2 shadow-sm hover:border-sky-500/50 dark:hover:border-[#38BDF8]/50 hover:shadow-md hover:shadow-sky-500/20 transition-all duration-300",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={studio.image}
          alt={studio.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        
   
        <Badge className="absolute top-3 left-3 bg-sky-500 text-slate-900 dark:text-[#F1F5F9] backdrop-blur-sm">
          {studio.category}
        </Badge>

        {studio._id && (
          <span className="absolute right-3 bottom-3">
            <WishlistHeart studioId={studio._id} />
          </span>
        )}

   
        <Badge className="absolute top-3 right-3 border-0 bg-white/80 dark:bg-[#0B1120]/80 text-sky-600 dark:text-[#38BDF8] backdrop-blur-md flex items-center gap-1">
          <Star className="fill-current size-3.5" /> {studio.rating?.toFixed(1) ?? "5.0"}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <h3 className="font-heading text-base leading-snug font-medium text-foreground">
          {studio.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {studio.location}
        </div>

        <div className="mt-auto pt-2 text-base">
          <span className="font-semibold text-foreground">${studio.hourlyRate}</span>
          <span className="text-muted-foreground">/ hr</span>
        </div>

        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/studios/${studio._id || studio.slug}`} />}
          className="border-slate-200 dark:border-[#334155] text-foreground hover:border-sky-500 dark:hover:border-[#38BDF8] hover:bg-sky-500/10 hover:text-foreground transition-all duration-300 active:scale-[0.98]"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}