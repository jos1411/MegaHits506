"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/gallery", label: "Galería" },
  { href: "/events", label: "Eventos" },
  { href: "/contact", label: "Contacto" },
  { href: "/radio", label: "Radio" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Abrir menú">
        <Menu className="size-6" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <span className="text-lg font-bold">Menú</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Cerrar menú">
              <X className="size-6" />
            </Button>
          </div>
          <nav className="flex flex-col gap-2 p-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-lg font-medium transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
