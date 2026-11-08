"use client";

import React from "react";

export default function BookingButton() {
  return (
    <button
      onClick={() => alert("Booking functionality coming soon!")}
      className="rounded-xl bg-[#38BDF8] px-6 py-3 font-semibold text-white transition hover:bg-[#0EA5E9]"
    >
      Book Now
    </button>
  );
}