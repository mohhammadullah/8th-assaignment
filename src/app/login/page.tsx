"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { signInWithGoogle } from "@/lib/google-auth";
import { issueAccessToken } from "@/lib/session-token";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw new Error(error.message || "Invalid email or password");
      }

      await refreshUser();
      const tokenIssued = await issueAccessToken();
      if (!tokenIssued) {
        throw new Error("Login succeeded but failed to initialize secure API session. Please try again.");
      }
      toast.success("Successfully logged in!");
      router.push("/");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Google sign-in failed. Please try again."
      );
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0F172A] px-4 py-12 text-slate-900 dark:text-[#F1F5F9] sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] text-foreground shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles size={24} />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome Back to <span className="text-primary">StudioSpace</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground-foreground text-sm">
              Please sign in to your account to continue booking creative spaces
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground-foreground" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-border bg-white dark:bg-[#0F172A] py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground-foreground" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-white dark:bg-[#0F172A] py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground-foreground hover:text-primary cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 py-6 font-semibold text-slate-950 transition-all duration-300 active:scale-[0.99]"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#64748B]">
                <span className="h-px flex-1 bg-slate-200 dark:bg-[#334155]" />
                or continue with
                <span className="h-px flex-1 bg-slate-200 dark:bg-[#334155]" />
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={googleLoading}
                  onClick={handleGoogleClick}
                  className="w-full rounded-xl border-slate-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 py-6 font-semibold"
                >
                  {googleLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <LogIn size={18} />
                  )}
                  Continue with Google
                </Button>
              </div>
              {googleLoading && (
                <p className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-[#94A3B8]">
                  <Loader2 className="animate-spin" size={14} />
                  Signing you in with Google…
                </p>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
