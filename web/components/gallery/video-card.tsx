import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const embedUrl = `https://www.youtube.com/embed/${video.youtube_id}`;

  return (
    <div className="group relative aspect-video overflow-hidden rounded-lg bg-muted transition-all hover:ring-2 hover:ring-primary/50">
      <iframe
        src={embedUrl}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="size-full"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <h3 className="text-sm font-semibold text-white">{video.title}</h3>
        {video.description && (
          <p className="mt-1 text-xs text-zinc-300 line-clamp-1">{video.description}</p>
        )}
      </div>
    </div>
  );
}
