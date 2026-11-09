"use client";

import React from "react";

export default function BookingButton() {
  return (
    <button
      onClick={() => alert("Booking functionality coming soon!")}
      className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
    >
      Book Now
    </button>
  );
}