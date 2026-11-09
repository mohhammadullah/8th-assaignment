"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Building,
  CalendarCheck,
  CirclePlus,
  Compass,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useUser, type AuthUser } from "@/hooks/use-user";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Studio = {
  _id: string;
  title: string;
  overview?: string;
  hourlyRate?: number;
  createdAt?: string;
};

type Booking = {
  _id?: string;
  id?: string;
  studioName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: "Pending" | "Confirmed" | "Cancelled";
};

function initials(name: string): string {
  if (!name) return "US";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

function StatCard({
  href,
  label,
  value,
  sub,
  icon,
}: {
  href: string;
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] transition hover:border-[#38BDF8]/60">
        <CardContent className="flex items-start justify-between gap-3 pt-6">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-[#F1F5F9]">{value}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#64748B]">{sub}</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] transition group-hover:bg-[#38BDF8]/20">
            {icon}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

function DashboardContent({ user }: { user: AuthUser }) {
  const [listings, setListings] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studioData, bookingData] = await Promise.all([
        fetchJson<Studio[] | { studios?: Studio[] }>(
          `/api/studios/user/${encodeURIComponent(user.email)}`
        ),
        fetchJson<{ bookings?: Booking[] } | Booking[]>(
          "/api/bookings/my-bookings"
        ),
      ]);
      setListings(
        Array.isArray(studioData) ? studioData : (studioData.studios ?? [])
      );
      setBookings(
        Array.isArray(bookingData) ? bookingData : (bookingData.bookings ?? [])
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Couldn't load your dashboard data. Check the API is running.");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const recentListings = [...listings]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 3);

  const recentBookings = bookings.slice(0, 3);
  const confirmedCount = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-900 dark:text-[#F1F5F9]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome banner */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#334155] bg-gradient-to-br from-slate-50 dark:from-[#1E293B] via-slate-100 dark:via-[#162033] to-slate-50 dark:to-[#0B1120] p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Avatar className="h-16 w-16 shrink-0">
              {(user.photoUrl ?? user.image) && (
                <AvatarImage
                  src={user.photoUrl ?? user.image}
                  alt={user.name}
                />
              )}
              <AvatarFallback className="bg-[#38BDF8]/15 text-xl font-bold text-[#38BDF8]">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">
                Welcome back, {user.name}
              </h1>
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-[#94A3B8]">
                {user.email}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-[#64748B]">
                Manage your listings, bookings, and studio activity in one
                place.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <ShieldCheck size={16} /> Active Member
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            href="/my-listings"
            label="Total Studio Listings"
            value={loading ? "…" : String(listings.length)}
            sub="View all listings"
            icon={<Building size={20} />}
          />
          <StatCard
            href="/my-bookings"
            label="Total Bookings"
            value={loading ? "…" : String(bookings.length)}
            sub={`${confirmedCount} confirmed`}
            icon={<CalendarCheck size={20} />}
          />
          <StatCard
            href="/dashboard"
            label="Account Status"
            value="Active"
            sub="Verified member"
            icon={<ShieldCheck size={20} />}
          />
          <Link href="/add-studio" className="group block">
            <Card className="flex h-full flex-col justify-between border-[#38BDF8]/40 bg-gradient-to-br from-[#38BDF8]/15 to-[#818CF8]/10 transition hover:border-[#38BDF8]">
              <CardContent className="flex h-full flex-col justify-between pt-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#38BDF8] text-[#0B1120] transition group-hover:brightness-110">
                  <CirclePlus size={20} />
                </span>
                <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#38BDF8]">
                  Add New Studio
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-0.5"
                  />
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#64748B]">Publish a listing</p>
              </CardContent>
            </Card>
          </Link>
        </section>

        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void load()}
              className="border-red-500/40 text-red-300 hover:bg-red-500/20"
            >
              <RefreshCw size={14} /> Retry
            </Button>
          </div>
        )}

        {/* Recent activity */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Listings</h2>
                <Link
                  href="/my-listings"
                  className="flex items-center gap-1 text-sm font-medium text-[#38BDF8] hover:underline"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              {loading ? (
                <LoadingRow />
              ) : recentListings.length === 0 ? (
                <EmptyState
                  text="No listings yet."
                  cta={{ href: "/add-studio", label: "Add your first studio" }}
                />
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-[#334155]">
                  {recentListings.map((studio) => (
                    <li
                      key={studio._id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{studio.title}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-[#64748B]">
                          {studio.createdAt
                            ? `Listed ${new Date(studio.createdAt).toLocaleDateString()}`
                            : "Recently listed"}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold text-[#38BDF8]">
                        ${studio.hourlyRate ?? 0}/hr
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Bookings</h2>
                <Link
                  href="/my-bookings"
                  className="flex items-center gap-1 text-sm font-medium text-[#38BDF8] hover:underline"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              {loading ? (
                <LoadingRow />
              ) : recentBookings.length === 0 ? (
                <EmptyState
                  text="No bookings yet."
                  cta={{ href: "/studios", label: "Explore studios" }}
                />
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-[#334155]">
                  {recentBookings.map((booking, i) => (
                    <li
                      key={booking._id ?? booking.id ?? `${i}`}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {booking.studioName}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-[#64748B]">
                          {booking.date
                            ? new Date(booking.date).toLocaleDateString()
                            : ""}
                          {booking.timeSlot ? ` · ${booking.timeSlot}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-3 py-1 text-xs font-medium text-[#38BDF8]">
                        {booking.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Quick navigation */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/add-studio", label: "Add Studio", icon: CirclePlus },
            { href: "/my-listings", label: "My Listings", icon: Building },
            { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
            { href: "/studios", label: "Explore Studios", icon: Compass },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 py-3.5 text-sm font-medium text-slate-700 dark:text-[#CBD5E1] transition hover:border-[#38BDF8]/60 hover:text-[#38BDF8]"
            >
              <Icon size={17} /> {label}
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

function LoadingRow() {
  return (
    <div className="flex items-center gap-3 py-6 text-slate-500 dark:text-[#94A3B8]">
      <Loader2 className="h-5 w-5 animate-spin text-[#38BDF8]" />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

function EmptyState({
  text,
  cta,
}: {
  text: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="py-6 text-center">
      <p className="text-sm text-slate-500 dark:text-[#94A3B8]">{text}</p>
      <Link
        href={cta.href}
        className="mt-2 inline-block text-sm font-medium text-[#38BDF8] hover:underline"
      >
        {cta.label}
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-[#0B1120]">
        <Loader2 className="h-8 w-8 animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {user ? (
        <DashboardContent user={user} />
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-[#0B1120]">
          <Loader2 className="h-8 w-8 animate-spin text-[#38BDF8]" />
        </div>
      )}
    </ProtectedRoute>
  );
}