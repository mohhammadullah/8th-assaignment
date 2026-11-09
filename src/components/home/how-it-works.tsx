import { cn } from "cn"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, CreditCard, Film, Search } from "lucide-react"

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Discover Spaces",
    Icon: Search,
    color: "bg-primary",
    textColor: "text-primary-foreground",
    description:
      "Browse photo studios, sound stages, podcast rooms, music suites, and art workshops by category, location, and hourly rate.",
  },
  {
    step: 2,
    title: "Select Shoot Hours",
    Icon: Clock,
    color: "bg-[#818CF8]",
    textColor: "text-slate-950",
    description:
      "Pick the date and hours you need. Transparent hourly pricing means no surprises at checkout.",
  },
  {
    step: 3,
    title: "Book Instantly",
    Icon: CreditCard,
    color: "bg-primary",
    textColor: "text-primary-foreground",
    description:
      "Secure online booking with instant confirmation. Your space is reserved the moment you pay.",
  },
  {
    step: 4,
    title: "Create & Produce",
    Icon: Film,
    color: "bg-primary",
    textColor: "text-primary-foreground",
    description:
      "Arrive, set up, and create. Verified hosts, liability protection, and 24/7 support have you covered.",
  },
] as const

interface WorkflowStepProps {
  step: number
  title: string
  color: string
  textColor: string
  Icon: React.ComponentType<{ className?: string }>
  description: string
  className?: string
}

function WorkflowStep({
  step,
  title,
  color,
  textColor,
  Icon: IconComponent,
  description,
  className,
}: WorkflowStepProps) {
  return (
    <Card
      className={cn(
        "workflow-step h-full border border-border hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300",
        className
      )}
    >
      <CardContent className="p-6 text-center">
        <div
          className={cn(
            "mx-auto mb-4 rounded-full size-10 flex items-center justify-center font-semibold transition-transform duration-300 group-hover:scale-110",
            color,
            textColor
          )}
        >
          {step}
        </div>
        <IconComponent
          className={cn(
            "mx-auto mb-3 size-5 text-muted-foreground-foreground transition-all duration-300",
            "group-hover:text-primary"
          )}
        />
        <h3 className="font-heading text-base leading-snug font-medium mb-2 text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-slot="how-it-works"
      className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white dark:via-[#1E293B]/30 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
              How Booking Works
            </h2>
            <p className="mt-2 text-muted-foreground-foreground">
              From discovery to production in four simple steps — book your next
              creative space by the hour.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((step) => (
            <WorkflowStep key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}