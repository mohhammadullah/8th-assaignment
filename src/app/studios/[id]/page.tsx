import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import React from "react";
import BookingButton from "./BookingButton"; // ক্লায়েন্ট কম্পোনেন্টটি ইমপোর্ট করা হলো

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
    const res = await fetch(`http://localhost:5000/api/studios/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudioDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const studio = await getStudioDetails(resolvedParams.id);

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
            {/* ক্লায়েন্ট কম্পোনেন্ট এখানে রেন্ডার করা হলো */}
            <BookingButton />
          </div>
        </div>
      </div>
    </main>
  );
}