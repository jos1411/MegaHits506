"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Film, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import {
  addVideoAction,
  deleteVideoAction,
  updateVideoAction,
  type VideoActionState,
} from "@/actions/videos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Video } from "@/types/database";

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);

  const [addState, addAction, addPending] = useActionState<VideoActionState, FormData>(
    addVideoAction,
    { error: null, success: false },
  );

  const [updateState, updateAction, updatePending] = useActionState<VideoActionState, FormData>(
    updateVideoAction,
    { error: null, success: false },
  );

  const [deleteState, deleteAction, deletePending] = useActionState<VideoActionState, FormData>(
    deleteVideoAction,
    { error: null, success: false },
  );

  async function fetchVideos() {
    const supabase = createClient();
    const { data } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setVideos(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (addState.success) {
      setAddOpen(false);
      fetchVideos();
    }
  }, [addState.success]);

  useEffect(() => {
    if (updateState.success) {
      setEditingVideo(null);
      fetchVideos();
    }
  }, [updateState.success]);

  useEffect(() => {
    if (deleteState.success) {
      setDeleteTarget(null);
      fetchVideos();
    }
  }, [deleteState.success]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Videos</h1>
          <p className="text-muted-foreground">Administrá los videos de YouTube</p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 size-4" />
            Agregar video
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar video de YouTube</DialogTitle>
              <DialogDescription>
                Pegá la URL del video de YouTube que querés incluir
              </DialogDescription>
            </DialogHeader>

            <form action={addAction} className="space-y-4">
              {addState.error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {addState.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" placeholder="Título del video" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">URL de YouTube</Label>
                <Input
                  id="youtubeUrl"
                  name="youtubeUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  type="url"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descripción opcional"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={addPending}>
                  {addPending ? "Agregando..." : "Agregar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error messages */}
      {updateState.error && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {updateState.error}
        </div>
      )}
      {deleteState.error && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {deleteState.error}
        </div>
      )}

      {/* Video list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Cargando videos...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20">
          <Film className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">No hay videos todavía</p>
          <p className="text-xs text-muted-foreground">
            Agregá tu primer video usando el botón de arriba
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="group overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="flex-1 truncate text-sm font-semibold">{video.title}</h3>
                  <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setEditingVideo(video)}
                      aria-label="Editar video"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </Button>
                    <Dialog
                      open={deleteTarget?.id === video.id}
                      onOpenChange={(open) => {
                        if (!open) setDeleteTarget(null);
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleteTarget(video)}
                        aria-label="Eliminar video"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>¿Eliminar video?</DialogTitle>
                          <DialogDescription>
                            Esta acción no se puede deshacer. El video se eliminará de la galería.
                          </DialogDescription>
                        </DialogHeader>
                        <form action={deleteAction}>
                          <input type="hidden" name="id" value={video.id} />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setDeleteTarget(null)}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit" variant="destructive" disabled={deletePending}>
                              {deletePending ? "Eliminando..." : "Eliminar"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {video.description && (
                  <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
                    {video.description}
                  </p>
                )}
                <Badge variant="outline" className="text-[10px]">
                  YouTube
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog
        open={editingVideo !== null}
        onOpenChange={(open) => {
          if (!open) setEditingVideo(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar video</DialogTitle>
            <DialogDescription>Actualizá los datos del video</DialogDescription>
          </DialogHeader>

          {editingVideo && (
            <form action={updateAction} className="space-y-4">
              <input type="hidden" name="id" value={editingVideo.id} />

              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingVideo.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-youtubeUrl">URL de YouTube</Label>
                <Input
                  id="edit-youtubeUrl"
                  name="youtubeUrl"
                  defaultValue={editingVideo.youtube_url}
                  type="url"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingVideo.description ?? ""}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingVideo(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updatePending}>
                  {updatePending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
