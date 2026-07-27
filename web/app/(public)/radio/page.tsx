import { Headphones, Music, Radio, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Radio en Vivo | Mega Hits 506",
  description:
    "Escuchá Mega Hits 506 Radio en vivo, la mejor música para tus eventos.",
};

export default function RadioPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          EN VIVO
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Mega Hits 506 Radio
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          La radio oficial de Mega Hits 506. Música, entretenimiento y la mejor
          energía para acompañarte donde estés.
        </p>
      </div>

      {/* Now Playing Card */}
      <div className="mb-12 rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Radio className="size-6 text-primary" />
          <h2 className="text-xl font-semibold">Sonando Ahora</h2>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Music className="size-10 text-muted-foreground" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold">Mega Hits 506</p>
            <p className="text-lg text-muted-foreground">
              Streaming en vivo 24/7
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              La metadata de la canción actual se actualiza automáticamente desde
              el reproductor.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-center">
          <Headphones className="mx-auto mb-3 size-8 text-primary" />
          <h3 className="mb-1 font-semibold">24/7</h3>
          <p className="text-sm text-muted-foreground">
            Transmisión continua todo el día, todos los días.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-center">
          <Music className="mx-auto mb-3 size-8 text-primary" />
          <h3 className="mb-1 font-semibold">Variedad Musical</h3>
          <p className="text-sm text-muted-foreground">
            Todos los géneros para animar cualquier momento.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-center">
          <Users className="mx-auto mb-3 size-8 text-primary" />
          <h3 className="mb-1 font-semibold">Para Todos</h3>
          <p className="text-sm text-muted-foreground">
            Música para eventos, trabajo, estudio o relax.
          </p>
        </div>
      </div>
    </div>
  );
}
