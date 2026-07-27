import { createClient } from "./server";

export const PHOTOS_BUCKET = "photos";
export const THUMBNAIL_PREFIX = "thumbnails";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export function isAllowedMimeType(mime: string): mime is AllowedMimeType {
  return ALLOWED_MIME_TYPES.includes(mime as AllowedMimeType);
}

export function getPublicUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${PHOTOS_BUCKET}/${path}`;
}

export async function uploadPhoto(file: File, userId: string) {
  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const filePath = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return {
    path: data.path,
    url: getPublicUrl(data.path),
  };
}

export async function deletePhoto(path: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
  if (error) throw error;
}
