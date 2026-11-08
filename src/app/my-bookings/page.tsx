'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Booking {
  id: string;
  studioName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError((err as Error).message);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadBookings = async () => {
      try {
        const res = await fetch('/api/bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Booking[] = await res.json();
        if (active) setBookings(data);
      } catch (err) {
        console.error('Fetch error:', err);
        if (active) {
          setError((err as Error).message);
          toast.error('Failed to load bookings');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadBookings();
    return () => {
      active = false;
    };
  }, [fetchBookings]);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to cancel booking');
      }
      toast.success('Booking cancelled successfully');
      await fetchBookings();
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">My Bookings</h1>
      <div className="space-y-6">
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold">{booking.studioName}</h2>
                  <span
                    className={`inline-block bg-gray-200 text-sm px-2 py-1 rounded ${
                      booking.status === 'Pending'
                        ? 'bg-blue-200 text-blue-800'
                        : booking.status === 'Confirmed'
                        ? 'bg-green-200 text-green-800'
                        : booking.status === 'Completed'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-700">
                    <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Time:</strong> {booking.time}
                  </p>
                  {booking.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}