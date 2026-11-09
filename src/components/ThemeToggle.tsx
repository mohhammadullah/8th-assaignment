"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme !== "light";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    >
      <span className="relative block h-[18px] w-[18px]">
        {isDark ? (
          <Sun size={18} className="absolute inset-0 rotate-0 transition-transform duration-300" />
        ) : (
          <Moon size={18} className="absolute inset-0 -rotate-90 transition-transform duration-300" />
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
