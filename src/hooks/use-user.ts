"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  photoUrl?: string;
  image?: string;
};

// Back-compat aliases for existing consumers.
export type StudioUser = AuthUser;
export type UserType = AuthUser;

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  /** Alias for {@link AuthContextType.isLoading} kept for older call sites. */
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = API_BASE_URL;

function normalizeUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null;
  const u = raw as Record<string, unknown>;
  const name = typeof u.name === "string" ? u.name : "";
  const email = typeof u.email === "string" ? u.email : "";
  if (!name && !email) return null;
  const photoUrl =
    (typeof u.photoUrl === "string" && u.photoUrl) ||
    (typeof u.image === "string" && u.image) ||
    undefined;
  const id =
    (typeof u.id === "string" && u.id) ||
    (typeof u._id === "string" && u._id) ||
    undefined;
  return { id, name, email, photoUrl, image: photoUrl };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data: unknown = await res.json().catch(() => null);
      if (data && typeof data === "object") {
        const payload = data as Record<string, unknown>;
        setUser(normalizeUser(payload.user ?? data));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshUser();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors — clear local state regardless.
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      loading: isLoading,
      logout,
      refreshUser,
    }),
    [user, isLoading, logout, refreshUser]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useUser(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}


export const useAuth = useUser;
