'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '@/lib/api';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddStudioPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const studioData = {
      title: formData.get('title')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      location: formData.get('location')?.toString() || '',
      hourlyRate: Number(formData.get('hourlyRate')) || 0,
      overview: formData.get('overview')?.toString() || '',
      image: formData.get('image')?.toString() || '',
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/studios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(studioData),
      });

      if (res.status === 401 || res.status === 403) {
        toast.error('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create studio');
      }

      toast.success('Studio listed successfully!');
      router.push('/my-listings');
    } catch (err: unknown) {
      console.error('Add studio error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create studio. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1120] px-4 py-12 text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#38BDF8] transition hover:underline"
        >
          <ArrowLeft size={16} /> Back to Studios
        </Link>

        <ToastContainer position="top-right" />

        <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-6 sm:p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-[#F1F5F9]">Add New Studio Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Studio Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Apex Sound Studio"
                className="w-full rounded-xl border border-[#334155] bg-[#0B1120] py-3 px-4 text-sm text-[#F1F5F9] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  placeholder="e.g. Audio Recording"
                  className="w-full rounded-xl border border-[#334155] bg-[#0B1120] py-3 px-4 text-sm text-[#F1F5F9] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Hourly Rate ($ / ৳)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  required
                  placeholder="50"
                  className="w-full rounded-xl border border-[#334155] bg-[#0B1120] py-3 px-4 text-sm text-[#F1F5F9] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Location</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Banani, Dhaka"
                className="w-full rounded-xl border border-[#334155] bg-[#0B1120] py-3 px-4 text-sm text-[#F1F5F9] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Image URL</label>
              <input
                type="url"
                name="image"
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-[#334155] bg-[#0B1120] py-3 px-4 text-sm text-[#F1F5F9] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Overview / Description</label>
              <textarea
                name="overview"
                rows={4}
                required
                placeholder="Describe your studio space, equipment, and amenities..."
                className="w-full rounded-xl border border-[#334155] bg-[#0B1120] py-3 px-4 text-sm text-[#F1F5F9] outline-none transition focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/10 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 flex items-center justify-center rounded-xl bg-[#38BDF8] py-4 font-semibold text-[#0B1120] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-pointer cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> Creating Studio...
                </>
              ) : (
                'Publish Studio Listing'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}