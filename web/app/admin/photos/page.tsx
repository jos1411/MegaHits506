"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { ImageIcon, Trash2, Upload } from "lucide-react";
import NextImage from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";

import { deletePhotoAction, uploadPhotoAction, type PhotoActionState } from "@/actions/photos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Photo } from "@/types/database";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploadState, uploadAction, uploadPending] = useActionState<PhotoActionState, FormData>(
    uploadPhotoAction,
    { error: null, success: false },
  );

  const [deleteState, deleteAction, deletePending] = useActionState<PhotoActionState, FormData>(
    deletePhotoAction,
    { error: null, success: false },
  );

  async function fetchPhotos() {
    const supabase = createClient();
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setPhotos(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (uploadState.success) {
      setUploadOpen(false);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchPhotos();
    }
  }, [uploadState.success]);

  useEffect(() => {
    if (deleteState.success) {
      setDeleteTarget(null);
      fetchPhotos();
    }
  }, [deleteState.success]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fotos</h1>
          <p className="text-muted-foreground">Administrá las fotos de la galería</p>
        </div>

        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 size-4" />
            Subir foto
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir foto</DialogTitle>
              <DialogDescription>
                Seleccioná una imagen (JPG, PNG, WebP — máx. 5 MB)
              </DialogDescription>
            </DialogHeader>

            <form action={uploadAction} className="space-y-4">
              {uploadState.error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {uploadState.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="file">Archivo</Label>
                <Input
                  ref={fileRef}
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={handleFileChange}
                />
              </div>

              {preview && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <NextImage
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="altText">Texto alternativo</Label>
                <Input
                  id="altText"
                  name="altText"
                  placeholder="Descripción breve de la foto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Leyenda</Label>
                <Input
                  id="caption"
                  name="caption"
                  placeholder="Texto opcional que aparece con la foto"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUploadOpen(false);
                    setPreview(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploadPending}>
                  {uploadPending ? "Subiendo..." : "Subir"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error from delete */}
      {deleteState.error && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {deleteState.error}
        </div>
      )}

      {/* Photo grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Cargando fotos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20">
          <ImageIcon className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">No hay fotos todavía</p>
          <p className="text-xs text-muted-foreground">
            Subí tu primera foto usando el botón de arriba
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="group overflow-hidden">
              <div className="relative aspect-[4/3]">
                <NextImage
                  src={photo.url}
                  alt={photo.alt_text ?? "Foto de galería"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {photo.caption && (
                      <p className="truncate text-sm font-medium">{photo.caption}</p>
                    )}
                    {photo.alt_text && !photo.caption && (
                      <p className="truncate text-xs text-muted-foreground">{photo.alt_text}</p>
                    )}
                  </div>
                  <Dialog
                    open={deleteTarget?.id === photo.id}
                    onOpenChange={(open) => {
                      if (!open) setDeleteTarget(null);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100"
                      aria-label="Eliminar foto"
                      onClick={() => setDeleteTarget(photo)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>¿Eliminar foto?</DialogTitle>
                        <DialogDescription>
                          Esta acción no se puede deshacer. La foto se eliminará
                          tanto de la galería como del almacenamiento.
                        </DialogDescription>
                      </DialogHeader>

                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={photo.id} />
                        <input type="hidden" name="url" value={photo.url} />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            variant="destructive"
                            disabled={deletePending}
                          >
                            {deletePending ? "Eliminando..." : "Eliminar"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
