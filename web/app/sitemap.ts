import type { MetadataRoute } from "next";

import { getEvents } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEvents();

  const eventRoutes = events.map((event) => ({
    url: `https://megahits506.com/events/${event.slug}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: "https://megahits506.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://megahits506.com/gallery",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://megahits506.com/events",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://megahits506.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...eventRoutes,
  ];
}
