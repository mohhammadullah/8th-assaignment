"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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

  const refreshUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {
      // Ignore network errors — clear local state regardless.
    } finally {
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
