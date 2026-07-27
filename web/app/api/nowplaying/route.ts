import { NextResponse } from "next/server";

import { AZURACAST_URL, NOW_PLAYING_REVALIDATE } from "@/lib/constants";

export interface NowPlayingResponse {
  song: string;
  artist: string;
  album: string | null;
  artwork: string | null;
  listeners: number;
  isLive: boolean;
  error: string | null;
}

export async function GET(): Promise<NextResponse<NowPlayingResponse>> {
  if (!AZURACAST_URL) {
    return NextResponse.json({
      song: "",
      artist: "",
      album: null,
      artwork: null,
      listeners: 0,
      isLive: false,
      error: "AzuraCast URL not configured",
    });
  }

  try {
    const url = `${AZURACAST_URL}/api/nowplaying`;
    const res = await fetch(url, {
      next: { revalidate: NOW_PLAYING_REVALIDATE },
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({
        song: "",
        artist: "",
        album: null,
        artwork: null,
        listeners: 0,
        isLive: false,
        error: `AzuraCast returned ${res.status}`,
      });
    }

    const data = (await res.json()) as Array<{
      now_playing?: {
        song?: {
          title?: string;
          artist?: string;
          album?: string;
          art?: string;
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
      listeners: np?.listeners?.current ?? 0,
      isLive: np?.is_live ?? false,
      error: null,
    });
  } catch {
    return NextResponse.json({
      song: "",
      artist: "",
      album: null,
      artwork: null,
      listeners: 0,
      isLive: false,
      error: null,
    });
  }
}
