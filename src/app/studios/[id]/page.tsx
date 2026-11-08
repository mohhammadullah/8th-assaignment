'use client';
import { useState, useEffect } from 'react';

interface Studio {
  id: string;
  name: string;
  description: string;
  specifications: string;
  gallery: string[];
  amenities: string[];
  host: {
    name: string;
    bio: string;
    image: string;
  };
}

export default function StudioPage({ params }: { params: { id: string } }) {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/studios/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch studio data');
        }
        const data: Studio = await res.json();
        setStudio(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudio();
  }, [params.id]);

  if (loading) return <p className="text-center py-10">Loading studio details...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!studio) return <p className="text-center text-gray-500">Studio not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{studio.name}</h1>
      <p className="text-gray-600 mb-6">{studio.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {studio.gallery.map((img) => (
          <img
            key={img}
            src={img}
            alt={`${studio.name} gallery`}
            className="rounded shadow"
          />
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Specifications</h2>
        <p className="text-gray-700">{studio.specifications}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Amenities</h2>
        <ul className="list-disc list-inside space-y-1">
          {studio.amenities.map((amenity) => (
            <li key={amenity} className="text-gray-600">{amenity}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between mb-6">
        <img
          src={studio.host.image}
          alt={`${studio.host.name} profile`}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="text-right">
          <h3 className="text-lg font-semibold text-gray-800">{studio.host.name}</h3>
          <p className="text-sm text-gray-600">{studio.host.bio}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Book Workspace Now
        </button>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Book Workspace</h2>
            <p className="text-gray-600 mb-4">
              Select your dates and confirm your reservation to secure the workspace.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}