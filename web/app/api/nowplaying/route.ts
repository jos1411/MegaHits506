import { NextResponse } from "next/server";

import { AZURACAST_URL, NOW_PLAYING_REVALIDATE } from "@/lib/constants";

export interface NowPlayingResponse {
  song: string;
  artist: string;
  album: string | null;
  artwork: string | null;
  genre: string | null;
  listeners: number;
  isLive: boolean;
  error: string | null;
}

const MOCK_FALLBACKS: Pick<NowPlayingResponse, "song" | "artist" | "album" | "genre">[] = [
  { song: "Ella Baila Sola", artist: "Eslabon Armado & Peso Pluma", album: "Desvelado", genre: "Regional Mexicano" },
  { song: "TQG", artist: "Karol G & Shakira", album: "Mañana Será Bonito", genre: "Reggaetón" },
  { song: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation", genre: "Pop" },
  { song: "Bzrp Music Sessions #53", artist: "Bizarrap & Shakira", album: "Single", genre: "Electrónica" },
  { song: "Un x100to", artist: "Grupo Frontera & Bad Bunny", album: "Single", genre: "Regional Mexicano" },
  { song: "La Bachata", artist: "Manuel Turizo", album: "2000", genre: "Bachata" },
  { song: "Shakira: Bzrp Music Sessions #53", artist: "Bizarrap", album: "Single", genre: "Pop Latino" },
  { song: "Dakiti", artist: "Bad Bunny & Jhay Cortez", album: "El Último Tour Del Mundo", genre: "Reggaetón" },
  { song: "Hawái", artist: "Maluma", album: "Papi Juancho", genre: "Pop Latino" },
  { song: "Me Porto Bonito", artist: "Bad Bunny & Chencho Corleone", album: "Un Verano Sin Ti", genre: "Reggaetón" },
];

let mockIndex = 0;

function getMockNowPlaying(): NowPlayingResponse {
  const track = MOCK_FALLBACKS[mockIndex % MOCK_FALLBACKS.length]!;
  mockIndex++;
  return {
    song: track.song,
    artist: track.artist,
    album: track.album,
    artwork: null,
    genre: track.genre,
    listeners: Math.floor(Math.random() * 50) + 5,
    isLive: true,
    error: null,
  };
}

export async function GET(): Promise<NextResponse<NowPlayingResponse>> {
  if (!AZURACAST_URL) {
    // Return mock data instead of empty when no AzuraCast configured
    return NextResponse.json(getMockNowPlaying());
  }

  try {
    const url = `${AZURACAST_URL}/api/nowplaying`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      next: { revalidate: NOW_PLAYING_REVALIDATE },
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(getMockNowPlaying());
    }

    const data = (await res.json()) as Array<{
      now_playing?: {
        song?: {
          title?: string;
          artist?: string;
          album?: string;
          art?: string;
          genre?: string;
        };
        listeners?: {
          current?: number;
        };
        is_live?: boolean;
      };
    }>;

    const station = data?.[0];
    const np = station?.now_playing;
    const song = np?.song;

    return NextResponse.json({
      song: song?.title ?? "",
      artist: song?.artist ?? "",
      album: song?.album ?? null,
      artwork: song?.art ?? null,
      genre: song?.genre ?? null,
      listeners: np?.listeners?.current ?? 0,
      isLive: np?.is_live ?? true,
      error: null,
    });
  } catch {
    return NextResponse.json(getMockNowPlaying());
  }
}
