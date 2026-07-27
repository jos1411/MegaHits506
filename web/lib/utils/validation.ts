import { z } from "zod";

export const emailSchema = z.string().email("Correo electrónico inválido");

export const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const photoUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Solo se permiten imágenes (JPG, PNG, WebP)",
    )
    .refine((f) => f.size <= 5 * 1024 * 1024, "Archivo demasiado grande (máx. 5 MB)"),
  altText: z.string().max(200, "El texto alternativo es demasiado largo").optional(),
});

export const youtubeUrlSchema = z
  .string()
  .url("URL inválida")
  .refine(
    (url) => url.includes("youtube.com/watch") || url.includes("youtu.be/"),
    "URL de YouTube inválida",
  );

export const eventSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200),
  description: z.string().optional(),
  eventDate: z.string().min(1, "La fecha es requerida"),
  location: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});
