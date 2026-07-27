"use client";

import { Camera, Film, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";

export type GalleryFilterType = "all" | "photos" | "videos";

interface GalleryFilterProps {
  current: GalleryFilterType;
  onChange: (filter: GalleryFilterType) => void;
  photoCount: number;
  videoCount: number;
}

const FILTERS: {
  key: GalleryFilterType;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { key: "all", label: "Todos", icon: LayoutGrid },
  { key: "photos", label: "Fotos", icon: Camera },
  { key: "videos", label: "Videos", icon: Film },
];

export function GalleryFilter({ current, onChange, photoCount, videoCount }: GalleryFilterProps) {
  const counts: Record<GalleryFilterType, number> = {
    all: photoCount + videoCount,
    photos: photoCount,
    videos: videoCount,
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {FILTERS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95",
            current === key
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
        >
          <Icon className="size-4" />
          {label}
          <span
            className={cn(
              "ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold",
              current === key
                ? "bg-primary-foreground/20"
                : "bg-muted text-muted-foreground",
            )}
          >
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
