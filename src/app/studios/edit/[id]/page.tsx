"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { validateImageUrl } from "@/components/studio-image";
import ProtectedRoute from "@/components/ProtectedRoute";

type Studio = {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  image: string;
  overview?: string;
  amenities?: string[];
  ownerEmail?: string;
  ownerName?: string;
  hostName?: string;
};

function EditForm({ id }: { id: string }) {
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    image: "",
    overview: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch(`/api/studios/${id}`, {
          cache: "no-store",
        });
        if (res.status === 404 || res.status === 400) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to load studio");
        const data = (await res.json()) as Studio;
        if (cancelled) return;
        setStudio(data);
        setForm({
          title: data.title ?? "",
          category: data.category ?? "",
          location: data.location ?? "",
          hourlyRate: String(data.hourlyRate ?? ""),
          securityDeposit: String(data.securityDeposit ?? ""),
          maxCapacity: String(data.maxCapacity ?? ""),
          image: data.image ?? "",
          overview: data.overview ?? "",
        });
      } catch (err) {
        console.error("Edit load error:", err);
        toast.error("Failed to load studio for editing");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studio) return;
    const imageError = validateImageUrl(form.image);
    if (imageError) {
      toast.error(imageError);
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch(`/api/studios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category.trim(),
          location: form.location.trim(),
          hourlyRate: Number(form.hourlyRate),
          securityDeposit: form.securityDeposit
            ? Number(form.securityDeposit)
            : undefined,
          maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : undefined,
          image: form.image.trim(),
          overview: form.overview.trim(),
        }),
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired or you do not own this studio.");
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update studio");
      }

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0F172A]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-[#38BDF8]" />
      </div>
    );
  }

  if (notFound || !studio) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#0F172A] px-4 text-slate-900 dark:text-[#F1F5F9]">
        <h1 className="text-2xl font-bold">Studio not found</h1>
        <Link
          href="/my-listings"
          className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Back to My Listings
        </Link>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] py-3 px-4 text-sm text-slate-900 dark:text-[#F1F5F9] outline-none transition focus:border-sky-500 dark:border-[#38BDF8] focus:ring-2 focus:ring-sky-500";
  const labelClass =
    "block text-sm font-medium text-slate-600 dark:text-[#94A3B8] mb-2";

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F172A] px-4 py-12 text-slate-900 dark:text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/my-listings"
          className="mb-6 inline-flex items-center gap-2 text-sm text-sky-600 dark:text-[#38BDF8] transition hover:underline"
        >
          <ArrowLeft size={16} /> Back to My Listings
        </Link>

        <div className="rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-6 sm:p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-6">Edit Studio Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] p-4">
              <div>
                <label className={labelClass}>Host Name (read-only)</label>
                <input
                  type="text"
                  value={(studio as Studio & { ownerName?: string; hostName?: string }).ownerName || (studio as Studio & { hostName?: string }).hostName || "Studio Host"}
                  readOnly
                  className={`${inputClass} opacity-80 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClass}>Host Email (read-only)</label>
                <input
                  type="text"
                  value={studio.ownerEmail || "Not available"}
                  readOnly
                  className={`${inputClass} opacity-80 cursor-not-allowed`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Studio Title</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Apex Sound Studio"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Podcast Studio"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Hourly Rate</label>
                <input
                  type="number"
                  name="hourlyRate"
                  required
                  min="1"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  placeholder="1500"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                name="location"
                required
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Banani, Dhaka"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Security Deposit</label>
                <input
                  type="number"
                  name="securityDeposit"
                  min="0"
                  value={form.securityDeposit}
                  onChange={handleChange}
                  placeholder="2000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Max Capacity</label>
                <input
                  type="number"
                  name="maxCapacity"
                  min="1"
                  value={form.maxCapacity}
                  onChange={handleChange}
                  placeholder="10"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="url"
                name="image"
                required
                value={form.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Overview / Description</label>
              <textarea
                name="overview"
                rows={4}
                required
                value={form.overview}
                onChange={handleChange}
                placeholder="Describe your studio space, equipment, and amenities..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-4 flex items-center justify-center rounded-xl bg-sky-500 py-4 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <ProtectedRoute>
      <EditForm id={resolvedParams.id} />
    </ProtectedRoute>
  );
}
