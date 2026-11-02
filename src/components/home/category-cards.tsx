import Link from "next/link"

import { cn } from "cn"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Film, Mic, Music, Palette } from "lucide-react"

const CATEGORY_CARDS = [
  {
    name: "Photo Studios",
    color: "bg-primary",
    textColor: "text-primary-foreground",
    Icon: Camera,
    description: "Seamless backdrops, pro lighting, and gear on site.",
  },
  {
    name: "Sound Stages",
    color: "bg-accent",
    textColor: "text-accent-foreground",
    Icon: Film,
    description: "Large acoustically treated stages for film and video.",
  },
  {
    name: "Podcast Rooms",
    color: "bg-primary/90",
    textColor: "text-primary-foreground",
    Icon: Mic,
    description: "Soundproofed rooms with multi-cam setups.",
  },
  {
    "name": "Music Suites",
    color: "bg-[#E9A23B]",
    textColor: "text-[#111318]",
    Icon: Music,
    description: "Tuned rooms for recording, rehearsal, and mixing.",
  },
  {
    name: "Art Workshops",
    color: "bg-primary",
    textColor: "text-primary-foreground",
    Icon: Palette,
    description: "Spacious studios for painting, sculpture, and crafts.",
  },
] as const

interface CategoryCardProps {
  name: string
  color: string
  textColor: string
  Icon: React.ComponentType<{ className?: string }>
  description: string
  className?: string
}

function CategoryCard({
  name,
  color,
  textColor,
  Icon: IconComponent,
  description,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={`/studios?category=${encodeURIComponent(name)}`}
      className={cn("block", className)}
    >
      <Card
        className={cn(
          "group/category-card h-full border border-border hover:border-primary/60 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300",
          className
        )}
      >
        <CardContent className="pt-8 pb-6 text-center">
          <div
            className={cn(
              "mx-auto mb-4 rounded-xl size-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
              color,
              textColor
            )}
          >
            <IconComponent className="size-5" />
          </div>
          <h3 className="font-heading text-base leading-snug font-medium mb-2 text-foreground">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function CategoryCards() {
  return (
    <section
      id="browse-categories"
      data-slot="category-cards"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C2028]/30 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
              Browse by Studio Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pick a category to see available spaces — your choice is pre-selected
              on the studios page.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORY_CARDS.map((card) => (
            <CategoryCard key={card.name} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
