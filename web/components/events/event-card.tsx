import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Costa_Rica",
  });
}

export function EventCard({ event }: EventCardProps) {
  const isPast = new Date(event.event_date) < new Date();

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Calendar className="size-12 text-muted-foreground/40" />
          </div>
        )}
        <Badge
          variant={isPast ? "secondary" : "default"}
          className="absolute right-3 top-3"
        >
          {isPast ? "Realizado" : "Próximo"}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0" />
            <span>{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
