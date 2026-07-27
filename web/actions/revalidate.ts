"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Revalidate a specific path and redirect to a destination.
 * Use this as the return value from Server Actions.
 */
export async function revalidateAndRedirect(path: string, destination: string) {
  revalidatePath(path);
  redirect(destination);
}

/**
 * Revalidate multiple paths at once.
 */
export async function revalidatePaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

/**
 * Revalidate the gallery and related paths after a photo/video mutation.
 */
export async function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/gallery/videos");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/videos");
}

/**
 * Revalidate the events paths after an event mutation.
 */
export async function revalidateEvents() {
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
