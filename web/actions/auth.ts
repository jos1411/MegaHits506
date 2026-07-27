"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/utils/validation";

export type AuthActionState = {
  error: string | null;
  success: boolean;
};

export async function signIn(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Datos inválidos";
    return { error: firstError, success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    const message =
      error.message === "Invalid login credentials"
        ? "Correo o contraseña incorrectos"
        : error.message;
    return { error: message, success: false };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin/login");
  redirect("/admin/login");
}
