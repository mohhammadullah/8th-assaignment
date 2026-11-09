
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Aperture,
  Camera,
  Heart,
  Lightbulb,
  Target,
  Users,
  MapPin,
  Star,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Creative Spaces", icon: Aperture },
  { value: "1,200+", label: "Happy Creators", icon: Users },
  { value: "50+", label: "Cities Covered", icon: MapPin },
  { value: "4.9/5", label: "Average Rating", icon: Star },
];

export default function AboutSection() {
  return (
<section
  id="about-us"
  className="relative scroll-mt-20 overflow-hidden bg-white dark:bg-[#0F172A] px-5 py-24 text-slate-900 dark:text-[#F1F5F9] sm:px-8 lg:px-12"
>
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#818CF8]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 dark:hover:border-[#38BDF8]/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-sky-600 dark:text-[#7DD3FC]">
            <Aperture size={15} />
            ABOUT STUDIO SPACE
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Where Creativity
            <span className="block bg-gradient-to-r from-sky-500 to-indigo-400 bg-clip-text text-transparent">
              Finds Its Space.
            </span>
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600 dark:text-[#94A3B8] sm:text-lg">
            Every great idea deserves the perfect environment. We connect
            creative minds with inspiring spaces to bring extraordinary
            ideas to life.
          </p>
        </div>

        {/* Main About Content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="group relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-sky-500/30 to-indigo-400/10 opacity-70 blur-xl transition duration-500 group-hover:opacity-100" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 dark:border-[#334155]">
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85"
                alt="Creative studio workspace"
                fill
                priority={false}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              {/* Dark scrim in both themes — caption text is white on a photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 dark:from-[#0B1120]/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-sky-500 p-3 text-white">
                    <Camera size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Create Without Limits
                    </p>
                    <p className="text-sm text-white/70">
                      Your space. Your vision. Your story.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-[#7DD3FC]">
              Our Story
            </p>

            <h3 className="text-3xl font-bold leading-snug sm:text-4xl">
              More Than Just a Space,
              <span className="text-sky-600 dark:text-[#38BDF8]"> A Place to Create.</span>
            </h3>

            <p className="mt-6 leading-8 text-slate-600 dark:text-[#94A3B8]">
              StudioSpace is a creative studio rental marketplace built for
              photographers, filmmakers, podcasters, musicians, and
              creators. We make it easier to discover and book inspiring
              spaces that match your creative vision.
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-[#94A3B8]">
              Whether you are working on your next photoshoot, recording a
              podcast, or producing a film, we help you find the right
              environment to make it happen.
            </p>

            {/* Mission & Vision */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 transition hover:border-sky-500/50 dark:hover:border-[#38BDF8]/50">
                <Target className="mb-4 text-sky-600 dark:text-[#38BDF8]" size={28} />
                <h4 className="mb-2 font-semibold">Our Mission</h4>
                <p className="text-sm leading-7 text-slate-600 dark:text-[#94A3B8]">
                  To make creative spaces accessible, affordable, and
                  inspiring for everyone.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 transition hover:border-[#818CF8]/50">
                <Lightbulb className="mb-4 text-[#818CF8]" size={28} />
                <h4 className="mb-2 font-semibold">Our Vision</h4>
                <p className="text-sm leading-7 text-slate-600 dark:text-[#94A3B8]">
                  To become the trusted destination for creative spaces
                  around the world.
                </p>
              </div>
            </div>

            <Link
              href="/studios"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-sky-500 hover:bg-sky-400 px-7 py-4 font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.99]"
            >
              Explore Studios
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-24 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 dark:border-[#334155] bg-white/80 dark:bg-white dark:bg-[#1E293B]/80 p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-sky-500/50 dark:hover:border-[#38BDF8]/50"
              >
                <Icon className="mx-auto mb-4 text-sky-600 dark:text-[#38BDF8]" size={26} />
                <h4 className="text-3xl font-bold text-slate-900 dark:text-[#F1F5F9]">
                  {stat.value}
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-[#94A3B8]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="relative mt-20 overflow-hidden rounded-3xl border border-sky-500/20 dark:hover:border-[#38BDF8]/20 bg-gradient-to-r from-slate-50 dark:from-[#1E293B] via-white dark:via-[#1E293B] to-slate-50 dark:to-[#1E293B] px-6 py-12 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/15 blur-[80px]" />

          <div className="relative">
            <Heart className="mx-auto mb-5 text-sky-600 dark:text-[#38BDF8]" size={32} />

            <h3 className="text-3xl font-bold sm:text-4xl">
              Your Next Great Creation
              <span className="block text-sky-600 dark:text-[#7DD3FC]">
                Starts Here.
              </span>
            </h3>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600 dark:text-[#94A3B8]">
              Find the perfect space, bring your vision to life, and
              create something extraordinary with StudioSpace.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-7 py-3.5 font-semibold text-white transition hover:bg-sky-400"
              >
                Find a Studio
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/add-studio"
                className="rounded-xl border border-[#818CF8]/50 px-7 py-3.5 font-semibold text-[#818CF8] transition hover:bg-[#818CF8] hover:text-slate-950"
              >
                Become a Host
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}