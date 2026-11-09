import mongoose, { type Model } from "mongoose"

interface StudioDoc {
  slug?: string
  title: string
  category: string
  image: string
  hourlyRate: number
  rating?: number
  location: string
  overview?: string
  description?: string
  securityDeposit?: number
  maxCapacity?: number
  amenities?: string[]
  ownerEmail?: string
}

export type { StudioDoc }

const studioSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    hourlyRate: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    location: { type: String, required: true },
    overview: { type: String },
    description: { type: String },
    securityDeposit: { type: Number, min: 0 },
    maxCapacity: { type: Number, min: 1 },
    amenities: { type: [String], default: [] },
    ownerEmail: { type: String, index: true },
  },
  { timestamps: true }
)

export const StudioModel: Model<StudioDoc> =
  mongoose.models.Studio ?? mongoose.model<StudioDoc>("Studio", studioSchema)
