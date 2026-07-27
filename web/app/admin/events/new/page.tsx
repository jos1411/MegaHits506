"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { ArrowLeft } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { createEventAction, type EventActionState } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewEventPage() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, action, pending] = useActionState<EventActionState, FormData>(
    createEventAction,
    { error: null, success: false },
  );

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setSuccess(true);
    }
  }, [state.success]);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview(null);
    }
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
        <h2 className="text-xl font-semibold">Evento creado</h2>
        <p className="text-muted-foreground">El evento se publicó correctamente.</p>
        <div className="flex gap-3">
          <Link
            href="/admin/events"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
          >
            Volver a eventos
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Crear otro
          </Link>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold tracking-tight">Nuevo evento</h1>
        <p className="text-muted-foreground">Completá los datos para crear un nuevo evento</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
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
                placeholder="Nombre del evento"
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ciudad, lugar, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descripción del evento"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Imagen de portada</Label>
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
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                JPG, PNG o WebP. Máx. 5 MB. Opcional.
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
                {pending ? "Creando..." : "Crear evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
