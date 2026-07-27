import { redirect } from "next/navigation";

import { AdminShell } from "./admin-shell";

import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  // Middleware handles redirect already, but double-check in case middleware is bypassed
  if (!data.user) {
    redirect("/admin/login");
  }

  return <AdminShell userEmail={data.user.email ?? "Admin"}>{children}</AdminShell>;
}
