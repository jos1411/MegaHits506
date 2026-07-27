"use server";

import { revalidateGallery } from "./revalidate";

import { createClient } from "@/lib/supabase/server";
import { deletePhoto, isAllowedMimeType, uploadPhoto } from "@/lib/supabase/storage";
import { photoUploadSchema } from "@/lib/utils/validation";
import type { PhotoInsert } from "@/types/database";

export type PhotoActionState = {
  error: string | null;
  success: boolean;
};

export async function uploadPhotoAction(
  _prevState: PhotoActionState,
  formData: FormData,
): Promise<PhotoActionState> {
  const file = formData.get("file") as File | null;
  const altText = formData.get("altText") as string | null;
  const caption = formData.get("caption") as string | null;

  if (!file) {
    return { error: "Debes seleccionar un archivo", success: false };
  }

  const parsed = photoUploadSchema.safeParse({ file, altText: altText ?? undefined });
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Archivo inválido";
    return { error: firstError, success: false };
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autorizado", success: false };
  }

  try {
    if (!isAllowedMimeType(file.type)) {
      return { error: "Solo se permiten imágenes (JPG, PNG, WebP)", success: false };
    }

    const { url } = await uploadPhoto(file, user.id);

    const insertData: PhotoInsert = {
      url,
      thumbnail_url: url,
      alt_text: altText || null,
      caption: caption || null,
    };

    const { error: dbError } = await supabase.from("photos").insert(insertData);

    if (dbError) {
      return { error: dbError.message, success: false };
    }

    revalidateGallery();
    return { error: null, success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al subir la foto", success: false };
  }
}

export async function deletePhotoAction(
  _prevState: PhotoActionState,
  formData: FormData,
): Promise<PhotoActionState> {
  const id = formData.get("id") as string;
  const url = formData.get("url") as string;

  if (!id || !url) {
    return { error: "Faltan datos", success: false };
  }

  const supabase = await createClient();

  try {
    // Extract path from URL to delete from storage
    const storagePath = url.split("/photos/")[1];
    if (storagePath) {
      await deletePhoto(decodeURIComponent(storagePath));
    }

    const { error: dbError } = await supabase.from("photos").delete().eq("id", id);

    if (dbError) {
      return { error: dbError.message, success: false };
    }

    revalidateGallery();
    return { error: null, success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al eliminar la foto", success: false };
  }
}
