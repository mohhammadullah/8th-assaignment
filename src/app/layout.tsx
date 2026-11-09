import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SiteHeader } from "@/components/layout/header";
import { GoogleAuthProvider } from "@/components/GoogleAuthProvider";
import { AuthProvider } from "@/hooks/use-user";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudioSpace — Rent creative studio space",
  description:
    "Discover and book photo studios, sound stages, podcast rooms, music suites, and art workshops by the hour.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0B1120] text-[#F1F5F9]">

        <GoogleAuthProvider>
          <AuthProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="dark"
              newestOnTop
            />
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}