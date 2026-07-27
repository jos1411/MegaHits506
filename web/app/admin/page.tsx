import { Calendar, Film, Image } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: photoCount }, { count: videoCount }, { count: eventCount }] =
    await Promise.all([
      supabase.from("photos").select("*", { count: "exact", head: true }),
      supabase.from("videos").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    {
      label: "Fotos",
      count: photoCount ?? 0,
      icon: Image,
      href: "/admin/photos",
      color: "text-fuchsia-600 dark:text-fuchsia-400",
      bg: "bg-fuchsia-100 dark:bg-fuchsia-950/50",
    },
    {
      label: "Videos",
      count: videoCount ?? 0,
      icon: Film,
      href: "/admin/videos",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-950/50",
    },
    {
      label: "Eventos",
      count: eventCount ?? 0,
      icon: Calendar,
      href: "/admin/events",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-950/50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Panel de administración de contenidos
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{stat.label}</CardTitle>
                    <div className={`rounded-lg p-2 ${stat.bg}`}>
                      <Icon className={`size-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.count}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.count === 1 ? "elemento" : "elementos"} en total
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Accesos rápidos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            href="/admin/photos"
            label="Subir fotos"
            description="Agregar imágenes a la galería"
          />
          <QuickLink
            href="/admin/videos"
            label="Agregar videos"
            description="Vincular videos de YouTube"
          />
          <QuickLink
            href="/admin/events/new"
            label="Crear evento"
            description="Publicar un nuevo evento"
          />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="py-4">
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
