"use client";

import { Camera, Film, LayoutGrid } from "lucide-react";
import { useState } from "react";

import { GalleryFilter, type GalleryFilterType } from "@/components/gallery/gallery-filter";
import { PhotoGrid } from "@/components/gallery/photo-grid";
import { VideoCard } from "@/components/gallery/video-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Photo, Video } from "@/types";

interface GalleryClientTabsProps {
  photos: Photo[];
  videos: Video[];
}

export function GalleryClientTabs({ photos, videos }: GalleryClientTabsProps) {
  const [filter, setFilter] = useState<GalleryFilterType>("all");

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <GalleryFilter
          current={filter}
          onChange={setFilter}
          photoCount={photos.length}
          videoCount={videos.length}
        />
      </div>

      {/* Photos section */}
      {(filter === "all" || filter === "photos") && (
        <div className="animate-in fade-in duration-500">
          {filter === "all" && photos.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-sm font-medium">
                <Camera className="size-4 text-primary" />
                Fotos
                <span className="text-xs text-muted-foreground">
                  {photos.length}
                </span>
              </div>
            </div>
          )}
          <PhotoGrid photos={photos} />
        </div>
      )}

      {/* Videos section */}
      {(filter === "all" || filter === "videos") && (
        <div className="animate-in fade-in duration-500">
          {filter === "all" && videos.length > 0 && (
            <div className="mb-4 mt-8 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1.5 text-sm font-medium">
                <Film className="size-4 text-primary" />
                Videos
                <span className="text-xs text-muted-foreground">
                  {videos.length}
                </span>
              </div>
            </div>
          )}

          {videos.length === 0 ? (
            filter === "videos" || filter === "all" && photos.length === 0 ? (
              <EmptyState
                icon={<Film className="size-8" />}
                title="No hay videos todavía"
                description="Pronto compartiremos videos de nuestros eventos. Volvé pronto."
              />
            ) : null
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, i) => (
                <VideoCard key={video.id} video={video} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* All empty */}
      {photos.length === 0 && videos.length === 0 && (
        <EmptyState
          icon={<LayoutGrid className="size-8" />}
          title="Galería vacía"
          description="Pronto agregaremos fotos y videos de nuestros eventos. Visitá esta sección más tarde para ver los mejores momentos."
        />
      )}
    </div>
  );
}
