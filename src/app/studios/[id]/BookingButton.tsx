"use client";

import React from "react";
import { toast } from "sonner";

export default function BookingButton() {
  return (
    <button
      onClick={() => toast.info("Booking functionality coming soon!")}
      className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition-all duration-300 hover:bg-sky-400"
    >
      Book Now
    </button>
  );
}