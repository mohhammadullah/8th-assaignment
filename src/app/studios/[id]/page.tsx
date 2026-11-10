"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImageIcon,
  MapPin,
  MessageSquareQuote,
  ShieldCheck,
  Star,
  User,
  Wrench,
} from "lucide-react";
import React, { useEffect, useMemo, useState, use } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { StudioImage } from "@/components/studio-image";
import { useUser } from "@/hooks/use-user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Review = {
  _id?: string;
  name?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

type Studio = {
  _id: string;
  image?: string;
  images?: string[];
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  capacity?: number;
  description?: string;
  overview?: string;
  detailedOverview?: string;
  ownerEmail?: string;
  ownerName?: string;
  hostName?: string;
  amenities?: string[];
  rating?: number;
  reviews?: Review[];
  specifications?: Record<string, string | number>;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const TIME_SLOTS = [
  { value: "09:00-11:00", label: "09:00 - 11:00 AM" },
  { value: "11:00-13:00", label: "11:00 AM - 01:00 PM" },
  { value: "13:00-15:00", label: "01:00 - 03:00 PM" },
  { value: "15:00-17:00", label: "03:00 - 05:00 PM" },
  { value: "17:00-19:00", label: "05:00 - 07:00 PM" },
] as const;

async function getStudioDetails(id: string): Promise<Studio | null> {
  try {
    const res = await apiFetch(`/api/studios/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getBookedSlots(studioId: string, date: string): Promise<string[]> {
  try {
    const params = new URLSearchParams({ studioId, date });
    const res = await apiFetch(`/api/bookings/slots?${params.toString()}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { bookedSlots?: string[] };
    return Array.isArray(data.bookedSlots) ? data.bookedSlots : [];
  } catch {
    return [];
  }
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 sm:p-7 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sky-600 dark:text-[#38BDF8]">{icon}</span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-[#F1F5F9]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function StudioDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(() => Boolean(id && id !== "new"));
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!id || id === "new") return;
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

  useEffect(() => {
    if (!id || id === "new" || !date) {
      return;
    }
    let cancelled = false;
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
    return () => {
      cancelled = true;
    };
  }, [id, date]);

  const effectiveBookedSlots = date ? bookedSlots : [];
  const displaySlot = effectiveBookedSlots.includes(timeSlot) ? "" : timeSlot;
  const allSlotsBooked = date !== "" && effectiveBookedSlots.length >= TIME_SLOTS.length;

  const galleryImages = useMemo(() => {
    if (!studio) return [];
    const imgs = Array.isArray(studio.images) ? studio.images.filter(Boolean) : [];
    const base = studio.image ? [studio.image, ...imgs] : imgs;
    return Array.from(new Set(base.filter((v): v is string => typeof v === "string" && v.trim().length > 0)));
  }, [studio]);

  const amenities = Array.isArray(studio?.amenities) ? studio!.amenities.filter(Boolean) : [];
  const reviews = Array.isArray(studio?.reviews) ? studio!.reviews : [];

  const specificationRows = useMemo(() => {
    if (!studio) return [] as Array<[string, string]>;
    const rows: Array<[string, string]> = [
      ["Category", studio.category || "N/A"],
      ["Location", studio.location || "N/A"],
      ["Hourly Rate", studio.hourlyRate != null ? `$${studio.hourlyRate} / hr` : "N/A"],
      [
        "Capacity",
        String(studio.maxCapacity ?? studio.capacity ?? "Not specified"),
      ],
      [
        "Security Deposit",
        studio.securityDeposit != null ? `$${studio.securityDeposit}` : "Not specified",
      ],
      ["Rating", studio.rating != null ? `${studio.rating.toFixed(1)} / 5` : "Not rated yet"],
    ];
    if (studio.specifications && typeof studio.specifications === "object") {
      for (const [k, v] of Object.entries(studio.specifications)) {
        rows.push([k, String(v)]);
      }
    }
    return rows;
  }, [studio]);

  const handleBook = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studio) return;
    setBookingError(null);

    if (!user && !userLoading) {
      setBookingOpen(false);
      router.push("/login");
      return;
    }

    if (!date || !timeSlot || bookedSlots.includes(timeSlot)) {
      setBookingError("This time slot is no longer available. Pick another one.");
      return;
    }

    setBookingSubmitting(true);
    try {
      const res = await apiFetch(`/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioId: studio._id,
          studioName: studio.title,
          date,
          timeSlot,
          price: studio.hourlyRate,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        setBookingOpen(false);
        router.push("/login");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      toast.success("Studio booked successfully!");
      setBookingOpen(false);
      router.push("/my-bookings");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Booking failed";
      setBookingError(message);
      toast.error(message);
      if (date) {
        getBookedSlots(id, date).then(setBookedSlots).catch(() => undefined);
      }
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (id === "new") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F1F5F9]">
        <p>Loading Add Studio Form...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F1F5F9]">
        <p>Loading studio...</p>
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F1F5F9]">
        <h1 className="text-2xl font-bold">Studio not found</h1>
        <Link href="/studios" className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-white">
          Back to Studios
        </Link>
      </main>
    );
  }

  const hostName = studio.ownerName || studio.hostName || "Studio Host";
  const hostEmail = studio.ownerEmail || "Not provided";

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F172A] px-4 py-10 text-slate-900 dark:text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-[#38BDF8] transition hover:underline"
        >
          <ArrowLeft size={16} /> Back to Studios
        </Link>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B]">
            <StudioImage src={studio.image} alt={studio.title} priority sizes="100vw" />
            <span className="absolute left-4 top-4 rounded-full bg-white/80 dark:bg-[#0B1120]/80 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-[#38BDF8] backdrop-blur-md">
              {studio.category}
            </span>
          </div>

          <aside className="rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 shadow-sm h-fit lg:sticky lg:top-24">
            <h1 className="text-2xl font-bold">{studio.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-[#94A3B8]">
              <MapPin size={16} className="text-sky-600 dark:text-[#38BDF8]" />
              {studio.location}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-[#94A3B8]">
              <Star size={16} className="fill-[#818CF8] text-[#818CF8]" />
              {studio.rating ? `${studio.rating.toFixed(1)} / 5` : "New"} rating
            </p>

            <div className="mt-5 border-t border-slate-200 dark:border-[#334155] pt-5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-[#64748B]">Hourly Rate</p>
              <p className="mt-1 text-2xl font-bold text-sky-600 dark:text-[#38BDF8]">
                ${studio.hourlyRate} / hr
              </p>
            </div>

            <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
              <DialogTrigger
                render={
                  <Button className="mt-6 w-full cursor-pointer rounded-xl bg-sky-500 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-400" />
                }
              >
                Book this Studio
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book {studio.title}</DialogTitle>
                  <DialogDescription>
                    Select a date and an available time slot to confirm your booking.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-[#F1F5F9]" htmlFor="booking-date">
                      Date
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={date}
                      onChange={(e) => {
                        const nextDate = e.target.value;
                        setDate(nextDate);
                        setTimeSlot("");
                        setBookedSlots([]);
                        setLoadingSlots(Boolean(nextDate));
                      }}
                      className="w-full rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-4 py-3 text-sm text-slate-900 dark:text-[#F1F5F9] outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-[#F1F5F9]" htmlFor="booking-slot">
                      Time slot
                    </label>
                    <select
                      id="booking-slot"
                      required
                      value={displaySlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-4 py-3 text-sm text-slate-900 dark:text-[#F1F5F9] outline-none focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={!date || loadingSlots || allSlotsBooked}
                    >
                      <option value="">
                        {!date
                          ? "Select a date first"
                          : loadingSlots
                            ? "Checking availability..."
                            : allSlotsBooked
                              ? "No slots available for this date"
                              : "Select a time slot"}
                      </option>
                      {TIME_SLOTS.filter((slot) => !effectiveBookedSlots.includes(slot.value)).map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    {date && effectiveBookedSlots.length > 0 && !allSlotsBooked ? (
                      <p className="text-xs text-slate-500 dark:text-[#64748B]">
                        {effectiveBookedSlots.length} slot{effectiveBookedSlots.length === 1 ? "" : "s"} already booked for this date.
                      </p>
                    ) : null}
                    {allSlotsBooked ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        This studio is fully booked for the selected date. Please choose another day.
                      </p>
                    ) : null}
                  </div>
                  {bookingError && <p className="text-sm text-red-500">{bookingError}</p>}
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setBookingOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      disabled={bookingSubmitting || allSlotsBooked || !displaySlot}
                    >
                      {bookingSubmitting ? "Booking..." : "Confirm Booking"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Overview" icon={<Building2 size={18} />}>
            <p className="leading-7 text-slate-600 dark:text-[#94A3B8] whitespace-pre-line">
              {studio.detailedOverview || studio.description || studio.overview || "No overview provided by the host yet."}
            </p>
          </SectionCard>

          <SectionCard title="Host Information" icon={<User size={18} />}>
            <div className="space-y-2 text-sm text-slate-600 dark:text-[#94A3B8]">
              <p><span className="font-medium text-slate-900 dark:text-[#F1F5F9]">Name:</span> {hostName}</p>
              <p><span className="font-medium text-slate-900 dark:text-[#F1F5F9]">Email:</span> {hostEmail}</p>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Specifications" icon={<Wrench size={18} />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {specificationRows.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-[#64748B]">{label}</p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-[#F1F5F9]">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Amenities" icon={<ShieldCheck size={18} />}>
            {amenities.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {amenities.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#94A3B8]">
                    <CheckCircle2 size={15} className="text-sky-600 dark:text-[#38BDF8]" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600 dark:text-[#94A3B8]">Amenities have not been listed for this studio yet.</p>
            )}
          </SectionCard>

          <SectionCard title="Image Gallery" icon={<ImageIcon size={18} />}>
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galleryImages.map((img, idx) => (
                  <div key={`${img}-${idx}`} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#0F172A]">
                    <StudioImage src={img} alt={`${studio.title} image ${idx + 1}`} sizes="(min-width: 640px) 33vw, 50vw" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-[#94A3B8]">No gallery images available.</p>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Reviews" icon={<MessageSquareQuote size={18} />}>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <article key={review._id || `${review.name || "review"}-${idx}`} className="rounded-xl border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900 dark:text-[#F1F5F9]">{review.name || "Anonymous"}</p>
                    <p className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-[#94A3B8]">
                      <Star size={14} className="fill-[#818CF8] text-[#818CF8]" />
                      {review.rating != null ? review.rating.toFixed(1) : "N/A"}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-[#94A3B8]">{review.comment || "No comment provided."}</p>
                  {review.createdAt && (
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-[#64748B]">
                      <CalendarDays size={12} />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#94A3B8]">
              <Clock3 size={16} className="text-sky-600 dark:text-[#38BDF8]" />
              No reviews yet. Be the first to book and share your experience.
            </div>
          )}
        </SectionCard>
      </div>
    </main>
  );
}
