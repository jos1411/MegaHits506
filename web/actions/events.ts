"use server";

import { revalidateEvents } from "./revalidate";

import { createClient } from "@/lib/supabase/server";
import { isAllowedMimeType, uploadPhoto } from "@/lib/supabase/storage";
import { eventSchema } from "@/lib/utils/validation";
import type { EventInsert } from "@/types/database";

export type EventActionState = {
  error: string | null;
  success: boolean;
};

export { type EventInsert };

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\sáéíóúñäëïöü]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createEventAction(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const eventDate = formData.get("eventDate") as string;
  const location = formData.get("location") as string | null;
  const coverFile = formData.get("coverImage") as File | null;

  const parsed = eventSchema.safeParse({ title, description, eventDate, location });
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Datos inválidos";
    return { error: firstError, success: false };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autorizado", success: false };
  }

  let coverImageUrl: string | null = null;

  if (coverFile && coverFile.size > 0) {
    if (!isAllowedMimeType(coverFile.type)) {
      return { error: "Solo se permiten imágenes (JPG, PNG, WebP)", success: false };
    }
    if (coverFile.size > 5 * 1024 * 1024) {
      return { error: "Archivo demasiado grande (máx. 5 MB)", success: false };
    }

    try {
      const { url } = await uploadPhoto(coverFile, user.id);
      coverImageUrl = url;
    } catch {
      return { error: "Error al subir la imagen de portada", success: false };
    }
  }

  const slug = generateSlug(parsed.data.title);

  const insertData: EventInsert = {
    title: parsed.data.title,
    slug,
    description: parsed.data.description || null,
    event_date: parsed.data.eventDate,
    location: parsed.data.location || null,
    cover_image_url: coverImageUrl,
  };

  const { error } = await supabase.from("events").insert(insertData);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidateEvents();
  return { error: null, success: true };
}

export async function updateEventAction(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const eventDate = formData.get("eventDate") as string;
  const location = formData.get("location") as string | null;
  const coverFile = formData.get("coverImage") as File | null;
  const currentCover = formData.get("currentCoverImage") as string | null;

  if (!id) {
    return { error: "Falta el ID del evento", success: false };
  }

  const parsed = eventSchema.safeParse({ title, description, eventDate, location });
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Datos inválidos";
    return { error: firstError, success: false };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autorizado", success: false };
  }

  let coverImageUrl: string | null = currentCover;

  if (coverFile && coverFile.size > 0) {
    if (!isAllowedMimeType(coverFile.type)) {
      return { error: "Solo se permiten imágenes (JPG, PNG, WebP)", success: false };
    }
    if (coverFile.size > 5 * 1024 * 1024) {
      return { error: "Archivo demasiado grande (máx. 5 MB)", success: false };
    }

    try {
      const { url } = await uploadPhoto(coverFile, user.id);
      coverImageUrl = url;
    } catch {
      return { error: "Error al subir la imagen de portada", success: false };
    }
  }

  const slug = generateSlug(parsed.data.title);

  const updateData: Partial<EventInsert> = {
    title: parsed.data.title,
    slug,
    description: parsed.data.description || null,
    event_date: parsed.data.eventDate,
    location: parsed.data.location || null,
    cover_image_url: coverImageUrl,
  };

  const { error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidateEvents();
  return { error: null, success: true };
}

export async function deleteEventAction(
  _prevState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const id = formData.get("id") as string;

  if (!id) {
    return { error: "Falta el ID del evento", success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidateEvents();
  return { error: null, success: true };
}
