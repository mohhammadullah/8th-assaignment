"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { clearAccessToken, syncAccessToken } from "@/lib/session-token";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, refetch } = authClient.useSession();
  const syncAttemptedRef = useRef<string | null>(null);

  const user: AuthUser | null = useMemo(() => {
    const sessionUser = data?.user;
    if (!sessionUser) return null;
    const photoUrl = sessionUser.image ?? undefined;
    return {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      photoUrl,
      image: photoUrl,
    };
  }, [data]);

  useEffect(() => {
    if (isPending) return;
    if (!user?.id && !user?.email) {
      syncAttemptedRef.current = null;
      return;
    }
    const key = user.id || user.email || "";
    if (syncAttemptedRef.current === key) return;
    syncAttemptedRef.current = key;
    // Best-effort: issue JWT cookie bound to Better Auth session after auth becomes available
    // (covers email login, registration, OAuth redirect landing, and reloads).
    void syncAccessToken();
  }, [isPending, user?.id, user?.email]);

  const refreshUser = useCallback(async () => {
    await refetch();
    // After refreshing Better Auth session, ensure JWT cookie is issued if session exists.
    void syncAccessToken();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      // Clear JWT HTTPOnly cookie on the API (best-effort).
      await clearAccessToken();
    } catch {
      // Ignore
    }
    try {
      await authClient.signOut();
    } catch {
      // Ignore network errors — clear local state regardless.
    } finally {
      syncAttemptedRef.current = null;
      router.push("/login");
    }
  }, [router]);

  const isLoading = isPending;

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
