"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { PhotoLightbox } from "@/components/gallery/photo-lightbox";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types";

interface PhotoGridProps {
  photos: Photo[];
}

const ASPECT_RATIOS = ["aspect-[4/3]", "aspect-[3/4]", "aspect-[1/1]"] as const;

function getRowSpan(index: number): string {
  return ASPECT_RATIOS[index % ASPECT_RATIOS.length] ?? "aspect-[4/3]";
}

function GalleryPhotoCard({
  photo,
  index,
  onClick,
}: {
  photo: Photo;
  index: number;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-muted transition-all duration-500 hover:shadow-xl hover:ring-2 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={cn("relative w-full", getRowSpan(index))}>
        {/* Blur placeholder */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
        <Image
          src={photo.thumbnail_url ?? photo.url}
          alt={photo.alt_text ?? "Foto de galería"}
          fill
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-110",
            loaded ? "opacity-100" : "opacity-0",
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full p-3 pb-4">
            {photo.caption && (
              <p className="text-sm font-medium text-white line-clamp-2">
                {photo.caption}
              </p>
            )}
            {photo.alt_text && !photo.caption && (
              <p className="text-xs text-zinc-300 line-clamp-1">
                {photo.alt_text}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
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
      <EmptyState
        icon={<ImageIcon className="size-8" />}
        title="No hay fotos todavía"
        description="Pronto agregaremos fotos de nuestros eventos. Volvé a visitarnos."
      />
    );
  }

  return (
    <>
      <div className="auto-rows-auto grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <GalleryPhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onClick={() => openLightbox(index)}
          />
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
