import { Calendar, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { WHATSAPP_URL } from "@/lib/constants";
import { getEventBySlug, getEvents } from "@/lib/data";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Costa_Rica",
  });
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return {};

  return {
    title: event.title,
    description: event.description?.slice(0, 160) ?? `${event.title} en ${event.location}`,
    openGraph: {
      title: `${event.title} | Mega Hits 506`,
      description: event.description?.slice(0, 160) ?? "",
      images: event.cover_image_url ? [{ url: event.cover_image_url }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Cover image */}
      {event.cover_image_url && (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-xl">
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Title & meta */}
      <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>

      <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          <time dateTime={event.event_date}>{formatDate(event.event_date)}</time>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>{event.location}</span>
          </div>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Description */}
      {event.description && (
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="leading-relaxed text-muted-foreground">{event.description}</p>
        </div>
      )}

      {/* CTA */}
      <div className="rounded-xl border bg-muted/30 p-6 text-center">
        <p className="mb-4 text-lg font-medium">
          ¿Quieres que animemos tu próximo evento?
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#25D366] px-8 text-sm font-medium text-white transition-all hover:bg-[#1da851] active:translate-y-px"
        >
          Contáctanos por WhatsApp
        </a>
      </div>
    </article>
  );
}
