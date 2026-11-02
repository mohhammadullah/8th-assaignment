"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

// True after hydration. Use it to defer client-only browser libraries
// (e.g. Swiper) whose initialization reads unstable values like `new Date()`
// — reading them during static prerender fails the cacheComponents build.
// Snapshot is a constant, so it satisfies useSyncExternalStore's stability
// requirement and avoids setState-in-effect.
export function useHydrated() {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
}
