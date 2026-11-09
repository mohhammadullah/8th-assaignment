import Link from "next/link";
import { Aperture, ArrowRight, ArrowUpRight, Camera, Mail, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "About Us", href: "/about" },
  { name: "How It Works", href: "/#how-it-works" },
];

const categories = [
  { name: "Photography Studios", href: "/studios?category=photography" },
  { name: "Podcast Studios", href: "/studios?category=podcast" },
  { name: "Music Studios", href: "/studios?category=music" },
  { name: "Film & Video Studios", href: "/studios?category=film" },
];

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    Instagram:
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z",
    Facebook:
      "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.093 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.1 24 12.073z",
    YouTube:
      "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z",
    X: "M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.636 7.584H.475l8.6-9.83L0 1.154h7.594l5.243 6.932zm-1.291 19.49h2.039L6.486 3.24H4.298z",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-4"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

const socials = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "X", href: "https://x.com" },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-slate-200 dark:border-[#334155]/10 bg-white dark:bg-[#0B1120] text-slate-900 dark:text-[#F1F5F9]">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-40 top-0 -z-10 size-[400px] rounded-full bg-[#38BDF8]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-[400px] rounded-full bg-[#818CF8]/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Newsletter Banner */}
        <div className="py-14 md:py-16">
          <div className="relative overflow-hidden rounded-3xl border border-[#38BDF8]/20 bg-gradient-to-br from-white dark:from-[#0B1120] via-white dark:via-[#1E293B] to-[#38BDF8] p-7 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-[#38BDF8]/15 blur-[90px]" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-[#38BDF8]">
                  <Sparkles className="size-3.5" />
                  STAY INSPIRED
                </div>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Creativity starts with
                  <span className="bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
                    inspiration.
                  </span>
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-[#94A3B8] sm:text-base">
                  Get creative ideas, studio updates, and exclusive offers
                  delivered straight to your inbox.
                </p>
              </div>

              <div className="w-full max-w-md">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    aria-label="Email address"
                    className="h-12 border-slate-200 dark:border-[#334155]/10 bg-white/80 dark:bg-[#0B1120]/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] focus-visible:border-[#38BDF8] focus-visible:ring-[#38BDF8]/30"
                  />

                  <Button
                    type="button"
                    className="h-12 shrink-0 gap-2 bg-[#38BDF8] px-6 font-semibold text-white hover:bg-[#2A95D0]"
                  >
                    Subscribe
                    <ArrowRight className="size-4" />
                  </Button>
                </div>

                <p className="mt-3 text-xs text-slate-500 dark:text-[#94A3B8]">
                  Join our creative community. No spam, ever.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] text-[#0B1120] shadow-lg shadow-[#38BDF8]/10 transition group-hover:rotate-12">
                <Aperture className="size-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Studio<span className="text-[#38BDF8]">Space</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-500 dark:text-[#94A3B8]">
              We believe every great idea deserves the perfect environment. Our mission is to connect creative minds with inspiring spaces and make every creative journey easier.
            </p>
            <div className="mt-7 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 dark:border-[#334155]/10 bg-white dark:bg-[#0B1120] text-slate-500 dark:text-[#94A3B8] transition-colors hover:border-[#38BDF8]/50 hover:bg-[#38BDF8] hover:text-white"
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-semibold">
              Quick Navigation
              <span className="size-1.5 rounded-full bg-[#38BDF8]" />
            </h3>

            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-[#94A3B8] transition-colors hover:text-[#818CF8]"
                  >
                    <ArrowUpRight className="size-3.5 text-[#38BDF8] opacity-0 transition group-hover:opacity-100" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-semibold">
              Popular Categories
              <span className="size-1.5 rounded-full bg-[#38BDF8]" />
            </h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-500 dark:text-[#94A3B8] transition-colors hover:text-[#818CF8]"
                  >
                    <Camera className="size-3.5 text-[#818CF8] opacity-0 transition group-hover:opacity-100" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 font-semibold">
              Get In Touch
              <span className="size-1.5 rounded-full bg-[#38BDF8]" />
            </h3>

            <p className="mb-6 text-sm leading-7 text-slate-500 dark:text-[#94A3B8]">
              Have questions or need help? We would love to hear from you.
              Get in touch with our team.
            </p>

            <a
              href="mailto:support@studiospace.com"
              className="flex items-center gap-3 text-sm text-slate-500 dark:text-[#94A3B8] transition hover:text-[#818CF8]"
            >
              <span className="flex size-9 items-center justify-center rounded-lg border border-slate-200 dark:border-[#334155]/10 bg-white dark:bg-[#0B1120] text-[#38BDF8]">
                <Mail className="size-4" />
              </span>
              support@studiospace.com
            </a>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-[#94A3B8]">
              <span className="flex size-9 items-center justify-center rounded-lg border border-slate-200 dark:border-[#334155]/10 bg-white dark:bg-[#0B1120] text-[#38BDF8]">
                <MapPin className="size-4" />
              </span>
              Creative spaces, everywhere.
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200 dark:bg-[#334155]/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-5 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-slate-500 dark:text-[#94A3B8] sm:text-sm">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-[#94A3B8] sm:text-sm">
            <Link
              href="/privacy"
              className="transition hover:text-[#818CF8]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition hover:text-[#818CF8]"
            >
              Terms & Conditions
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-[#94A3B8] sm:text-sm">
            Made with <span className="text-[#38BDF8]">♥</span> for creators
          </p>
        </div>
      </div>
    </footer>
  );
}