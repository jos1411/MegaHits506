"use client";

import { Clock, Headphones, Music, Radio, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { NowPlayingResponse } from "@/app/api/nowplaying/route";
import { Equalizer } from "@/components/radio/equalizer";

const RECENT_SONGS: { title: string; artist: string; time: string }[] = [
  { title: "Ella Baila Sola", artist: "Eslabon Armado & Peso Pluma", time: "Hace 5 min" },
  { title: "TQG", artist: "Karol G & Shakira", time: "Hace 12 min" },
  { title: "Flowers", artist: "Miley Cyrus", time: "Hace 19 min" },
  { title: "Bzrp Music Sessions #53", artist: "Bizarrap & Shakira", time: "Hace 26 min" },
  { title: "Un x100to", artist: "Grupo Frontera & Bad Bunny", time: "Hace 33 min" },
];

const SCHEDULE = [
  { time: "06:00 - 09:00", title: "Despertando con Energía", description: "Música para empezar el día" },
  { time: "09:00 - 12:00", title: "Mañanas Hits", description: "Los mejores éxitos de la mañana" },
  { time: "12:00 - 15:00", title: "Tardes Musicales", description: "Variedad para el almuerzo" },
  { time: "15:00 - 18:00", title: "Ritmo de la Tarde", description: "Música para moverte" },
  { time: "18:00 - 21:00", title: "Noches de Fiesta", description: "Lo mejor para la noche" },
  { time: "21:00 - 00:00", title: "After Party", description: "Electrónica y más" },
  { time: "00:00 - 06:00", title: "Madrugada Hits", description: "Música sin parar" },
];

export function RadioClient() {
  const [metadata, setMetadata] = useState<NowPlayingResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNowPlaying() {
      try {
        const res = await fetch("/api/nowplaying");
        if (res.ok) {
          const data: NowPlayingResponse = await res.json();
          if (!cancelled) setMetadata(data);
        }
      } catch {
        // ignore
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      {/* Hero */}
      <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-500">
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
      <div className="mb-10 overflow-hidden rounded-2xl border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-purple-950/40 via-fuchsia-950/40 to-violet-950/40 p-8 sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <Radio className="size-6 text-primary" />
            <h2 className="text-xl font-semibold">Sonando Ahora</h2>
            <Equalizer active className="ml-2 h-5" />
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-muted/80">
              {metadata?.artwork ? (
                <Image
                  src={metadata.artwork}
                  alt="Album art"
                  width={96}
                  height={96}
                  className="size-full rounded-2xl object-cover"
                  unoptimized
                />
              ) : (
                <Music className="size-10 text-muted-foreground" />
              )}
            </div>
            <div className="text-center sm:text-left">
              {metadata?.song ? (
                <>
                  <p className="text-2xl font-bold">{metadata.song}</p>
                  <p className="text-lg text-muted-foreground">
                    {metadata.artist || "Mega Hits 506"}
                  </p>
                  {metadata.album && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Álbum: {metadata.album}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold">Mega Hits 506</p>
                  <p className="text-lg text-muted-foreground">
                    Streaming en vivo 24/7
                  </p>
                </>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {metadata?.listeners && metadata.listeners > 0
                  ? `${metadata.listeners} oyentes conectados`
                  : "La metadata se actualiza automáticamente desde el reproductor"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Songs + Schedule grid */}
      <div className="mb-12 grid gap-6 lg:grid-cols-2">
        {/* Recent songs */}
        <div className="rounded-xl border bg-card p-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <h3 className="font-semibold">Historial Reciente</h3>
          </div>
          <div className="space-y-3">
            {RECENT_SONGS.map((song, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Music className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{song.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {song.artist}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {song.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-xl border bg-card p-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <h3 className="font-semibold">Programación</h3>
          </div>
          <div className="space-y-2">
            {SCHEDULE.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <span className="mt-0.5 shrink-0 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {item.time}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-6 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md">
          <Headphones className="mx-auto mb-3 size-8 text-primary" />
          <h3 className="mb-1 font-semibold">24/7</h3>
          <p className="text-sm text-muted-foreground">
            Transmisión continua todo el día, todos los días.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md">
          <Music className="mx-auto mb-3 size-8 text-primary" />
          <h3 className="mb-1 font-semibold">Variedad Musical</h3>
          <p className="text-sm text-muted-foreground">
            Todos los géneros para animar cualquier momento.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-center transition-all hover:shadow-md">
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
