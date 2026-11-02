"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type { Swiper as SwiperClass } from "swiper"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { useHydrated } from "@/hooks/use-hydrated"
import { Button } from "@/components/ui/button"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// High-res visuals (1600px, WEBP via Unsplash) suitable for full-bleed hero.
const SLIDES = [
  {
    id: "photo-studio",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80",
    alt: "Photography studio with a backdrop and lighting rig",
    headline: "Find the perfect studio for your next shoot",
    subtext:
      "Photo studios with pro lighting, seamless backdrops, and gear on site — bookable by the hour in your city.",
  },
  {
    id: "podcast-room",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80",
    alt: "Podcast microphone in a soundproofed room",
    headline: "Soundproof rooms built for your voice",
    subtext:
      "Acoustically treated podcast rooms with multi-cam setups, so you just show up and hit record.",
  },
  {
    id: "music-suite",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.1.0&auto=format&fit=crop&w=1600&q=80",
    alt: "Recording studio mixing console and instruments",
    headline: "Create without limits, rent without hassle",
    subtext:
      "From music suites to sound stages — instant booking, verified hosts, and every space rated by real creators.",
  },
] as const

type Slide = (typeof SLIDES)[number]

function SlideVisual({ slide }: { slide: Slide }) {
  return (
    <div className="relative h-[520px] w-full overflow-hidden sm:h-[560px] lg:h-[640px]">
      <Image
        src={slide.image}
        alt={slide.alt}
        fill
        sizes="100vw"
        priority={slide.id === "photo-studio"}
        className="object-cover"
      />
      {/* Cinematic scrim: deep dark base with warm amber glow at bottom edge */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/95 via-[#111318]/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-[20%] h-[30%] bg-gradient-to-t from-[#FF6B35]/20 to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-32 text-foreground sm:px-6 sm:pb-40">
          <div className="max-w-2xl">
            <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-accent to-[#E9A23B]">
              {slide.headline}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {slide.subtext}
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/studios" />}
                className="shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Studios
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/studios" />}
                className="border-border bg-transparent text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary-foreground transition-all duration-300"
              >
                Host Your Space
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SiteHero() {
  const hydrated = useHydrated()
  const swiperRef = React.useRef<SwiperClass | null>(null)

  // Swiper's autoplay reads `new Date()` during initialization, which fails
  // the static prerender under cacheComponents, so mount it after hydration.
  // Until then a static first slide keeps the hero server-rendered.
  if (!hydrated) {
    return (
      <section data-slot="site-hero" aria-label="Featured studio spaces">
        <SlideVisual slide={SLIDES[0]} />
      </section>
    )
  }

  return (
    <section
      data-slot="site-hero"
      aria-label="Featured studio spaces"
      className="relative group/site-hero"
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <SlideVisual slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute top-1/2 left-3 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-[#111318]/80 border border-border size-10 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 outline-none group-hover/site-hero:opacity-100 focus-visible:opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary sm:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute top-1/2 right-3 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-[#111318]/80 border border-border size-10 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 outline-none group-hover/site-hero:opacity-100 focus-visible:opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary sm:flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </section>
  )
}
