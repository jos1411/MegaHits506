"use client";

import {
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { NowPlayingResponse } from "@/app/api/nowplaying/route";
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
    listeners: 0,
    isLive: false,
    error: null,
  });

  const streamUrl = process.env.NEXT_PUBLIC_ICECAST_STREAM_URL ?? "";

  // Fetch now-playing metadata every 10 seconds
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
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setVolume(value);
      if (audioRef.current) {
        audioRef.current.volume = value;
      }
    },
    [],
  );

  const hasMetadata = metadata.song || metadata.artist;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur-md transition-all",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Play/Pause */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={!streamUrl || isOffline}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-40"
          aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
        >
          {isPlaying
            ? <Pause className="size-4 fill-current" />
            : <Play className="size-4 fill-current" />}
        </button>

        {/* Now-playing info */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* Live indicator */}
          {isPlaying && !isOffline && (
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-600" />
            </span>
          )}

          <div className="min-w-0 truncate">
            {isOffline && !isPlaying
              ? (
                <p className="truncate text-sm text-muted-foreground">
                  Radio offline
                </p>
              )
              : hasMetadata
                ? (
                  <>
                    <p className="truncate text-sm font-medium leading-tight">
                      {metadata.song}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {metadata.artist}
                    </p>
                  </>
                )
                : (
                  <p className="truncate text-sm text-muted-foreground">
                    {isPlaying ? "Cargando..." : "Mega Hits 506 Radio"}
                  </p>
                )}
          </div>
        </div>

        {/* Volume control (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleMute}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label={isMuted ? "Activar volumen" : "Silenciar"}
          >
            {isMuted
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
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-muted accent-primary [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            aria-label="Volumen"
          />
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
    </div>
  );
}
