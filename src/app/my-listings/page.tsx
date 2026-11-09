'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Listing {
  _id: string;
  title: string;
  description?: string;
  overview?: string;
  hourlyRate?: number;
  price?: number;
  createdAt?: string;
  ownerEmail?: string;
}

export default function MyListingsPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ✅ শুধু বর্তমান লগইন করা ইউজারের ইমেল দিয়ে তার নিজের লিস্টিংগুলো ফেচ করা
  const fetchListings = useCallback(async () => {
    if (!user?.email) return [];
    try {
      const res = await fetch(`${API_BASE_URL}/api/studios/user/${user.email}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error('Session expired. Please log in.');
        router.push('/login');
        return [];
      }

      if (!res.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await res.json();
      return (Array.isArray(data) ? data : data.studios || []) as Listing[];
    } catch (err) {
      console.error('Error fetching listings:', err);
      throw err;
    }
  }, [user, router]);

  useEffect(() => {
    if (userLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    let active = true;

    fetchListings()
      .then((data) => {
        if (active) setListings(data);
      })
      .catch(() => {
        toast.error('Failed to load your listings');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, userLoading, fetchListings, router]);

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/studios/${selectedId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error('Unauthorized. Please log in again.');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete listing');
      }

      // ইনস্ট্যান্ট লোকাল স্টেট আপডেট (Optimistic UI)
      setListings((prev) => prev.filter((item) => item._id !== selectedId));
      
      setShowDeleteModal(false);
      setSelectedId(null);
      toast.success('Listing deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete listing. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-[#0B1120]">
        <Loader2 className="h-8 w-8 animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-[#0B1120] min-h-screen text-slate-900 dark:text-[#F1F5F9]">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Studio Listings</h1>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">Manage the studios you have added to the platform</p>
        </div>
        <Link
          href="/studios/new"
          className="bg-[#38BDF8] text-[#0B1120] font-semibold px-4 py-2 rounded-xl hover:brightness-110 transition"
        >
          + Add New Listing
        </Link>
      </div>

      <ToastContainer position="top-right" />

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 dark:bg-white dark:bg-[#1E293B]/50 border border-slate-200 dark:border-[#334155] rounded-2xl">
          <p className="text-lg text-slate-500 dark:text-[#94A3B8]">You haven&apos;t listed any studios yet.</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-[#64748B]">Click &quot;Add New Listing&quot; to publish your first studio space!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-[#F1F5F9]">{listing.title}</h2>
                <p className="text-slate-500 dark:text-[#94A3B8] text-sm mb-4 line-clamp-2">
                  {listing.overview || listing.description || "No description provided."}
                </p>
                <p className="text-[#38BDF8] font-bold text-lg mb-4">
                  ${listing.hourlyRate || listing.price || 0} / hr
                </p>
                {listing.createdAt && (
                  <p className="text-xs text-slate-500 dark:text-[#64748B] mb-4">
                    Created: {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-[#334155]">
                <Link
                  href={`/studios/${listing._id}/edit`}
                  className="text-[#38BDF8] hover:underline text-sm font-medium"
                >
                  Update
                </Link>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-2xl shadow-xl p-6 max-w-md w-full text-slate-900 dark:text-[#F1F5F9]">
            <h3 className="text-lg font-semibold mb-4">Delete Listing</h3>
            <p className="text-slate-500 dark:text-[#94A3B8] mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="bg-slate-200 dark:bg-[#334155] text-slate-900 dark:text-[#F1F5F9] px-4 py-2 rounded-xl hover:bg-[#475569] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}