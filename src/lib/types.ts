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
  _id?: string; 
  id?: string;
  slug?: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  location: string;
  image: string;
  overview?: string;
  rating?: number;
  amenities?: string[];
};