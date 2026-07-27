import type { Metadata } from "next";

import { EventCard } from "@/components/events/event-card";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Conoce los eventos que hemos animado en Pérez Zeledón y sus alrededores. Bodas, quinceañeras, fiestas empresariales y más.",
  openGraph: {
    title: "Eventos | Mega Hits 506",
    description:
      "Conoce los eventos que hemos animado en Pérez Zeledón y sus alrededores.",
  },
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Eventos</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Hemos sido parte de los mejores eventos de la zona
        </p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">No hay eventos registrados</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events
            .sort(
              (a, b) =>
                new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
            )
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </div>
      )}
    </div>
  );
}
