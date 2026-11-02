export const CATEGORIES = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
] as const

export type Category = (typeof CATEGORIES)[number]

// Serialized studio as consumed by UI components — plain scalars only, no
// mongoose documents or ObjectIds.
export type Studio = {
  slug: string
  title: string
  category: string
  image: string
  hourlyRate: number
  rating: number
  location: string
}
