"use client";

import {
  Pause,
  Play,
  Radio,
  Volume2,
  VolumeX,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { NowPlayingResponse } from "@/app/api/nowplaying/route";
import { Equalizer } from "@/components/radio/equalizer";
import { cn } from "@/lib/utils";

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isOffline, setIsOffline] = useState(true);
  const [metadata, setMetadata] = useState<NowPlayingResponse>({
    song: "",
    artist: "",
    album: null,
    artwork: null,
    genre: null,
    listeners: 0,
    isLive: false,
    error: null,
  });

  const streamUrl = process.env.NEXT_PUBLIC_ICECAST_STREAM_URL ?? "";

  useEffect(() => {
    let cancelled = false;

    async function fetchNowPlaying() {
      try {
        const res = await fetch("/api/nowplaying");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: NowPlayingResponse = await res.json();
        if (!cancelled) {
          setMetadata(data);
          setIsOffline(!data.isLive);
        }
      } catch {
        if (!cancelled) setIsOffline(true);
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !streamUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsOffline(true));
    }
  }, [isPlaying, streamUrl]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setVolume(value);
      if (audioRef.current) {
        audioRef.current.volume = value;
      }
      if (isMuted && value > 0 && audioRef.current) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    },
    [isMuted],
  );

  const hasMetadata = Boolean(metadata.song || metadata.artist);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-md transition-transform duration-300",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      {/* Thin progress bar (visual only) */}
      {isPlaying && !isOffline && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-fuchsia-500 to-purple-500 animate-pulse" />
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Play/Pause */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={!streamUrl || isOffline}
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            isPlaying && !isOffline
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
            (!streamUrl || isOffline) && "opacity-50",
          )}
          aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
        >
          {isPlaying
            ? <Pause className="size-4 fill-current" />
            : <Play className="size-4 fill-current" />}

          {/* Pulsing ring when live */}
          {isPlaying && !isOffline && (
            <span className="absolute inset-0 rounded-full ring-2 ring-primary animate-ping opacity-30" />
          )}
        </button>

        {/* Now-playing info */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {/* LIVE indicator */}
          <div className="flex shrink-0 items-center gap-1.5">
            {isPlaying && !isOffline ? (
              <>
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-600" />
                </span>
                <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">
                  LIVE
                </span>
              </>
            ) : (
              <>
                <WifiOff className="size-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  OFFLINE
                </span>
              </>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {isOffline && !isPlaying ? (
              <div className="flex items-center gap-2">
                <Radio className="size-3.5 text-muted-foreground" />
                <p className="truncate text-sm text-muted-foreground">
                  Mega Hits 506 Radio
                </p>
              </div>
            ) : hasMetadata ? (
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "truncate text-sm font-medium leading-tight",
                    metadata.song.length > 25 && "animate-marquee",
                  )}
                >
                  {metadata.song || "Música en vivo"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {metadata.artist || "Mega Hits 506"}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Equalizer active={isPlaying && !isOffline} className="h-3" />
                <p className="truncate text-sm text-muted-foreground">
                  {isPlaying ? "Cargando metadata..." : "Mega Hits 506 Radio"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMute}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            aria-label={isMuted ? "Activar volumen" : "Silenciar"}
          >
            {isMuted || volume === 0
              ? <VolumeX className="size-4" />
              : <Volume2 className="size-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-muted accent-primary [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary sm:w-20"
            aria-label="Volumen"
          />
        </div>
      </div>

      {/* Hidden audio element */}
      {streamUrl && (
        <audio
          ref={audioRef}
          src={streamUrl}
          preload="none"
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsOffline(true)}
        />
      )}
    </div>
  );
}
