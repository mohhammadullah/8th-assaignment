'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '@/lib/api';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface UserBooking {
  _id?: string;
  id?: string;
  studioId: string;
  studioName: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export default function MyBookingsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch only the logged-in user's bookings
  const fetchMyBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch your bookings');
      }
      const data = await res.json();
      setBookings(data.bookings || data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError((err as Error).message);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const timeoutId = window.setTimeout(() => {
      void fetchMyBookings();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [user, fetchMyBookings]);

  const handleCancel = async (booking: UserBooking) => {
    const bookingId = booking._id || booking.id;

    if (!bookingId) {
      toast.error('Booking ID not found');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to cancel booking');
      }

      // ✅ ইনস্ট্যান্ট UI আপডেট: ক্লিয়ার করার সাথে সাথে কার্ড সরিয়ে ফেলা
      setBookings((prevBookings) =>
        prevBookings.filter((b) => (b._id || b.id) !== bookingId)
      );

      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Failed to cancel booking');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#0B1120]">
        <Loader2 className="h-8 w-8 animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="p-6 bg-[#0B1120] min-h-screen text-red-400">
        <p>{error}</p>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0B1120] min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-[#F1F5F9] mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="py-12 text-center text-[#94A3B8]">
          <p className="text-lg">No bookings found.</p>
          <p className="mt-2">Book a studio to see your bookings here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const uniqueKey =
              booking._id ||
              booking.id ||
              `${booking.studioId}-${booking.date}-${booking.timeSlot}-${booking.price}`;
            return (
              <div
                key={uniqueKey}
                className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#38BDF8]/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="aspect-square rounded-xl bg-[#0B1120] overflow-hidden">
                      <div className="h-24 w-full bg-gradient-to-b from-[#1E293B] to-[#0B1120] flex items-center justify-center text-sm text-[#64748B]">
                        {booking.studioName ? booking.studioName.substring(0, 3).toUpperCase() : 'STD'}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#F1F5F9] truncate">{booking.studioName}</h3>
                    <p className="text-sm text-[#94A3B8] mt-1">
                      {booking.date ? new Date(booking.date).toLocaleDateString() : ''} | {booking.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#334155]">
                  <p className="text-sm text-[#94A3B8] mb-2">Price</p>
                  <p className="text-lg font-bold text-[#38BDF8]">
                    {booking.price} ৳ / hr
                  </p>
                </div>

                {booking.status === 'Pending' ? (
                  <div className="mt-4 pt-4 border-t border-[#334155]">
                    <button
                      onClick={() => handleCancel(booking)}
                      className="w-full rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 py-3 font-medium text-center transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-[#334155] text-sm text-[#64748B]">
                    <p>Status: <span className="font-medium text-[#38BDF8]">{booking.status}</span></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}