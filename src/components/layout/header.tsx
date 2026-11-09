'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building,
  CalendarCheck,
  CirclePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Logo } from "@/components/layout/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about-us" },
] as const

function isNavActive(href: string, pathname: string) {
  if (href.startsWith("/#")) return false
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  href,
  label,
  className,
  onClick,
}: {
  href: string
  label: string
  className?: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const active = isNavActive(href, pathname)

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center rounded-md px-1 py-1.5 text-sm font-medium outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:transition-transform",
        active
          ? "text-foreground after:scale-x-100 after:bg-primary"
          : "text-muted-foreground hover:text-foreground hover:after:scale-x-100 hover:after:bg-primary",
        className
      )}
    >
      {label}
    </Link>
  )
}

function SuspenseNavLink(props: React.ComponentProps<typeof NavLink>) {
  return (
    <React.Suspense
      fallback={
        <span className={cn(
          "flex items-center rounded-md px-1 py-1.5 text-sm font-medium",
          "text-muted-foreground",
          props.className
        )}>
          {props.label}
        </span>
      }
    >
      <NavLink {...props} />
    </React.Suspense>
  )
}

function Initials(name: string) {
  if (!name) return "US"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

type UserType = {
  name: string;
  email: string;
  photoUrl?: string;
};

function UserMenu({
  user,
  onLogout,
}: {
  user: UserType
  onLogout: () => void
}) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="flex shrink-0 rounded-full outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          {user.photoUrl && <AvatarImage src={user.photoUrl} alt={user.name} />}
          <AvatarFallback>{Initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white">
        
        {/* User Info Group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-1.5">
            <span className="text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#334155]" />

        {/* Menu Items Group */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard")} className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard size={16} className="text-sky-600 dark:text-[#38BDF8]" /> Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/add-studio")} className="flex items-center gap-2 cursor-pointer">
            <CirclePlus size={16} className="text-sky-600 dark:text-[#38BDF8]" /> Add New Studio
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/my-listings")} className="flex items-center gap-2 cursor-pointer">
            <Building size={16} className="text-sky-600 dark:text-[#38BDF8]" /> My Studio Listings
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/my-bookings")} className="flex items-center gap-2 cursor-pointer">
            <CalendarCheck size={16} className="text-sky-600 dark:text-[#38BDF8]" /> My Bookings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#334155]" />

        {/* Logout Group */}
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={onLogout}
            className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader() {
  const { user, logout } = useUser()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header
      data-slot="site-header"
      className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#334155] bg-[#F8FAFC]/80 dark:bg-[#0B1120]/80 backdrop-blur-md shadow-sm transition-colors duration-300"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav
          aria-label="Main"
          className="mx-auto hidden items-center gap-6 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <SuspenseNavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-sky-500 text-[#082F49] hover:bg-sky-600 font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme + menu toggles */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-900 dark:text-white"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-slate-200 dark:border-[#334155] bg-[#F8FAFC]/95 dark:bg-[#0B1120]/95 md:hidden backdrop-blur-xl transition-colors duration-300"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6"
          >
            {NAV_ITEMS.map((item) => (
              <SuspenseNavLink
                key={item.href}
                {...item}
                className="px-2 py-2.5 text-base"
                onClick={() => setMobileOpen(false)}
              />
            ))}

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 dark:border-[#334155] pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-10 w-10">
                      {user.photoUrl && (
                        <AvatarImage src={user.photoUrl} alt={user.name} />
                      )}
                      <AvatarFallback>{Initials(user.name)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50"
                    >
                      <LayoutDashboard size={15} className="text-sky-600 dark:text-[#38BDF8]" /> Dashboard
                    </Link>
                    <Link
                      href="/add-studio"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50"
                    >
                      <CirclePlus size={15} className="text-sky-600 dark:text-[#38BDF8]" /> Add Studio
                    </Link>
                    <Link
                      href="/my-listings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50"
                    >
                      <Building size={15} className="text-sky-600 dark:text-[#38BDF8]" /> My Listings
                    </Link>
                    <Link
                      href="/my-bookings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50"
                    >
                      <CalendarCheck size={15} className="text-sky-600 dark:text-[#38BDF8]" /> My Bookings
                    </Link>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                  >
                    <LogOut size={16} /> Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-sky-500 text-[#082F49] hover:bg-sky-600 font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export { isNavActive, NAV_ITEMS }