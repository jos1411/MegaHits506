import type { Metadata } from "next";

import { GalleryClientTabs } from "@/components/gallery/gallery-client-tabs";
import { getPhotos, getVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Explora nuestra galería de fotos y videos de eventos en Pérez Zeledón. Bodas, quinceañeras, fiestas empresariales y más.",
  openGraph: {
    title: "Galería | Mega Hits 506",
    description:
      "Explora nuestra galería de fotos y videos de eventos en Pérez Zeledón.",
  },
};

export default async function GalleryPage() {
  const [photos, videos] = await Promise.all([getPhotos(), getVideos()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-bold tracking-tight">Galería</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Revive los mejores momentos de nuestros eventos
        </p>
      </div>

      <GalleryClientTabs photos={photos} videos={videos} />
    </div>
  );
}
