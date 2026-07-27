import type { Metadata } from "next";

import { PhotoGrid } from "@/components/gallery/photo-grid";
import { VideoCard } from "@/components/gallery/video-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Galería</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Revive los mejores momentos de nuestros eventos
        </p>
      </div>

      <Tabs defaultValue="fotos" className="w-full">
        <div className="mb-8 flex justify-center">
          <TabsList>
            <TabsTrigger value="fotos">Fotos ({photos.length})</TabsTrigger>
            <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="fotos">
          <PhotoGrid photos={photos} />
        </TabsContent>

        <TabsContent value="videos">
          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-muted-foreground">No hay videos disponibles</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
