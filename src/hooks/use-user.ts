"use client"

import { useMemo, useSyncExternalStore } from "react"

export type StudioUser = {
  id: string
  name: string
  email: string
  image?: string
}

// Demo auth: the header needs a concrete "authenticated" state to render its
// user menu, so call `login()` (e.g. from a temporary login page) to switch
// the header into the authenticated state. Replace with a real auth session
// when it becomes available.
const STORAGE_KEY = "studiospace:user"

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // `storage` covers other tabs; `emit()` covers our own calls.
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY)
}

function getServerSnapshot(): string | null {
  return null
}

export function useUser() {
  const serialized = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const user = useMemo<StudioUser | null>(() => {
    if (!serialized) return null
    try {
      return JSON.parse(serialized) as StudioUser
    } catch {
      // Corrupted storage entry — treat as logged out.
      return null
    }
  }, [serialized])

  const login = (
    overrides: Partial<Pick<StudioUser, "name" | "email" | "image">> = {}
  ) => {
    const demo: StudioUser = {
      id: "demo",
      name: overrides.name ?? "Alex Carter",
      email: overrides.email ?? "alex@example.com",
      image: overrides.image,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
    emit()
  }

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    emit()
  }

  return { user, login, logout }
}
