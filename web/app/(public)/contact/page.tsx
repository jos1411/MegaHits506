import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { WHATSAPP_URL, WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para contratar nuestros servicios de animación, sonido y música para eventos en Pérez Zeledón.",
  openGraph: {
    title: "Contacto | Mega Hits 506",
    description:
      "Contáctanos para contratar nuestros servicios de animación, sonido y música para eventos.",
  },
};

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Teléfono / WhatsApp",
    value: WHATSAPP_NUMBER,
    href: WHATSAPP_URL,
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Arenilla de San Pedro, Pérez Zeledón, Costa Rica",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lunes a Sábado: 8:00 AM - 8:00 PM",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contacto</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Estamos listos para hacer de tu evento algo inolvidable
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact cards */}
        <div className="space-y-4">
          {CONTACT_INFO.map((item) => (
            <Card key={item.label} className="transition-colors hover:bg-muted/30">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block font-semibold hover:text-primary transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 font-semibold">{item.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="flex flex-col items-center justify-center rounded-xl border bg-gradient-to-br from-[#25D366]/10 to-transparent p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]">
            <MessageCircle className="size-8 text-white" />
          </div>
          <h3 className="mb-2 text-xl font-bold">¡Escríbenos ahora!</h3>
          <p className="mb-6 text-muted-foreground">
            Responde rápido. Cuéntanos sobre tu evento y te daremos una cotización sin compromiso.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[#25D366] px-8 text-base font-medium text-white transition-all hover:bg-[#1da851] active:translate-y-px"
          >
              <MessageCircle className="size-5" />
              Enviar WhatsApp
          </a>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-12 overflow-hidden rounded-xl border bg-muted/30">
        <div className="flex aspect-[21/9] items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 size-8 text-primary" />
            <p className="text-sm text-muted-foreground">
              Arenilla de San Pedro, Pérez Zeledón, Costa Rica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
