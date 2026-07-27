"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { ArrowLeft } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { updateEventAction, type EventActionState } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils/date";
import type { Event } from "@/types/database";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverChanged, setCoverChanged] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, action, pending] = useActionState<EventActionState, FormData>(
    updateEventAction,
    { error: null, success: false },
  );

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      const supabase = createClient();
      const { data } = await supabase.from("events").select("*").eq("id", id).single();

      if (data) {
        setEvent(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    load();
  }, [params]);

  useEffect(() => {
    if (state.success) {
      setSuccess(true);
    }
  }, [state.success]);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setCoverChanged(true);
    } else {
      setCoverPreview(null);
      setCoverChanged(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Cargando evento...</p>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-xl font-semibold">Evento no encontrado</h2>
        <p className="text-muted-foreground">El evento que buscás no existe.</p>
        <Link
          href="/admin/events"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
        >
          Volver a eventos
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="rounded-full bg-primary/10 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Evento actualizado</h2>
        <p className="text-muted-foreground">Los cambios se guardaron correctamente.</p>
        <div className="flex gap-3">
          <Link
            href="/admin/events"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
          >
            Volver a eventos
          </Link>
        </div>
      </div>
    );
  }

  // Format date for datetime-local input
  const formattedDate = event.event_date
    ? new Date(event.event_date).toISOString().slice(0, 16)
    : "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a eventos
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Editar evento</h1>
        <p className="text-muted-foreground">
          {event.title} · Creado {formatDate(event.created_at)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <input type="hidden" name="id" value={event.id} />
            <input type="hidden" name="currentCoverImage" value={event.cover_image_url ?? ""} />

            {state.error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={event.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">
                Fecha del evento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="datetime-local"
                defaultValue={formattedDate}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                defaultValue={event.location ?? ""}
                placeholder="Ciudad, lugar, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={event.description ?? ""}
                placeholder="Descripción del evento"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Imagen de portada</Label>

              {/* Current cover */}
              {event.cover_image_url && !coverChanged && (
                <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-lg border">
                  <NextImage
                    src={event.cover_image_url}
                    alt="Cover actual"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute right-2 bottom-2 rounded bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
                    Portada actual
                  </div>
                </div>
              )}

              <Input
                ref={fileRef}
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
              />

              {coverPreview && (
                <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg border">
                  <NextImage
                    src={coverPreview}
                    alt="Nueva portada"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute right-2 bottom-2 rounded bg-background/80 px-2 py-1 text-[10px] text-muted-foreground">
                    Nueva portada
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                JPG, PNG o WebP. Máx. 5 MB. Dejá vacío para mantener la portada actual.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/admin/events"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
              >
                Cancelar
              </Link>
              <Button type="submit" disabled={pending}>
                {pending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
