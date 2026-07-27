import { Calendar, Plus } from "lucide-react";
import Link from "next/link";

import { DeleteEventButton } from "./delete-event-button";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime, isPastDate } from "@/lib/utils/date";


export default async function EventsListPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">Administrá los eventos publicados</p>
        </div>

        <Link
          href="/admin/events/new"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 size-4" />
          Nuevo evento
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20">
          <Calendar className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">No hay eventos todavía</p>
          <p className="text-xs text-muted-foreground">
            Creá tu primer evento usando el botón de arriba
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const past = isPastDate(event.event_date);

            return (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="truncate">{event.title}</CardTitle>
                        {past ? (
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Pasado
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            Próximo
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatDateTime(event.event_date)}
                        {event.location && ` · ${event.location}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Editar
                      </Link>
                      <DeleteEventButton eventId={event.id} />
                    </div>
                  </div>
                </CardHeader>
                {event.description && (
                  <CardContent className="pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
