"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";

import type { Photo } from "@/types";

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + photos.length) % photos.length);
    },
    [photos.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(currentIndex - 1);
      if (e.key === "ArrowRight") goTo(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goTo, currentIndex]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]!.clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0]!.clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
  }

  const photo = photos[currentIndex]!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Cerrar"
      >
        <X className="size-6" />
      </button>

      {/* Previous */}
      <button
        onClick={() => goTo(currentIndex - 1)}
        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Anterior"
      >
        <ChevronLeft className="size-8" />
      </button>

      {/* Image */}
      <div className="relative h-full w-full max-h-full max-w-full p-16 flex items-center justify-center">
        <Image
          src={photo.url}
          alt={photo.alt_text ?? ""}
          fill
          className="object-contain"
          sizes="100vw"
          quality={90}
          priority
        />
      </div>

      {/* Next */}
      <button
        onClick={() => goTo(currentIndex + 1)}
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Siguiente"
      >
        <ChevronRight className="size-8" />
      </button>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}
