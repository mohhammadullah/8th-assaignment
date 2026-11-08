"use client";

import { toast } from "react-toastify";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";

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
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#334155] bg-[#0B1120] px-4 py-3.5 text-sm text-[#F1F5F9] outline-none transition placeholder:text-[#94A3B8] focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/10";

  const labelClass = "text-sm font-medium text-[#F1F5F9]";

  // Handle Input Change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle Amenities
  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item)
        ? prev.filter((amenity) => amenity !== item)
        : [...prev, item]
    );
  };

  // Handle Form Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    const studioData = {
      ...formData,
      hourlyRate: Number(formData.hourlyRate),
      securityDeposit: Number(formData.securityDeposit),
      maxCapacity: Number(formData.maxCapacity),
      amenities,
    };

    try {
     
     const res = await fetch("http://localhost:5000/api/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studioData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit studio");
      }

      console.log("Backend Response:", data);
      console.log("Studio Data:", studioData);

      toast.success("Studio listed successfully!");

      setFormData(initialFormData);
      setAmenities([]);

    } catch (error) {
      console.error("Submission Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit listing."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1120] px-4 py-12 text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#94A3B8] transition hover:text-[#38BDF8]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/20 bg-[#38BDF8]/10 px-4 py-2 text-sm text-[#7DD3FC]">
            <Sparkles size={15} />
            Become a Host
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            List Your <span className="text-[#38BDF8]">Creative Space</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#94A3B8]">
            Share your creative space with photographers, filmmakers,
            podcasters, and other creators. Fill in the details below to get
            started.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-[#334155] bg-[#1E293B] p-5 sm:p-8"
        >

          {/* Basic Information */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Tell creators about your studio.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Studio Title *
                </label>
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
                <label htmlFor="category" className={labelClass}>
                  Studio Category *
                </label>
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
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="overview" className={labelClass}>
                  Studio Overview *
                </label>
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

          <div className="h-px bg-[#334155]" />

          {/* Pricing */}
          <section>
            <h2 className="text-xl font-semibold">Pricing & Capacity</h2>
            <p className="mb-6 mt-1 text-sm text-[#94A3B8]">
              Set your rental price and studio capacity.
            </p>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="hourlyRate" className={labelClass}>
                  Hourly Rate (৳) *
                </label>
                <input
                  id="hourlyRate"
                  type="number"
                  name="hourlyRate"
                  min="1"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="1500"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="securityDeposit" className={labelClass}>
                  Security Deposit (৳) *
                </label>
                <input
                  id="securityDeposit"
                  type="number"
                  name="securityDeposit"
                  min="0"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="2000"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="maxCapacity" className={labelClass}>
                  Max Capacity *
                </label>
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

          <div className="h-px bg-[#334155]" />

          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold">Studio Location</h2>
            <p className="mb-5 mt-1 text-sm text-[#94A3B8]">
              Where can creators find your studio?
            </p>

            <label htmlFor="location" className={labelClass}>
              <MapPin size={15} className="mr-1 inline text-[#38BDF8]" />
              Full Address *
            </label>

            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Khulna, Bangladesh"
              className={inputClass}
              required
            />
          </section>

          <div className="h-px bg-[#334155]" />

          {/* Image */}
          <section>
            <h2 className="text-xl font-semibold">Studio Cover Image</h2>
            <p className="mb-5 mt-1 text-sm text-[#94A3B8]">
              Add a high-quality image of your creative space.
            </p>

            <label htmlFor="image" className={labelClass}>
              <Camera size={15} className="mr-1 inline text-[#38BDF8]" />
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

            {formData.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#334155]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image}
                  alt="Studio preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}
          </section>

          <div className="h-px bg-[#334155]" />

          {/* Amenities */}
          <section>
            <h2 className="text-xl font-semibold">Studio Amenities</h2>
            <p className="mb-5 mt-1 text-sm text-[#94A3B8]">
              Select all facilities available in your studio.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availableAmenities.map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${
                    amenities.includes(item)
                      ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#7DD3FC]"
                      : "border-[#334155] bg-[#0B1120] text-[#94A3B8] hover:border-[#38BDF8]/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                    className="accent-[#38BDF8]"
                  />
                  {item}
                </label>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="border-t border-[#334155] pt-6">
            <p className="mb-5 text-xs leading-6 text-[#94A3B8]">
              By submitting this listing, you confirm that the information
              provided is accurate and that you have permission to rent this
              creative space.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] px-6 py-4 font-semibold text-[#0B1120] transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
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