import mongoose, { type Model } from "mongoose"

import { CATEGORIES } from "@/lib/types"

interface StudioDoc {
  slug: string
  title: string
  category: string
  image: string
  hourlyRate: number
  rating: number
  location: string
}

export type { StudioDoc }

const studioSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true, enum: [...CATEGORIES] },
    image: { type: String, required: true },
    hourlyRate: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    location: { type: String, required: true },
  },
  { timestamps: true }
)

export const StudioModel: Model<StudioDoc> =
  mongoose.models.Studio ?? mongoose.model<StudioDoc>("Studio", studioSchema)
