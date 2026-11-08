"use client";

import Link from "next/link";
import { MapPin, ArrowLeft, Calendar, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
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

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function StudioDetailsPage({ params }: PageProps) {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingError, bookingErrorState] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    params
      .then(({ id }) => getStudioDetails(id))
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
  }, [params]);

  const handleBook = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studio) return;

    setIsBooked(false);
    bookingErrorState(null);
    const formData = new FormData(e.currentTarget);

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
          date: formData.get("date")?.toString() || "",
          timeSlot: formData.get("timeSlot")?.toString() || "",
          price: studio.hourlyRate,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Booking failed");
      }

      setIsBooked(true);
      router.push("/my-bookings");
    } catch (error: unknown) {
      bookingErrorState(error instanceof Error ? error.message : "Booking failed");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B1120] text-[#F1F5F9]">
        <p>Loading studio...</p>
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0B1120] text-[#F1F5F9]">
        <h1 className="text-2xl font-bold">Studio not found</h1>
        <Link href="/studios" className="mt-4 rounded-xl bg-[#38BDF8] px-4 py-2 text-white">
          Back to Studios
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120] px-4 py-12 text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#38BDF8] transition hover:underline"
        >
          <ArrowLeft size={16} /> Back to Studios
        </Link>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#334155] bg-[#1E293B]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={studio.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"}
            alt={studio.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-[#0B1120]/80 px-3 py-1 text-xs font-semibold text-[#38BDF8] backdrop-blur-md">
            {studio.category}
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-[#334155] bg-[#1E293B] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#F1F5F9] sm:text-3xl">{studio.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-[#94A3B8]">
                <MapPin size={16} className="text-[#38BDF8]" /> {studio.location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#94A3B8]">Hourly Rate</span>
              <p className="text-2xl font-bold text-[#38BDF8]">${studio.hourlyRate} / hr</p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#334155] pt-6">
            <h3 className="text-lg font-semibold text-[#F1F5F9]">About This Studio</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
              {studio.description || "No description provided for this studio yet. Enjoy a professional creative space equipped with top-tier amenities for your next project."}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#334155] pt-6">
            <span className="text-xs text-[#94A3B8]">Host Contact: {studio.ownerEmail || "N/A"}</span>
          </div>

          {/* Booking Form */}
          {isBooked ? (
            <div className="mt-6 p-4 bg-[#1E293B]/50 rounded-xl text-center">
              <p className="text-sm text-[#64748B]">
                <span className="font-medium text-[#38BDF8]">Booking confirmed!</span>
                Your booking is being processed. Check <Link href="/my-bookings" className="text-[#38BDF8] hover:underline">My Bookings</Link> for updates.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleBook}
              className="mt-8 p-6 bg-[#1E293B] rounded-2xl border border-[#334155]"
            >
              <h3 className="text-xl font-bold text-[#F1F5F9] mb-4">Book This Studio</h3>
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
                  className="w-full rounded-xl border border-border bg-[#0B1120] py-3 pl-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Time Slot
                </label>
                <select
                  name="timeSlot"
                  required
                  className="w-full rounded-xl border border-border bg-[#0B1120] py-3 pl-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="" disabled>
                    Select a time slot
                  </option>
                  <option value="09:00-11:00">09:00 - 11:00 AM</option>
                  <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                  <option value="13:00-15:00">01:00 - 03:00 PM</option>
                  <option value="15:00-17:00">03:00 - 05:00 PM</option>
                  <option value="17:00-19:00">05:00 - 07:00 PM</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price (per hour)
                </label>
                <p className="text-lg font-bold text-[#38BDF8]">
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
                className="w-full rounded-xl bg-gradient-to-r from-primary to-[#818CF8] py-4 font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
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