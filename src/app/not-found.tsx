import Link from "next/link";
import { Home, Compass, Film } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1120] px-4 py-16 text-center text-slate-900 dark:text-[#F1F5F9]">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 h-96 w-96 rounded-full bg-sky-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 h-96 w-96 rounded-full bg-[#818CF8]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-xl space-y-8">
        {/* Creative Icon Illustration */}
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-sky-500/30 dark:hover:border-[#38BDF8]/30 bg-sky-500/10 text-sky-600 dark:text-[#38BDF8] shadow-2xl backdrop-blur-xl">
          <Film size={56} className="animate-pulse" />
        </div>

        {/* Error Code & Heading */}
        <div className="space-y-3">
          <span className="inline-block rounded-full border border-sky-500/20 dark:hover:border-[#38BDF8]/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-[#7DD3FC]">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            This Scene Is <span className="text-sky-600 dark:text-[#38BDF8]">Off Camera</span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600 dark:text-[#94A3B8] sm:text-base">
            The studio space or page you are looking for might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-400 px-7 py-3.5 font-semibold text-[#0B1120] transition hover:brightness-110"
          >
            <Home size={18} />
            Return to Home
          </Link>
          <Link
            href="/studios"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] px-7 py-3.5 font-semibold text-slate-900 dark:text-[#F1F5F9] transition hover:border-sky-500/50 dark:hover:border-[#38BDF8]/50 hover:bg-white dark:hover:bg-[#1E293B]"
          >
            <Compass size={18} />
            Explore Studios
          </Link>
        </div>
      </div>
    </main>
  );
}