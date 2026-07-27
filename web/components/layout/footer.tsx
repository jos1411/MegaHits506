import { MessageCircle, Camera, Film, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SITE_NAME, WHATSAPP_URL } from "@/lib/constants";

const FOOTER_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/gallery", label: "Galería" },
  { href: "/events", label: "Eventos" },
  { href: "/contact", label: "Contacto" },
  { href: "/radio", label: "Radio" },
];

const SOCIAL_LINKS = [
  { href: WHATSAPP_URL, label: "WhatsApp", icon: MessageCircle },
  { href: "#", label: "Instagram", icon: Camera },
  { href: "#", label: "YouTube", icon: Film },
  { href: "#", label: "TikTok", icon: Music2 },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/LogoDiscoMovil.png"
                alt={SITE_NAME}
                width={36}
                height={36}
                className="h-9 w-auto rounded"
              />
              <span className="text-lg font-bold">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Animación, sonido y música para eventos en Pérez Zeledón, Costa Rica. Más de 10 años
              haciendo bailar a Costa Rica.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Navegación
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Contacto
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Arenilla de San Pedro</li>
              <li>Pérez Zeledón, Costa Rica</li>
              <li>
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  +506 XXXX-XXXX
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Redes Sociales
            </h3>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
