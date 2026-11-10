'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { apiFetch } from '@/lib/api';
import { downloadInvoice } from '@/lib/invoice';
import { useUser } from '@/hooks/use-user';
import { FileDown, Loader2 } from 'lucide-react';

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

function StatusBadge({ status }: { status: UserBooking['status'] }) {
  const styles: Record<UserBooking['status'], string> = {
    Pending:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Confirmed:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    Cancelled:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/30'}`}
    >
      {status}
    </span>
  );
}

export default function MyBookingsPage() {
  const { user, isLoading } = useUser();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch only the logged-in user's bookings
  const fetchMyBookings = useCallback(async () => {
    try {
      const res = await apiFetch('/api/bookings/my-bookings', {
        method: 'GET',
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

  const [cancelTarget, setCancelTarget] = useState<UserBooking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const confirmCancel = async () => {
    if (!cancelTarget || isCancelling) return;
    const bookingId = cancelTarget._id || cancelTarget.id;

    if (!bookingId) {
      toast.error('Booking ID not found');
      setCancelTarget(null);
      return;
    }

    setIsCancelling(true);
    try {
      const res = await apiFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to cancel booking');
      }

      // Backend performs a soft-cancel (status -> Cancelled) and preserves the
      // record for history/auditing. Remove it from the active My Bookings list
      // immediately so it does not remain visible or reappear after refetch/reload.
      setBookings((prevBookings) =>
        prevBookings.filter((b) => (b._id || b.id) !== bookingId)
      );

      toast.success('Booking cancelled successfully');
      setCancelTarget(null);
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to cancel booking');
      // Keep the booking in the UI and dialog state unchanged on failure.
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-[#0F172A]">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-[#38BDF8]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-[#0F172A] min-h-screen text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-[#0F172A] min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F1F5F9] mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="py-12 text-center text-slate-600 dark:text-[#94A3B8]">
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
                className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-sky-500/50 dark:hover:border-[#38BDF8]/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="aspect-square rounded-xl bg-white dark:bg-[#0F172A] overflow-hidden">
                      <div className="h-24 w-full bg-gradient-to-b from-slate-50 dark:from-[#1E293B] to-slate-50 dark:to-[#0B1120] flex items-center justify-center text-sm text-slate-500 dark:text-[#64748B]">
                        {booking.studioName ? booking.studioName.substring(0, 3).toUpperCase() : 'STD'}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-[#F1F5F9] truncate">{booking.studioName}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-1">
                      {booking.date ? new Date(booking.date).toLocaleDateString() : ''} | {booking.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#334155]">
                  <p className="text-sm text-slate-600 dark:text-[#94A3B8] mb-2">Price</p>
                  <p className="text-lg font-bold text-sky-600 dark:text-[#38BDF8]">
                    ${booking.price} / hr
                  </p>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-200 dark:border-[#334155] pt-4">
                  <button
                    onClick={() =>
                      downloadInvoice(booking, { name: user.name, email: user.email })
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-[#38BDF8] hover:bg-sky-500/20 border border-sky-500/30 dark:hover:border-[#38BDF8]/30 py-3 font-medium text-center transition-colors cursor-pointer"
                  >
                    <FileDown size={16} /> Download Invoice
                  </button>
                  {booking.status === 'Pending' ? (
                    <button
                      onClick={() => setCancelTarget(booking)}
                      className="w-full rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 py-3 font-medium text-center transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-[#64748B] text-center">
                      {booking.status === 'Cancelled'
                        ? 'This booking has been cancelled.'
                        : 'This booking is confirmed.'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-colors duration-300 dark:border-[#334155] dark:bg-[#1E293B]">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-[#F1F5F9]">
              Cancel booking?
            </h3>
            <p className="mb-6 text-sm text-slate-600 dark:text-[#94A3B8]">
              Are you sure you want to cancel your booking of{' '}
              <span className="font-medium text-slate-900 dark:text-[#F1F5F9]">
                {cancelTarget.studioName}
              </span>
              ? This will free up the time slot for other guests.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                disabled={isCancelling}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#334155] dark:bg-[#0F172A] dark:text-[#F1F5F9] dark:hover:bg-[#334155]"
              >
                Keep booking
              </button>
              <button
                onClick={() => void confirmCancel()}
                disabled={isCancelling}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}