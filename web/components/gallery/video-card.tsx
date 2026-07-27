import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  index?: number;
}

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  const embedUrl = `https://www.youtube.com/embed/${video.youtube_id}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-muted shadow-sm transition-all duration-500 hover:shadow-xl hover:ring-2 hover:ring-primary/40",
        "animate-in fade-in slide-in-from-bottom-4",
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
    >
      {/* Thumbnail preview (visible by default, hidden when interacting) */}
      <div className="relative aspect-video w-full">
        <Image
          src={thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 sm:group-hover:hidden"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
        {/* Play button over thumbnail */}
        <div className="absolute inset-0 flex items-center justify-center sm:group-hover:hidden">
          <div className="flex size-14 items-center justify-center rounded-full bg-black/60 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 size-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* YouTube badge */}
        <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white uppercase sm:group-hover:hidden">
          YouTube
        </div>

        {/* Iframe (hidden by default, shown on hover on desktop) */}
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 hidden size-full sm:group-hover:block"
          loading="lazy"
        />
      </div>

      {/* Info section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold line-clamp-1">{video.title}</h3>
        {video.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
