import { CheckCircle, Music, Mic2, PartyPopper, ArrowRight } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { WHATSAPP_URL, SITE_NAME } from "@/lib/constants";

const SERVICES = [
  {
    title: "Animación",
    description:
      "Animadores profesionales que mantienen la energía de tu evento al máximo. Juegos, dinámicas y mucho baile para todas las edades.",
    icon: PartyPopper,
  },
  {
    title: "Sonido Profesional",
    description:
      "Equipos de sonido de última generación para cualquier tipo de evento. Claridad y potencia que garantizan la mejor experiencia auditiva.",
    icon: Music,
  },
  {
    title: "Música para Eventos",
    description:
      "DJs experimentados con un repertorio variado: salsa, merengue, bachata, pop, electrónica y más. Adaptamos la música a tu estilo.",
    icon: Mic2,
  },
];

const HIGHLIGHTS = [
  "Más de 10 años de experiencia",
  "Equipos de sonido profesionales",
  "Animación para todas las edades",
  "Cobertura en todo Pérez Zeledón",
];

const STATS = [
  { value: "10+", label: "Años de experiencia" },
  { value: "500+", label: "Eventos realizados" },
  { value: "15K+", label: "Invitados atendidos" },
  { value: "98%", label: "Clientes satisfechos" },
];

const MILESTONES = [
  { year: "2014", text: "Fundación de Mega Hits 506 en Pérez Zeledón" },
  { year: "2016", text: "Primer evento masivo con más de 500 asistentes" },
  { year: "2018", text: "Renovación completa de equipos de sonido e iluminación" },
  { year: "2020", text: "Adaptación a eventos virtuales y streaming" },
  { year: "2024", text: "Lanzamiento de nuestra radio online" },
  { year: "2026", text: "Más de 500 eventos realizados con éxito" },
];

export default function LandingPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-fuchsia-950 to-violet-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(270,100%,50%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(330,100%,50%,0.1),transparent_50%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="mb-8 flex justify-center">
            <Image
              src="/LogoDiscoMovil.png"
              alt={SITE_NAME}
              width={140}
              height={140}
              className="h-28 w-auto sm:h-36"
              priority
            />
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {SITE_NAME}
          </h1>
          <p className="mb-2 text-xl font-semibold text-fuchsia-300 sm:text-2xl">
            ¡Hacemos bailar a Costa Rica!
          </p>
          <p className="mb-8 max-w-2xl text-lg text-zinc-300 sm:text-xl">
            Animación profesional, sonido de primera calidad y música para tus eventos. Bodas,
            quinceañeras, fiestas empresariales y más.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[#25D366] px-8 text-base font-medium text-white transition-all hover:bg-[#1da851] active:translate-y-px"
            >
                Contáctanos por WhatsApp
                <ArrowRight className="size-5" />
            </a>
            <a
              href="/gallery"
              className="inline-flex h-14 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-8 text-base font-medium text-white backdrop-blur transition-all hover:bg-white/20 active:translate-y-px"
            >
              Ver Galería
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Services ─── */}
      <section id="servicios" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestros Servicios</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Todo lo que necesitas para que tu evento sea inolvidable
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Card key={service.title} className="group border-0 bg-muted/30 p-6 transition-all hover:bg-muted/50 hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <service.icon className="size-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About / Mission Vision ─── */}
      <section className="bg-muted/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sobre Nosotros</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Conoce nuestra historia y lo que nos motiva
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 rounded-xl border bg-card p-8">
              <h3 className="text-2xl font-bold text-primary">Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Brindar experiencias musicales inolvidables en cada evento, combinando animación
                profesional, sonido de calidad y pasión por lo que hacemos. Nos dedicamos a hacer de
                tu celebración un momento único lleno de alegría y buena música.
              </p>
            </div>
            <div className="space-y-4 rounded-xl border bg-card p-8">
              <h3 className="text-2xl font-bold text-primary">Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser la empresa líder en animación y sonido para eventos en la zona sur de Costa Rica,
                reconocida por nuestra calidad, profesionalismo y capacidad de transformar cualquier
                celebración en una experiencia inolvidable.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-muted/30 px-4 py-3">
                <CheckCircle className="size-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline ─── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nuestra Trayectoria</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Más de una década haciendo bailar a Costa Rica
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 h-full w-px bg-border" />

            <div className="space-y-8">
              {MILESTONES.map((milestone) => (
                <div key={milestone.year} className="relative flex gap-6">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                    {milestone.year[2]}
                    {milestone.year[3]}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                    <p className="mt-1 text-muted-foreground">{milestone.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="bg-gradient-to-r from-purple-950 via-fuchsia-950 to-violet-950 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            ¿Listo para hacer de tu evento algo inolvidable?
          </h2>
          <p className="mb-8 text-lg text-zinc-300">
            Contáctanos hoy y descubre cómo podemos hacer de tu celebración la mejor fiesta.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[#25D366] px-8 text-base font-medium text-white transition-all hover:bg-[#1da851] active:translate-y-px"
          >
              Escríbenos por WhatsApp
              <ArrowRight className="size-5" />
          </a>
        </div>
      </section>
    </>
  );
}
