import mongoose from "mongoose"



const globalWithMongoose = globalThis as typeof globalThis & {
  __studioSpaceMongoose?: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

export async function connectToDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set")

  globalWithMongoose.__studioSpaceMongoose ??= {
    conn: null,
    promise: null,
  }
  const cached = globalWithMongoose.__studioSpaceMongoose

  if (cached.conn) return cached.conn

  cached.promise ??= mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB ?? "studio-space",
  })
  cached.conn = await cached.promise

  return cached.conn
}
