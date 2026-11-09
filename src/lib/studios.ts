// import type { Studio } from "@/lib/types"
// import { StudioModel, type StudioDoc } from "@/models/studio"
// // import sampleStudios from "@/data/sample-studios.json"
// import { connectToDB } from "@/lib/db"

// // Rendered when MongoDB is missing, unreachable, or has no studios yet — the
// // featured section should never look broken during local development.
// // const FALLBACK_STUDIOS = sampleStudios as unknown as Studio[]


// // export async function getFeaturedStudios(): Promise<Studio[]> {
//   try {
//     // if (!process.env.MONGODB_URI) return FALLBACK_STUDIOS

//     await connectToDB()

//     const docs = (await StudioModel.find()
//       .sort({ rating: -1, createdAt: -1 })
//       .limit(6)
//       .lean()) as StudioDoc[]

//     // if (docs.length === 0) return FALLBACK_STUDIOS

//     return docs.map((doc) => ({
//       slug: doc.slug,
//       title: doc.title,
//       category: doc.category,
//       image: doc.image,
//       hourlyRate: doc.hourlyRate,
//       rating: doc.rating,
//       location: doc.location,
//     }))
//   } catch (error) {
//     console.error("[getFeaturedStudios] falling back to sample studios:", error)
//     // return FALLBACK_STUDIOS
//   }
// // }
