"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  ArrowDown,
  ArrowUp,
  HardDrive,
  ImageIcon,
  Clock,
  Trash2,
  Upload,
} from "lucide-react";
import NextImage from "next/image";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";

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
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Photo } from "@/types/database";

type SortKey = "created_at" | "caption" | "alt_text";
type SortDir = "asc" | "desc";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [storageUsed, setStorageUsed] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

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
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setPhotos(data);
        const estimatedBytes = data.length * 500 * 1024;
        setStorageUsed(estimatedBytes);
      }
      setLastFetched(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar fotos";
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (uploadState.success) {
      setUploadOpen(false);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      toast("Foto subida correctamente", "success");
      fetchPhotos();
    }
    if (uploadState.error) {
      toast(uploadState.error, "error");
    }
  }, [uploadState.success, uploadState.error, toast]);

  useEffect(() => {
    if (deleteState.success) {
      setDeleteTarget(null);
      toast("Foto eliminada correctamente", "success");
      fetchPhotos();
    }
    if (deleteState.error) {
      toast(deleteState.error, "error");
    }
  }, [deleteState.success, deleteState.error, toast]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL to avoid memory leaks
      if (preview) URL.revokeObjectURL(preview);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }

  // Clean up blob URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragOver(true);
    } else if (e.type === "dragleave") {
      setDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          toast("Solo se permiten imágenes (JPG, PNG, WebP)", "error");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast("El archivo es demasiado grande (máx. 5 MB)", "error");
          return;
        }
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const input = fileRef.current;
        if (input) {
          input.files = dataTransfer.files;
          input.dispatchEvent(new Event("change", { bubbles: true }));
          setUploadOpen(true);
        }
      }
    },
    [toast],
  );

  const sortedPhotos = [...photos].sort((a, b) => {
    let valA: string = "";
    let valB: string = "";

    if (sortKey === "created_at") {
      valA = a.created_at;
      valB = b.created_at;
    } else if (sortKey === "caption") {
      valA = a.caption ?? "";
      valB = b.caption ?? "";
    } else {
      valA = a.alt_text ?? "";
      valB = b.alt_text ?? "";
    }

    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function getSortIcon(sortableKey: SortKey) {
    if (sortKey !== sortableKey) return null;
    return sortDir === "asc"
      ? <ArrowUp className="size-3 ml-1 inline" />
      : <ArrowDown className="size-3 ml-1 inline" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                Seleccioná o arrastrá una imagen (JPG, PNG, WebP — máx. 5 MB)
              </DialogDescription>
            </DialogHeader>

            <form action={uploadAction} className="space-y-4">
              {uploadState.error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {uploadState.error}
                </div>
              )}

              <div
                ref={dropRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50",
                )}
              >
                <Upload className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {dragOver
                    ? "Solá la imagen aquí"
                    : "Arrastrá y soltá una imagen o hacé clic para seleccionar"}
                </p>
                <Input
                  ref={fileRef}
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={handleFileChange}
                  className="mt-3"
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

      {/* Stats bar */}
      {!loading && photos.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="size-4 text-muted-foreground" />
            <span className="font-medium">{photos.length}</span>
            <span className="text-muted-foreground">
              {photos.length === 1 ? "foto" : "fotos"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">~{formatBytes(storageUsed)}</span>
            <span className="text-xs text-muted-foreground">(estimado)</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Última actualización:{" "}
            {lastFetched
              ? lastFetched.toLocaleDateString("es-CR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </div>
        </div>
      )}

      {/* Photo grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Cargando fotos...</p>
        </div>
      ) : photos.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="size-8" />}
          title="No hay fotos todavía"
          description="Subí tu primera foto usando el botón de arriba"
        />
      ) : (
        <>
          {/* Sort controls */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Ordenar por:</span>
            <button
              type="button"
              onClick={() => toggleSort("created_at")}
              className={cn(
                "rounded px-2 py-1 transition-colors hover:text-foreground",
                sortKey === "created_at" && "font-medium text-foreground",
              )}
            >
              Fecha {getSortIcon("created_at")}
            </button>
            <button
              type="button"
              onClick={() => toggleSort("caption")}
              className={cn(
                "rounded px-2 py-1 transition-colors hover:text-foreground",
                sortKey === "caption" && "font-medium text-foreground",
              )}
            >
              Nombre {getSortIcon("caption")}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedPhotos.map((photo) => (
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
                        <p className="truncate text-sm font-medium">
                          {photo.caption}
                        </p>
                      )}
                      {photo.alt_text && !photo.caption && (
                        <p className="truncate text-xs text-muted-foreground">
                          {photo.alt_text}
                        </p>
                      )}
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {new Date(photo.created_at).toLocaleDateString("es-CR")}
                      </p>
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

                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                          <NextImage
                            src={photo.url}
                            alt={photo.alt_text ?? ""}
                            fill
                            className="object-cover"
                          />
                        </div>

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
        </>
      )}
    </div>
  );
}
