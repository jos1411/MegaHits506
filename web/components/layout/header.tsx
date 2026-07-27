import Image from "next/image";
import Link from "next/link";

import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/gallery", label: "Galería" },
  { href: "/events", label: "Eventos" },
  { href: "/contact", label: "Contacto" },
  { href: "/radio", label: "Radio" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/LogoDiscoMovil.png"
            alt="Mega Hits 506"
            width={40}
            height={40}
            className="h-10 w-auto rounded"
          />
          <span className="hidden text-xl font-bold sm:inline">{SITE_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
