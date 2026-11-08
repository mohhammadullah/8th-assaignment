import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { Headset, Shield, ShieldCheck, UserCheck } from "lucide-react"

const GUARANTEES = [
  {
    title: "Liability Protection",
    color: "bg-primary",
    textColor: "text-primary-foreground",
    Icon: Shield,
    description:
      "Every booking is backed by platform liability coverage, so you and the host are protected during your shoot.",
  },
  {
    title: "Verified Profiles",
    color: "bg-[#818CF8]",
    textColor: "text-[#0B1120]",
    Icon: UserCheck,
    description:
      "Hosts are identity- and space-verified before listing, so you know exactly who and what you're booking.",
  },
  {
    title: "Equipment Safety",
    color: "bg-primary",
    textColor: "text-primary-foreground",
    Icon: ShieldCheck,
    description:
      "Studios list gear and safety standards upfront, and equipment condition is confirmed before each booking.",
  },
  {
    title: "24/7 Host Support",
    color: "bg-accent",
    textColor: "text-accent-foreground",
    Icon: Headset,
    description:
      "Round-the-clock support for hosts and creators — from listing questions to day-of-shoot assistance.",
  },
] as const

interface GuaranteeCardProps {
  title: string
  color: string
  textColor: string
  Icon: React.ComponentType<{ className?: string }>
  description: string
  className?: string
}

function GuaranteeCard({
  title,
  color,
  textColor,
  Icon: IconComponent,
  description,
  className,
}: GuaranteeCardProps) {
  return (
    <Card
      className={cn(
        "guarantee-card h-full border border-border hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300",
        className
      )}
    >
      <CardContent className="p-6 text-center">
        <div
          className={cn(
            "mx-auto mb-4 rounded-full size-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            color,
            textColor
          )}
        >
          <IconComponent className="size-5" />
        </div>
        <h3 className="font-heading text-base leading-snug font-medium mb-2 text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function HostGuarantee() {
  return (
    <section
      id="host-guarantee"
      data-slot="host-guarantee"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E293B]/30 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
              Host Guarantee &amp; Creator Support
            </h2>
            <p className="mt-2 text-muted-foreground-foreground">
              Platform assurances that protect every shoot — liability coverage,
              verified hosts, safe equipment, and support around the clock.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((guarantee) => (
            <GuaranteeCard key={guarantee.title} {...guarantee} />
          ))}
        </div>
      </div>
    </section>
  )
}
