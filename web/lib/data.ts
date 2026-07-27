// Mock data for public pages
// NOTE: Replace with Supabase queries when data is available

import type { Photo, Video, Event } from "@/types";

export const MOCK_PHOTOS: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=60",
    alt_text: "Boda elegante con decoración floral",
    caption: "Boda en San José - Ceremonia y recepción",
    created_at: "2026-06-15T00:00:00Z",
    updated_at: "2026-06-15T00:00:00Z",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=60",
    alt_text: "Concierto en vivo con luces",
    caption: "Fiesta empresarial - Noche de gala",
    created_at: "2026-05-20T00:00:00Z",
    updated_at: "2026-05-20T00:00:00Z",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=60",
    alt_text: "Fiesta de quinceañera",
    caption: "Quinceañera en Pérez Zeledón",
    created_at: "2026-04-10T00:00:00Z",
    updated_at: "2026-04-10T00:00:00Z",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=60",
    alt_text: "Equipo de sonido profesional",
    caption: "Montaje de sonido para evento masivo",
    created_at: "2026-03-08T00:00:00Z",
    updated_at: "2026-03-08T00:00:00Z",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=60",
    alt_text: "Fiesta con globos y decoración",
    caption: "Cumpleaños infantil temático",
    created_at: "2026-02-14T00:00:00Z",
    updated_at: "2026-02-14T00:00:00Z",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=60",
    alt_text: "Concierto al aire libre",
    caption: "Festival comunitario en San Isidro",
    created_at: "2026-01-25T00:00:00Z",
    updated_at: "2026-01-25T00:00:00Z",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=400&q=60",
    alt_text: "DJ en cabina",
    caption: "Noche de música electrónica",
    created_at: "2025-12-31T00:00:00Z",
    updated_at: "2025-12-31T00:00:00Z",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=60",
    alt_text: "Cena de gala empresarial",
    caption: "Cena anual empresa corporativa",
    created_at: "2025-11-15T00:00:00Z",
    updated_at: "2025-11-15T00:00:00Z",
  },
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_id: "dQw4w9WgXcQ",
    title: "Mega Hits 506 - Mejores momentos 2025",
    description: "Compilación de los mejores eventos del año",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "2",
    youtube_url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    youtube_id: "jNQXAC9IVRw",
    title: "Boda en Pérez Zeledón",
    description: "Animación y música en boda campestre",
    created_at: "2025-12-01T00:00:00Z",
    updated_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "3",
    youtube_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    youtube_id: "9bZkp7q19f0",
    title: "Fiesta de Quinceañera",
    description: "Una noche mágica en San Isidro",
    created_at: "2025-11-15T00:00:00Z",
    updated_at: "2025-11-15T00:00:00Z",
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    slug: "boda-marta-carlos",
    title: "Boda de Marta y Carlos",
    description:
      "Una hermosa ceremonia y recepción en el Jardín Botánico de San José. Animación musical durante toda la noche, con un repertorio que incluyó salsa, merengue, y música popular. Más de 200 invitados bailaron hasta el amanecer.",
    event_date: "2026-06-15T18:00:00Z",
    location: "Jardín Botánico, San José",
    cover_image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    created_at: "2026-06-01T00:00:00Z",
    updated_at: "2026-06-16T00:00:00Z",
  },
  {
    id: "2",
    slug: "fiesta-empresarial-techcorp",
    title: "Fiesta Empresarial TechCorp",
    description:
      "Celebración de aniversario de la empresa TechCorp en el Centro de Convenciones. Música en vivo, animación, y un espectáculo de luces que sorprendió a todos los asistentes.",
    event_date: "2026-05-20T19:00:00Z",
    location: "Centro de Convenciones, San José",
    cover_image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    created_at: "2026-05-05T00:00:00Z",
    updated_at: "2026-05-21T00:00:00Z",
  },
  {
    id: "3",
    slug: "quinceanera-valeria",
    title: "Quinceañera de Valeria",
    description:
      "Fiesta de quince años en el Salón de Eventos Don Pepe. Decoración temática, show de luces, y música personalizada para la quinceañera y sus invitados.",
    event_date: "2026-04-10T17:00:00Z",
    location: "Salón Don Pepe, Pérez Zeledón",
    cover_image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    created_at: "2026-03-25T00:00:00Z",
    updated_at: "2026-04-11T00:00:00Z",
  },
  {
    id: "4",
    slug: "festival-comunitario",
    title: "Festival Comunitario San Isidro",
    description:
      "Festival anual de la comunidad de San Isidro con música, baile, y actividades para toda la familia. Mega Hits 506 se encargó de la animación y el sonido durante todo el evento.",
    event_date: "2026-01-25T10:00:00Z",
    location: "Parque Central, San Isidro",
    cover_image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-26T00:00:00Z",
  },
  {
    id: "5",
    slug: "noche-electronica-2025",
    title: "Noche Electrónica 2025",
    description:
      "La mejor fiesta de electrónica del año en Pérez Zeledón. DJs invitados, show de luces láser, y ambiente inolvidable para despedir el año.",
    event_date: "2025-12-31T21:00:00Z",
    location: "Club Social, Pérez Zeledón",
    cover_image_url: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=600&q=80",
    created_at: "2025-12-10T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

// Helper to simulate async data fetching (for future Supabase replacement)
export async function getPhotos(): Promise<Photo[]> {
  return MOCK_PHOTOS;
}

export async function getVideos(): Promise<Video[]> {
  return MOCK_VIDEOS;
}

export async function getEvents(): Promise<Event[]> {
  return MOCK_EVENTS;
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  return MOCK_EVENTS.find((e) => e.slug === slug);
}
