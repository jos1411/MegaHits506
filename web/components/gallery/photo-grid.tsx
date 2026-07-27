"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

import { PhotoLightbox } from "@/components/gallery/photo-lightbox";
import type { Photo } from "@/types";

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-muted-foreground">No hay fotos disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted transition-all hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Image
              src={photo.thumbnail_url ?? photo.url}
              alt={photo.alt_text ?? ""}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-xs text-white">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <PhotoLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
