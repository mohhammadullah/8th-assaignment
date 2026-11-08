export default function MyBookingsNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-[#0B1120] px-4 text-center text-[#F1F5F9]">
      <h1 className="text-2xl font-bold">Booking not found</h1>
      <p className="mt-2 text-sm text-[#94A3B8]">
        The booking you are looking for does not exist.
      </p>
    </div>
  );
}
