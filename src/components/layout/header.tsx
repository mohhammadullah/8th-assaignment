
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building,
  CalendarCheck,
  CirclePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import { cn } from "cn"
import { useUser, type StudioUser } from "@/hooks/use-user"
import { Logo } from "@/components/layout/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
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

// Suspense boundary for usePathname()
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
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function UserMenu({
  user,
  onLogout,
}: {
  user: StudioUser
  onLogout: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="flex shrink-0 rounded-full outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          {user.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback>{Initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-1.5">
          <span className="text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard /> Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/dashboard/studios/new" />}>
          <CirclePlus /> Add New Studio
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/dashboard/listings" />}>
          <Building /> My Studio Listings
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/dashboard/bookings" />}>
          <CalendarCheck /> My Bookings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut /> Logout
        </DropdownMenuItem>
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
      className="sticky top-0 z-50 w-full border-b border-[#334155] bg-[#0B1120]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#0B1120]/70"
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav
          aria-label="Main"
          className="mx-auto hidden items-center gap-5 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <SuspenseNavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {user ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Login
              </Button>

              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/register" />}
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X /> : <Menu />}
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-[#334155] bg-[#0B1120]/95 md:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6"
          >
            {NAV_ITEMS.map((item) => (
              <SuspenseNavLink
                key={item.href}
                {...item}
                className="px-2 py-2"
                onClick={() => setMobileOpen(false)}
              />
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t pt-3">
              {user ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar>
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback>
                        {Initials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut /> Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/login" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Button>

                  <Button
                    nativeButton={false}
                    render={<Link href="/register" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export { isNavActive, NAV_ITEMS }
