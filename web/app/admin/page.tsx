import { CalendarDays, Calendar, Film, Image, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

async function getUpcomingEvents(supabase: Awaited<ReturnType<typeof createClient>>) {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", now)
    .order("event_date", { ascending: true })
    .limit(3);
  return data ?? [];
}

async function getRecentPhotosCount(supabase: Awaited<ReturnType<typeof createClient>>) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("photos")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);
  return count ?? 0;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: photoCount, error: photoErr },
    { count: videoCount, error: videoErr },
    { count: eventCount, error: eventErr },
    upcomingEvents,
    recentPhotos,
  ] = await Promise.all([
    supabase.from("photos").select("*", { count: "exact", head: true }),
    supabase.from("videos").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    getUpcomingEvents(supabase),
    getRecentPhotosCount(supabase),
  ]);

  const dashboardErrors: string[] = [];
  if (photoErr) dashboardErrors.push(`Fotos: ${photoErr.message}`);
  if (videoErr) dashboardErrors.push(`Videos: ${videoErr.message}`);
  if (eventErr) dashboardErrors.push(`Eventos: ${eventErr.message}`);

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

      {/* Error banner */}
      {dashboardErrors.length > 0 && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3">
          {dashboardErrors.map((msg, i) => (
            <p key={i} className="text-sm text-destructive">{msg}</p>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-all hover:bg-muted/50 hover:shadow-md">
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

      {/* Mini charts row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <CardTitle>Actividad reciente</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Fotos este mes</span>
                <span className="font-mono font-semibold">{recentPhotos}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (recentPhotos / Math.max((photoCount ?? 1), 1)) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {recentPhotos} de {photoCount ?? 0} fotos subidas en los últimos 30 días
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              <CardTitle>Próximos eventos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No hay eventos próximos programados
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/admin/events/${event.id}`}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString("es-CR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {event.location && (
                      <span className="ml-2 shrink-0 text-xs text-muted-foreground truncate max-w-[120px]">
                        {event.location}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
      <Card className="transition-all hover:bg-muted/50 hover:shadow-sm">
        <CardContent className="py-4">
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
