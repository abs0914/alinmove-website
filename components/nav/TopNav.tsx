"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DownloadCustomerAppButton } from "@/components/brand/DownloadCustomerAppButton";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

const FALLBACK_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/branches", label: "Branches" },
  { href: "/tracking", label: "Track Package" },
  { href: "/drive", label: "Become a Rider" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (["/track", "/tracking"].includes(pathname) && ["/track", "/tracking"].includes(href)) {
    return true;
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNav({ links }: { links?: NavLink[] }) {
  const navLinks = links && links.length > 0 ? links : FALLBACK_LINKS;
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-alin-black/85 sticky top-0 z-40 border-b border-alin-border backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="ALiN Move home" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors hover:text-alin-gold",
                  active ? "text-alin-gold" : "text-alin-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <DownloadCustomerAppButton
            size="sm"
            label="Download App"
            className="hidden sm:inline-flex"
          />

          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 pb-6">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-2 text-base transition-colors",
                        active
                          ? "bg-alin-gold/10 text-alin-gold"
                          : "text-alin-white hover:bg-alin-near-black",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 border-t border-alin-border pt-4">
                  <DownloadCustomerAppButton size="lg" label="Download App" className="w-full" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
