// Seeds the studio collection with src/data/sample-studios.json.
// Usage: node scripts/seed.mjs   (reads MONGODB_URI/MONGODB_DB from .env.local / .env)
import { readFileSync } from "node:fs"
import path from "node:path"
import mongoose from "mongoose"

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const raw = readFileSync(path.resolve(process.cwd(), file), "utf8")
      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
      }
    } catch {
      // Missing env file — fall through.
    }
  }
}

loadEnv()

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set (add it to .env.local, see .env.example)")
  process.exit(1)
}

const studios = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "src/data/sample-studios.json"), "utf8")
)

const studioSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    hourlyRate: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    location: { type: String, required: true },
  },
  { timestamps: true }
)

const Studio = mongoose.models.Studio ?? mongoose.model("Studio", studioSchema)

await mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.MONGODB_DB ?? "studiospace",
})

for (const studio of studios) {
  await Studio.updateOne({ slug: studio.slug }, { $set: studio }, { upsert: true })
  console.log(`upserted: ${studio.slug}`)
}

console.log(`Seed complete (${studios.length} studios).`)
await mongoose.disconnect()
