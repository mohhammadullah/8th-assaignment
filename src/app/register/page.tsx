"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { API_BASE_URL } from "@/lib/api";
import { sendGoogleCredential } from "@/lib/google-auth";
import { useUser } from "@/hooks/use-user";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "photoUrl":
        setPhotoUrl(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }
  };

  const passwordRules = [
    {
      label: "At least 6 characters",
      valid: password.length >= 6,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(password),
    },
  ];

  const passwordStrength = passwordRules.filter(
    (rule) => rule.valid
  ).length;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !photoUrl.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (passwordStrength !== 4) {
      toast.error("Please create a stronger password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // ব্যাকএন্ড API-এ রেজিস্ট্রেশন রিকোয়েস্ট পাঠানো
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          photoUrl,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful! Please login.");
      router.push("/login"); 

    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const credential = credentialResponse.credential;
    if (!credential) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }

    try {
      setGoogleLoading(true);
      await sendGoogleCredential(credential);
      await refreshUser();
      toast.success("Welcome to StudioSpace!");
      router.push("/");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#0F172A] border border-[#334155] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-[#64748B] outline-none transition-all duration-300 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20";

  return (
    <main className="min-h-screen bg-[#080F1D] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#111C2E] border border-[#25344A] rounded-3xl overflow-hidden shadow-2xl relative z-10">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0F2942] via-[#10243A] to-[#111C2E] relative overflow-hidden">

          <div className="absolute w-72 h-72 bg-sky-500/10 rounded-full blur-3xl -top-20 -right-20" />

          <div className="relative z-10">
            <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#38BDF8]">✦</span>
              StudioSpace
            </Link>

            <div className="mt-24">
              <span className="inline-flex items-center gap-2 text-sm text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-4 py-2 rounded-full">
                <Sparkles size={16} />
                Creative Spaces, Endless Possibilities
              </span>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mt-7">
                Your Creative
                <br />
                Journey Starts
                <br />
                <span className="text-[#38BDF8]">Right Here.</span>
              </h1>

              <p className="text-[#94A3B8] mt-6 leading-8 max-w-md">
                Join StudioSpace and discover amazing creative spaces.
                Connect with hosts, explore studios, and bring your ideas to life.
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-[#334155] pt-6">
            <p className="text-[#94A3B8] text-sm">
              © 2026 StudioSpace. Built for creators.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-6 sm:p-10 lg:p-12">

          <div className="mb-8">
            <Link href="/" className="lg:hidden text-xl font-bold text-white">
              <span className="text-[#38BDF8]">✦</span> StudioSpace
            </Link>

            <div className="mt-8 lg:mt-0">
              <h2 className="text-3xl font-bold text-white">
                Create Account
              </h2>

              <p className="text-[#94A3B8] mt-2">
                Get started with your creative journey today.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-[#CBD5E1] mb-2 block">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />

                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-[#CBD5E1] mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="text-sm font-medium text-[#CBD5E1] mb-2 block">
                Profile Photo URL
              </label>

              <div className="relative">
                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />

                <input
                  name="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrl}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              {photoUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={photoUrl}
                    alt="Profile preview"
                    className="w-12 h-12 rounded-full object-cover border border-[#38BDF8]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-xs text-[#94A3B8]">
                    Profile preview
                  </span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-[#CBD5E1] mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength */}
              {password && (
                <div className="mt-3">
                  <div className="flex gap-1.5 mb-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwordStrength >= item
                            ? passwordStrength <= 2
                              ? "bg-red-500"
                              : passwordStrength === 3
                                ? "bg-yellow-400"
                                : "bg-green-500"
                            : "bg-[#334155]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs ${
                          rule.valid ? "text-green-400" : "text-[#64748B]"
                        }`}
                      >
                        {rule.valid ? <Check size={13} /> : <X size={13} />}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-[#CBD5E1] mb-2 block">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />

                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {confirmPassword && (
                <p className={`text-xs mt-2 ${
                  password === confirmPassword
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {password === confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#38BDF8] hover:bg-[#0EA5E9] disabled:opacity-60 disabled:cursor-not-allowed text-[#082F49] font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Google Sign-Up */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="h-px flex-1 bg-[#334155]" />
                or sign up with
                <span className="h-px flex-1 bg-[#334155]" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google sign-in failed. Please try again.");
                  }}
                  text="signup_with"
                  size="large"
                />
              </div>
              {googleLoading && (
                <p className="flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
                  <Loader2 className="animate-spin" size={14} />
                  Creating your account with Google…
                </p>
              )}
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-[#94A3B8] pt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#38BDF8] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}