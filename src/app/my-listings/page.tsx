'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
}

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchListings = async () => {
    const res = await fetch('/api/listings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch listings');
    }
    return (await res.json()) as Listing[];
  };

  useEffect(() => {
    let active = true;

    fetchListings()
      .then((data) => {
        if (active) setListings(data);
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/listings/${selectedId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete listing');
      }
      setShowDeleteModal(false);
      setDeletingId(selectedId);
      toast.success('Listing deleted successfully!');
      // Refresh listings
      setListings(await fetchListings());
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <a
          href="/listings/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add New Listing
        </a>
      </div>

      <ToastContainer position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
            <p className="text-gray-700">{listing.description}</p>
            <p className="text-gray-600 font-medium">Price: ${listing.price}</p>
            <p className="text-sm text-gray-500">Created: {new Date(listing.createdAt).toLocaleDateString()}</p>
            <div className="flex justify-between mt-4">
              <a
                href={`/listings/${listing.id}/edit`}
                className="text-blue-600 hover:underline"
              >
                Update
              </a>
              <button
                onClick={() => handleDelete(listing.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Delete Listing</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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