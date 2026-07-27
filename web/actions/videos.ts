"use server";

import { revalidateGallery } from "./revalidate";

import { createClient } from "@/lib/supabase/server";
import { youtubeUrlSchema } from "@/lib/utils/validation";
import type { VideoInsert } from "@/types/database";

export type VideoActionState = {
  error: string | null;
  success: boolean;
};

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

export async function addVideoAction(
  _prevState: VideoActionState,
  formData: FormData,
): Promise<VideoActionState> {
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  const parsedUrl = youtubeUrlSchema.safeParse(youtubeUrl);
  if (!parsedUrl.success) {
    return { error: "URL de YouTube inválida", success: false };
  }

  const youtubeId = extractYoutubeId(parsedUrl.data);
  if (!youtubeId) {
    return { error: "No se pudo extraer el ID del video", success: false };
  }

  if (!title || title.trim().length === 0) {
    return { error: "El título es requerido", success: false };
  }

  const supabase = await createClient();

  const insertData: VideoInsert = {
    youtube_url: parsedUrl.data,
    youtube_id: youtubeId,
    title: title.trim(),
    description: description || null,
  };

  const { error } = await supabase.from("videos").insert(insertData);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidateGallery();
  return { error: null, success: true };
}

export async function updateVideoAction(
  _prevState: VideoActionState,
  formData: FormData,
): Promise<VideoActionState> {
  const id = formData.get("id") as string;
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  if (!id) {
    return { error: "Falta el ID del video", success: false };
  }

  const parsedUrl = youtubeUrlSchema.safeParse(youtubeUrl);
  if (!parsedUrl.success) {
    return { error: "URL de YouTube inválida", success: false };
  }

  const youtubeId = extractYoutubeId(parsedUrl.data);
  if (!youtubeId) {
    return { error: "No se pudo extraer el ID del video", success: false };
  }

  if (!title || title.trim().length === 0) {
    return { error: "El título es requerido", success: false };
  }

  const supabase = await createClient();

  const updateData: Partial<VideoInsert> = {
    youtube_url: parsedUrl.data,
    youtube_id: youtubeId,
    title: title.trim(),
    description: description || null,
  };

  const { error } = await supabase
    .from("videos")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidateGallery();
  return { error: null, success: true };
}

export async function deleteVideoAction(
  _prevState: VideoActionState,
  formData: FormData,
): Promise<VideoActionState> {
  const id = formData.get("id") as string;

  if (!id) {
    return { error: "Falta el ID del video", success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("videos").delete().eq("id", id);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidateGallery();
  return { error: null, success: true };
}
