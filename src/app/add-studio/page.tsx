"use client";

import { toast } from "sonner";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { StudioImage, validateImageUrl } from "@/components/studio-image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/hooks/use-user";

const categories = [
  "Photography Studio",
  "Podcast Studio",
  "Music Studio",
  "Film & Video Studio",
  "Creative Workspace",
];

const availableAmenities = [
  "Professional Lighting",
  "Camera Equipment",
  "Soundproof Room",
  "Air Conditioning",
  "Wi-Fi",
  "Parking",
  "Changing Room",
  "Green Screen",
  "Microphone",
  "Background Setup",
];

type FormData = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  image: string;
  overview: string;
};

const initialFormData: FormData = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  overview: "",
};

export default function HostingPage() {
  return (
    <ProtectedRoute>
      <HostingForm />
    </ProtectedRoute>
  );
}

async function uploadImageFile(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Image upload service is not configured. Please paste a public https image URL instead."
    );
  }

  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    body,
  });
  const data = (await res.json()) as {
    success?: boolean;
    data?: { url?: string; display_url?: string };
    error?: { message?: string };
  };

  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  const url = data.data?.display_url || data.data?.url;
  if (!url) throw new Error("Image upload did not return a URL");
  return url;
}

function HostingForm() {
  const router = useRouter();
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-4 py-3.5 text-sm text-slate-900 dark:text-[#F1F5F9] outline-none transition placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] focus:border-sky-500 dark:border-[#38BDF8] focus:ring-2 focus:ring-sky-500";
  const labelClass = "text-sm font-medium text-slate-900 dark:text-[#F1F5F9]";
  const readOnlyClass = `${inputClass} cursor-not-allowed opacity-80`;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((amenity) => amenity !== item) : [...prev, item]
    );
  };

  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imageError = validateImageUrl(formData.image);
    if (imageError) {
      toast.error(imageError);
      return;
    }

    setIsSubmitting(true);

    const studioData = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      hourlyRate: Number(formData.hourlyRate),
      securityDeposit: formData.securityDeposit ? Number(formData.securityDeposit) : undefined,
      maxCapacity: formData.maxCapacity ? Number(formData.maxCapacity) : undefined,
      location: formData.location.trim(),
      image: formData.image.trim(),
      overview: formData.overview.trim(),
      description: formData.overview.trim(),
      amenities,
    };

    try {
      const res = await apiFetch("/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studioData),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit studio");
      }

      toast.success("Studio listed successfully!");
      setFormData(initialFormData);
      setAmenities([]);
      router.push("/my-listings");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0F172A] px-4 py-12 text-slate-900 dark:text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-[#94A3B8] transition hover:text-sky-600 dark:text-[#38BDF8]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 dark:hover:border-[#38BDF8]/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-600 dark:text-[#7DD3FC]">
            <Sparkles size={15} />
            Become a Host
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            List Your <span className="text-sky-600 dark:text-[#38BDF8]">Creative Space</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#94A3B8]">
            Share your creative space with photographers, filmmakers, podcasters, and other creators.
            Fill in the details below to get started.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-8"
        >
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Host Information</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
                This information comes from your authenticated account and cannot be edited here.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  <User size={15} className="mr-1 inline text-sky-600 dark:text-[#38BDF8]" />
                  Host Name (read-only)
                </label>
                <input value={user?.name || ""} readOnly className={readOnlyClass} />
              </div>
              <div>
                <label className={labelClass}>Host Email (read-only)</label>
                <input value={user?.email || ""} readOnly className={readOnlyClass} />
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-200 dark:bg-[#334155]" />

          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
                Tell creators about your studio.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="title" className={labelClass}>Studio Title *</label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Premium Photography Studio"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>Studio Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="overview" className={labelClass}>Studio Overview *</label>
                <textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  placeholder="Describe your studio, facilities, equipment and what makes it special..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-200 dark:bg-[#334155]" />

          <section>
            <h2 className="text-xl font-semibold">Pricing & Capacity</h2>
            <p className="mb-6 mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
              Set your rental price and studio capacity.
            </p>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="hourlyRate" className={labelClass}>Hourly Rate ($) *</label>
                <input
                  id="hourlyRate"
                  type="number"
                  name="hourlyRate"
                  min="1"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="50"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="securityDeposit" className={labelClass}>Security Deposit ($) *</label>
                <input
                  id="securityDeposit"
                  type="number"
                  name="securityDeposit"
                  min="0"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="100"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="maxCapacity" className={labelClass}>Max Capacity *</label>
                <input
                  id="maxCapacity"
                  type="number"
                  name="maxCapacity"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  placeholder="10"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-200 dark:bg-[#334155]" />

          <section>
            <h2 className="text-xl font-semibold">Studio Location</h2>
            <p className="mb-5 mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
              Where can creators find your studio?
            </p>

            <label htmlFor="location" className={labelClass}>
              <MapPin size={15} className="mr-1 inline text-sky-600 dark:text-[#38BDF8]" />
              Full Address *
            </label>

            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Banani, Dhaka"
              className={inputClass}
              required
            />
          </section>

          <div className="h-px bg-slate-200 dark:bg-[#334155]" />

          <section>
            <h2 className="text-xl font-semibold">Studio Cover Image</h2>
            <p className="mb-5 mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
              Upload an image file or provide a public https image URL.
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  <Upload size={15} className="mr-1 inline text-sky-600 dark:text-[#38BDF8]" />
                  Image Upload
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="mt-2 block w-full text-sm text-slate-600 dark:text-[#94A3B8] file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-700 dark:file:text-sky-300 hover:file:bg-sky-500/20"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-[#64748B]">
                  File upload uses the configured image upload service when available. You can also paste an image URL below.
                </p>
                {isUploadingImage && (
                  <p className="mt-2 inline-flex items-center gap-2 text-xs text-sky-600 dark:text-[#38BDF8]">
                    <Loader2 size={14} className="animate-spin" /> Uploading image...
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="image" className={labelClass}>
                  <Camera size={15} className="mr-1 inline text-sky-600 dark:text-[#38BDF8]" />
                  Image URL *
                </label>
                <input
                  id="image"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/studio-image.jpg"
                  className={inputClass}
                  required
                />
              </div>

              {formData.image && (
                <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-[#334155]">
                  <StudioImage src={formData.image} alt="Studio preview" sizes="(min-width: 1024px) 50vw, 100vw" />
                </div>
              )}
            </div>
          </section>

          <div className="h-px bg-slate-200 dark:bg-[#334155]" />

          <section>
            <h2 className="text-xl font-semibold">Studio Amenities</h2>
            <p className="mb-5 mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
              Select all facilities available in your studio.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availableAmenities.map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${
                    amenities.includes(item)
                      ? "border-sky-500 dark:border-[#38BDF8] bg-sky-500/10 text-sky-600 dark:text-[#7DD3FC]"
                      : "border-slate-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-600 dark:text-[#94A3B8] hover:border-sky-500/50 dark:hover:border-[#38BDF8]/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                    className="accent-sky-500"
                  />
                  {item}
                </label>
              ))}
            </div>
          </section>

          <div className="border-t border-slate-200 dark:border-[#334155] pt-6">
            <p className="mb-5 text-xs leading-6 text-slate-600 dark:text-[#94A3B8]">
              By submitting this listing, you confirm that the information provided is accurate and that you
              have permission to rent this creative space.
            </p>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-6 py-4 font-semibold text-slate-950 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus size={19} />
                  Submit Studio Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
