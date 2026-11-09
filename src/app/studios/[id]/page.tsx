"use client";

import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import React, { useEffect, useState, use } from "react";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

type Studio = {
  _id: string;
  image?: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  description?: string;
  overview?: string;
  detailedOverview?: string;
  ownerEmail?: string;
};

async function getStudioDetails(id: string): Promise<Studio | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/studios/${id}`, { cache: "no-store", credentials: "include" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

const TIME_SLOTS = [
  { value: "09:00-11:00", label: "09:00 - 11:00 AM" },
  { value: "11:00-13:00", label: "11:00 AM - 01:00 PM" },
  { value: "13:00-15:00", label: "01:00 - 03:00 PM" },
  { value: "15:00-17:00", label: "03:00 - 05:00 PM" },
  { value: "17:00-19:00", label: "05:00 - 07:00 PM" },
] as const;

async function getBookedSlots(studioId: string, date: string): Promise<string[]> {
  try {
    const params = new URLSearchParams({ studioId, date });
    const res = await fetch(`${API_BASE_URL}/api/bookings/slots?${params.toString()}`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { bookedSlots?: string[] };
    return Array.isArray(data.bookedSlots) ? data.bookedSlots : [];
  } catch {
    return [];
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function StudioDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(() => Boolean(id && id !== "new"));
  const [isBooked, setIsBooked] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const router = useRouter();

  useEffect(() => {
 
    if (!id || id === 'new') {
      return;
    }

    let cancelled = false;

    getStudioDetails(id)
      .then((studioDetails) => {
        if (!cancelled) setStudio(studioDetails);
      })
      .catch(() => {
        if (!cancelled) setStudio(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Fetch already-booked slots whenever the user picks a date, and
  // disable those options so booked slots cannot be selected.
  useEffect(() => {
    if (!id || id === "new" || !date) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      setLoadingSlots(true);
      getBookedSlots(id, date)
        .then((slots) => {
          if (!cancelled) setBookedSlots(slots);
        })
        .catch(() => {
          if (!cancelled) setBookedSlots([]);
        })
        .finally(() => {
          if (!cancelled) setLoadingSlots(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [id, date]);

  // If the selected slot got booked (e.g. after a date change), show the
  // select as unselected instead of holding a stale value — derived during
  // render, no extra state sync needed.
  const displaySlot = bookedSlots.includes(timeSlot) ? "" : timeSlot;

  const allSlotsBooked =
    date !== "" && bookedSlots.length >= TIME_SLOTS.length;

  const handleBook = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studio) return;

    setIsBooked(false);
    setBookingError(null);

    // Belt-and-braces: the option is already disabled, but never submit
    // a slot the availability check flagged as booked.
    if (!date || !timeSlot || bookedSlots.includes(timeSlot)) {
      setBookingError("This time slot is no longer available. Pick another one.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId: studio._id,
          studioName: studio.title,
          date,
          timeSlot,
          price: studio.hourlyRate,
        }),
      });

   
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Booking failed");
      }

      setIsBooked(true);
      router.push("/my-bookings");
    } catch (error: unknown) {
      setBookingError(error instanceof Error ? error.message : "Booking failed");
    }
  };

  if (id === 'new') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-[#F1F5F9]">
        <p>Loading Add Studio Form...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-[#F1F5F9]">
        <p>Loading studio...</p>
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-[#F1F5F9]">
        <h1 className="text-2xl font-bold">Studio not found</h1>
        <Link href="/studios" className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-white">
          Back to Studios
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] px-4 py-12 text-slate-900 dark:text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-sm text-sky-600 dark:text-[#38BDF8] transition hover:underline"
        >
          <ArrowLeft size={16} /> Back to Studios
        </Link>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={studio.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"}
            alt={studio.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/80 dark:bg-[#0B1120]/80 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-[#38BDF8] backdrop-blur-md">
            {studio.category}
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F1F5F9] sm:text-3xl">{studio.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-slate-600 dark:text-[#94A3B8]">
                <MapPin size={16} className="text-sky-600 dark:text-[#38BDF8]" /> {studio.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 dark:text-[#94A3B8]">Hourly Rate</span>
              <p className="text-2xl font-bold text-sky-600 dark:text-[#38BDF8]">${studio.hourlyRate} / hr</p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 dark:border-[#334155] pt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-[#F1F5F9]">About This Studio</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#94A3B8]">
              {studio.overview || studio.description || studio.detailedOverview || "No description provided for this studio yet. Enjoy a professional creative space equipped with top-tier amenities for your next project."}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-[#334155] pt-6">
            <span className="text-xs text-slate-600 dark:text-[#94A3B8]">Host Contact: {studio.ownerEmail || "N/A"}</span>
          </div>

          {/* Booking Form */}
          {isBooked ? (
            <div className="mt-6 p-4 bg-slate-50/50 dark:bg-white dark:bg-[#1E293B]/50 rounded-xl text-center">
              <p className="text-sm text-slate-500 dark:text-[#64748B]">
                <span className="font-medium text-sky-600 dark:text-[#38BDF8]">Booking confirmed!</span>
                Your booking is being processed. Check <Link href="/my-bookings" className="text-sky-600 dark:text-[#38BDF8] hover:underline">My Bookings</Link> for updates.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleBook}
              className="mt-8 p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-[#334155]"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F1F5F9] mb-4">Book This Studio</h3>
              {bookingError && (
                <p role="alert" className="mb-4 text-sm text-red-400">
                  {bookingError}
                </p>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-[#F8FAFC] dark:bg-[#0B1120] py-3 pl-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Time Slot
                  {loadingSlots && (
                    <span className="ml-2 text-xs text-slate-600 dark:text-[#94A3B8]">Checking availability…</span>
                  )}
                  {!loadingSlots && date && bookedSlots.length > 0 && (
                    <span className="ml-2 text-xs text-slate-600 dark:text-[#94A3B8]">
                      ({bookedSlots.length} slot{bookedSlots.length === 1 ? "" : "s"} already booked)
                    </span>
                  )}
                </label>
                <select
                  name="timeSlot"
                  required
                  value={displaySlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  disabled={!date || loadingSlots || allSlotsBooked}
                  className="w-full rounded-xl border border-border bg-[#F8FAFC] dark:bg-[#0B1120] py-3 pl-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                >
                  <option value="" disabled>
                    {allSlotsBooked
                      ? "All slots booked on this date"
                      : date
                        ? "Select a time slot"
                        : "Pick a date first"}
                  </option>
                  {TIME_SLOTS.map((slot) => {
                    const isBookedSlot = bookedSlots.includes(slot.value);
                    return (
                      <option key={slot.value} value={slot.value} disabled={isBookedSlot}>
                        {slot.label}
                        {isBookedSlot ? " (booked)" : ""}
                      </option>
                    );
                  })}
                </select>
                {allSlotsBooked && (
                  <p className="mt-2 text-xs text-red-400">
                    This studio is fully booked on {date}. Try another date.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price (per hour)
                </label>
                <p className="text-lg font-bold text-sky-600 dark:text-[#38BDF8]">
                  {studio.hourlyRate} ৳ / hr
                  <input
                    type="hidden"
                    name="price"
                    value={studio.hourlyRate}
                    className="hidden"
                  />
                </p>
              </div>

              <button
                type="submit"
                disabled={isBooked}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-indigo-400 py-4 font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isBooked ? "Booking..." : "Book Now"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}