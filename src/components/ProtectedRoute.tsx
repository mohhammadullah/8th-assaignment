"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#0B1120]">
        <Loader2 className="h-8 w-8 animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
