# Design: Migrate to Next.js + Supabase + Radio Online

## Technical Approach

Full rewrite from ASP.NET MVC 5 to Next.js 14 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui. Supabase handles PostgreSQL, admin Auth (email+password, 2 users max), and Storage (images). AzuraCast + Icecast on Hetzner CX22 VPS for radio streaming. Vercel hosts the frontend. No client login, no quotes module, no data migration from legacy DB.

Maps to proposal approach: scaffold Next.js → Supabase schema + Storage → VPS radio → Vercel deploy → CI/CD.

## Architecture Decisions

### Decision: App Router with Server Components by Default

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Pages Router | Simpler, but legacy pattern | **Rejected** — App Router is the future, better SEO, streaming |
| App Router (all client) | Easy state, but poor performance | **Rejected** — wastes server capabilities |
| App Router (server-first, client where needed) | Best perf + SEO, slightly more complexity | **Chosen** — server components for data fetching, client for interactivity |

**Rationale**: Server components reduce JS bundle, improve Lighthouse scores (≥80 target), and give free SEO. Client components only for lightbox, radio player, and admin forms.

### Decision: Supabase Auth (Admin-Only, No Registration)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Custom JWT auth | Full control, but security risk | **Rejected** — reinventing auth is dangerous |
| Supabase Auth with public registration | Easy, but exposes admin | **Rejected** — only 2 admin users |
| Supabase Auth, admin-created users only | Secure, manual user management | **Chosen** — create users via Supabase dashboard, no signup page |

**Rationale**: Only José + papá need access. Public registration is a security hole. Supabase dashboard handles user creation. Middleware enforces auth on `/admin/*`.

### Decision: Supabase Storage for Images (No S3/Cloudinary)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| S3 + CloudFront | Scalable, but complex + costly | **Rejected** — overkill for <500 images |
| Cloudinary | Auto-optimization, but $89/mo | **Rejected** — too expensive for solo dev |
| Supabase Storage + next/image | Integrated, free tier, WebP via next/image | **Chosen** — simple, cheap, good enough |

**Rationale**: Supabase free tier includes 1GB storage. next/image auto-converts to WebP, resizes, and caches. For a portfolio site, this is sufficient.

### Decision: AzuraCast API + Icecast Stream Embed (No Custom Backend)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Custom Node.js backend for radio | Full control, but maintenance burden | **Rejected** — AzuraCast already has API |
| AzuraCast API + Icecast direct stream | No backend needed, but relies on AzuraCast uptime | **Chosen** — simple, open-source, proven |
| Third-party radio service | Easy, but monthly cost + less control | **Rejected** — unnecessary for this use case |

**Rationale**: AzuraCast exposes REST API for now-playing metadata. Icecast provides the stream URL. Frontend fetches metadata client-side (polling every 10s) and embeds Icecast stream via `<audio>` element. No custom backend needed.

### Decision: Persistent Radio Player via Layout Component

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Radio player in each page | Simple, but stops on navigation | **Rejected** — breaks listening experience |
| Global audio context + provider | Persists, but complex state management | **Rejected** — over-engineered |
| Radio player in root layout (outside page) | Persists across navigations, simple | **Chosen** — layout wraps all pages, audio element survives route changes |

**Rationale**: Next.js App Router layouts persist across page navigations. Placing the radio player in `app/(public)/layout.tsx` (outside `page.tsx`) keeps it alive while content changes.

### Decision: Server Actions for Admin CMS (No API Routes)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| API routes + React Query | Flexible, but more code | **Rejected** — unnecessary for simple CRUD |
| Server Actions | Built-in, type-safe, no API layer | **Chosen** — direct DB mutations from forms, automatic revalidation |

**Rationale**: Server Actions are the Next.js way for form submissions. They run on the server, call Supabase SDK directly, and revalidate data automatically. No need for API routes or React Query for admin CMS.

### Decision: Tailwind CSS 4 + shadcn/ui (No Material UI/Ant Design)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Material UI | Complete, but heavy + opinionated | **Rejected** — too bulky for custom design |
| Tailwind + shadcn/ui | Lightweight, customizable, accessible | **Chosen** — Tailwind 4 is fast, shadcn gives pre-built accessible components |
| Custom CSS | Full control, but slow | **Rejected** — reinventing wheels |

**Rationale**: Tailwind 4 is utility-first, mobile-first, and has built-in dark mode. shadcn/ui provides accessible, unstyled components (dialog, dropdown, form) that integrate with Tailwind. Perfect for admin CMS and public UI.

### Decision: Vitest + Playwright (No Jest/Cypress)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Jest + Cypress | Mature, but slower + heavier | **Rejected** — Vitest is faster, Playwright is more reliable |
| Vitest + Playwright | Fast, modern, native ESM | **Chosen** — Vitest for unit/integration, Playwright for E2E |

**Rationale**: Vitest is 2-5x faster than Jest, native ESM, and works seamlessly with Vite/Next.js. Playwright is more stable than Cypress, supports multiple browsers, and has better debugging.

## Data Flow

### Public Page Load (e.g., Gallery)

```
Browser → Next.js Server Component → Supabase SDK → PostgreSQL
   ↓                                        ↓
HTML + JSON (no JS)              SELECT * FROM photos ORDER BY created_at DESC
   ↓
Browser hydrates client components (lightbox)
```

### Admin Photo Upload

```
Admin Form → Server Action → Supabase Storage → PostgreSQL
   ↓              ↓                ↓               ↓
FormData    upload image    store URL        insert row
   ↓              ↓                ↓               ↓
revalidatePath('/gallery') ← success response
```

### Radio Player Flow

```
Layout Mounts → <audio src="icecast-stream" />
   ↓
Client Component polls AzuraCast API every 10s
   ↓
GET /api/nowplaying → { artist, title }
   ↓
Update UI with track info
```

### Auth Flow (Admin Login)

```
/admin/login → POST email+password → Supabase Auth → set session cookie
   ↓
Middleware checks cookie on /admin/* → allow or redirect to /admin/login
   ↓
Authenticated → render admin dashboard
```

## File Structure

```
megahits506-web/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx              # Root layout with radio player
│   │   ├── page.tsx                # Landing page (server component)
│   │   ├── gallery/
│   │   │   ├── page.tsx            # Photo gallery (server component)
│   │   │   └── videos/
│   │   │       └── page.tsx        # Video gallery (server component)
│   │   ├── events/
│   │   │   ├── page.tsx            # Events list (server component)
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Event detail (server component)
│   │   ├── contact/
│   │   │   └── page.tsx            # Contact page (static)
│   │   └── radio/
│   │       └── page.tsx            # Radio page (client component for player)
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout with sidebar
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx            # Login page (client component)
│   │   ├── gallery/
│   │   │   ├── page.tsx            # Photo management
│   │   │   └── upload/
│   │   │       └── page.tsx        # Upload form
│   │   ├── videos/
│   │   │   └── page.tsx            # Video management
│   │   └── events/
│   │       ├── page.tsx            # Events management
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx    # Edit event
│   ├── api/
│   │   └── radio/
│   │       └── nowplaying/
│   │           └── route.ts        # Proxy AzuraCast API (CORS)
│   ├── layout.tsx                  # Root layout (html, body, fonts)
│   ├── not-found.tsx               # 404 page
│   └── globals.css                 # Tailwind imports
├── components/
│   ├── ui/                         # shadcn/ui components (dialog, button, etc.)
│   ├── layout/
│   │   ├── header.tsx              # Public header
│   │   ├── footer.tsx              # Public footer
│   │   ├── sidebar.tsx             # Admin sidebar
│   │   └── radio-player.tsx        # Persistent radio player (client)
│   ├── gallery/
│   │   ├── photo-grid.tsx          # Photo grid (server)
│   │   ├── photo-lightbox.tsx      # Lightbox (client)
│   │   └── video-card.tsx          # YouTube embed (server)
│   ├── events/
│   │   ├── event-list.tsx          # Event list (server)
│   │   └── event-card.tsx          # Event card (server)
│   ├── contact/
│   │   └── whatsapp-button.tsx     # WhatsApp CTA (client)
│   └── admin/
│       ├── photo-upload-form.tsx   # Upload form (client)
│       ├── event-form.tsx          # Event form (client)
│       └── delete-confirm.tsx      # Delete confirmation (client)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client
│   │   └── middleware.ts           # Auth middleware helper
│   ├── utils/
│   │   ├── cn.ts                   # Tailwind class merge utility
│   │   ├── date.ts                 # Date formatting (Costa Rica timezone)
│   │   └── validation.ts           # Zod schemas
│   └── constants.ts                # WhatsApp number, AzuraCast URL, etc.
├── types/
│   ├── database.ts                 # Supabase generated types
│   ├── gallery.ts                  # Photo, Video types
│   ├── events.ts                   # Event types
│   └── radio.ts                    # NowPlaying types
├── actions/
│   ├── gallery.ts                  # Server actions for photos/videos
│   ├── events.ts                   # Server actions for events
│   └── auth.ts                     # Server actions for login/logout
├── middleware.ts                   # Auth middleware for /admin/*
├── next.config.ts                  # Next.js config (image domains, etc.)
├── tailwind.config.ts              # Tailwind config (dark mode, theme)
├── tsconfig.json                   # TypeScript config (strict)
├── vitest.config.ts                # Vitest config
├── playwright.config.ts            # Playwright config
├── package.json
└── README.md
```

## Database Schema (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event photos (many-to-many)
CREATE TABLE event_photos (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, photo_id)
);

-- Indexes
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_events_event_date ON events(event_date DESC);
CREATE INDEX idx_events_slug ON events(slug);

-- RLS Policies
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON photos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON videos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON event_photos FOR SELECT USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Admin insert access" ON photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON photos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON videos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON videos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update access" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON event_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin delete access" ON event_photos FOR DELETE USING (auth.role() = 'authenticated');
```

## TypeScript Data Models

```typescript
// types/database.ts (auto-generated by Supabase CLI)
export type Database = {
  public: {
    Tables: {
      photos: {
        Row: {
          id: string;
          url: string;
          thumbnail_url: string | null;
          alt_text: string | null;
          caption: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['photos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['photos']['Insert']>;
      };
      videos: {
        Row: {
          id: string;
          youtube_url: string;
          youtube_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['videos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['videos']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          event_date: string;
          location: string | null;
          cover_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      event_photos: {
        Row: {
          event_id: string;
          photo_id: string;
        };
        Insert: Database['public']['Tables']['event_photos']['Row'];
        Update: never;
      };
    };
  };
};

// types/gallery.ts
export type Photo = Database['public']['Tables']['photos']['Row'];
export type PhotoInsert = Database['public']['Tables']['photos']['Insert'];
export type Video = Database['public']['Tables']['videos']['Row'];
export type VideoInsert = Database['public']['Tables']['videos']['Insert'];

// types/events.ts
export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventWithPhotos = Event & { photos: Photo[] };

// types/radio.ts
export interface NowPlaying {
  artist: string;
  title: string;
  album: string | null;
  art: string | null;
}

export interface RadioStatus {
  online: boolean;
  listeners: number;
  nowPlaying: NowPlaying | null;
}
```

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── html, body, fonts
└── PublicLayout (app/(public)/layout.tsx)
    ├── Header
    ├── RadioPlayer (persistent, client component)
    ├── {children} (pages)
    ├── WhatsAppFloatingButton (client)
    └── Footer

AdminLayout (app/admin/layout.tsx)
├── Sidebar (navigation)
├── Header (user info, logout)
└── {children} (admin pages)

Page Components:
- LandingPage: Hero, Services, MissionVision, Timeline (all server)
- GalleryPage: PhotoGrid (server) → PhotoLightbox (client, on click)
- VideoGalleryPage: VideoCard[] (server)
- EventsListPage: EventList (server) → EventCard[] (server)
- EventDetailPage: EventInfo + PhotoGrid (server)
- ContactPage: static content + WhatsAppButton (client)
- RadioPage: full player UI (client)

Admin Components:
- Dashboard: stats cards, quick links (server)
- PhotoManagement: PhotoGrid + DeleteButton (server + client)
- PhotoUploadForm: file input, preview, submit (client)
- EventManagement: EventTable + Edit/Delete buttons (server + client)
- EventForm: form fields, validation, submit (client)
```

## Routes and Navigation

### Public Routes (no auth)
- `/` — Landing page
- `/gallery` — Photo gallery
- `/gallery/videos` — Video gallery
- `/events` — Events list
- `/events/[slug]` — Event detail
- `/contact` — Contact page
- `/radio` — Radio player page

### Admin Routes (auth required)
- `/admin/login` — Login page (public)
- `/admin` — Dashboard (protected)
- `/admin/gallery` — Photo management (protected)
- `/admin/gallery/upload` — Upload form (protected)
- `/admin/videos` — Video management (protected)
- `/admin/events` — Events management (protected)
- `/admin/events/[id]/edit` — Edit event (protected)

### API Routes
- `/api/radio/nowplaying` — Proxy AzuraCast API (avoids CORS)

### Middleware

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) { response.cookies.set({ name, value, ...options }); },
        remove(name, options) { response.cookies.set({ name, value: '', ...options }); },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin/* routes (except /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login' && 
      !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

## Authentication Flow

### Login Sequence

```
1. User navigates to /admin/login
2. Enters email + password
3. Form submits to Server Action (actions/auth.ts)
4. Server Action calls supabase.auth.signInWithPassword()
5. Supabase validates, returns session
6. Server Action sets session cookie via supabase.ssр.createServerClient()
7. Redirect to /admin
8. Middleware checks cookie on subsequent /admin/* requests
9. If valid → allow access; if invalid/missing → redirect to /admin/login
```

### Session Management

- Supabase stores session in HTTP-only, secure, same-site cookies
- Session persists across page navigations and browser refreshes
- Session expires after 1 hour (configurable in Supabase dashboard)
- Refresh token extends session automatically
- Logout clears session cookie via Server Action

### Rate Limiting

- Supabase Auth has built-in rate limiting (5 failed attempts per 15 minutes per IP)
- No custom rate limiting needed
- Failed login shows generic "Credenciales inválidas" (no user enumeration)

## Image Strategy

### Upload Flow

```
1. Admin uploads image via form (max 5MB, JPG/PNG/WebP)
2. Server Action receives FormData
3. Validate file size + type (Zod schema)
4. Upload to Supabase Storage bucket 'photos'
5. Generate thumbnail (sharp library, 400x300 WebP)
6. Upload thumbnail to 'photos/thumbnails/'
7. Insert row into photos table (url + thumbnail_url)
8. revalidatePath('/gallery')
```

### Display Strategy

- Use `next/image` for all images (automatic WebP conversion, lazy loading, responsive sizes)
- Serve thumbnails in grids, full-size in lightbox
- Responsive sizes: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Blur placeholder for above-fold images (hero, first gallery row)

### Optimization

- Supabase Storage does not auto-optimize, but next/image does on-the-fly
- Cache resized images via next/image cache (Vercel automatic)
- Set `maximumFileSizeToCacheInBytes` to 10MB in next.config.ts
- Allowed domains: Supabase Storage URL

## Radio Integration

### Architecture

```
AzuraCast (VPS) → Icecast (VPS) → Stream URL (public)
     ↓
AzuraCast API → /api/nowplaying (Next.js proxy) → Frontend polls
```

### Stream Embed

```typescript
// components/layout/radio-player.tsx
'use client';

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const STREAM_URL = process.env.NEXT_PUBLIC_ICECAST_STREAM_URL;

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
      <audio ref={audioRef} src={STREAM_URL} />
      <button onClick={() => audioRef.current?.play()}>Play</button>
      <button onClick={() => audioRef.current?.pause()}>Pause</button>
      <NowPlayingInfo />
      <VolumeSlider audioRef={audioRef} />
    </div>
  );
}
```

### Now Playing Metadata

```typescript
// Poll AzuraCast API every 10 seconds
async function fetchNowPlaying(): Promise<NowPlaying> {
  const res = await fetch('/api/radio/nowplaying');
  const data = await res.json();
  return {
    artist: data.now_playing.song.artist,
    title: data.now_playing.song.title,
    album: data.now_playing.song.album,
    art: data.now_playing.song.art,
  };
}

// In component
useEffect(() => {
  const interval = setInterval(fetchNowPlaying, 10000);
  return () => clearInterval(interval);
}, []);
```

### API Proxy (CORS)

```typescript
// app/api/radio/nowplaying/route.ts
export async function GET() {
  const res = await fetch(`${AZURACAST_URL}/api/nowplaying/1`, {
    next: { revalidate: 10 }, // Cache 10s
  });
  const data = await res.json();
  return Response.json(data);
}
```

## State Management Strategy

### Server Components (default)

- Landing page, gallery, events, contact — all server components
- Fetch data directly from Supabase in the component
- No client-side state needed

### Client Components (where needed)

- **Radio player**: persistent state (play/pause, volume, now playing)
- **Lightbox**: open/close state, current photo index
- **Admin forms**: form state, validation, submission
- **Delete confirmations**: modal open/close

### No React Query / SWR

- Server components fetch data on every request (fast with Supabase edge functions)
- Admin CMS uses Server Actions + `revalidatePath()` for instant updates
- No need for client-side caching or refetching

### State Summary

| Component | State Type | Location |
|-----------|-----------|----------|
| Gallery data | Server | Supabase → Server Component |
| Lightbox | Client | React useState |
| Radio player | Client | React useState + useRef |
| Admin forms | Client | React Hook Form + Zod |
| Auth session | Server | Supabase cookie |

## SEO Strategy

### Metadata (per page)

```typescript
// app/(public)/gallery/page.tsx
export const metadata = {
  title: 'Galería de Fotos | Mega Hits 506',
  description: 'Explora nuestra galería de fotos de eventos, bodas, quinceañeras y más en Pérez Zeledón.',
  openGraph: {
    title: 'Galería de Fotos | Mega Hits 506',
    description: 'Explora nuestra galería de fotos de eventos, bodas, quinceañeras y más en Pérez Zeledón.',
    images: ['/og-gallery.jpg'],
  },
};
```

### Sitemap

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const events = await getEvents();
  const eventRoutes = events.map((event) => ({
    url: `https://megahits506.com/events/${event.slug}`,
    lastModified: event.updated_at,
  }));

  return [
    { url: 'https://megahits506.com', lastModified: new Date() },
    { url: 'https://megahits506.com/gallery', lastModified: new Date() },
    { url: 'https://megahits506.com/events', lastModified: new Date() },
    { url: 'https://megahits506.com/contact', lastModified: new Date() },
    { url: 'https://megahits506.com/radio', lastModified: new Date() },
    ...eventRoutes,
  ];
}
```

### Structured Data (JSON-LD)

```typescript
// app/(public)/layout.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Mega Hits 506',
  description: 'Discomóvil y animación de eventos en Pérez Zeledón',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pérez Zeledón',
    addressCountry: 'CR',
  },
  telephone: '+506XXXXXXXX',
  url: 'https://megahits506.com',
};
```

### robots.txt

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://megahits506.com/sitemap.xml',
  };
}
```

## Key Component Designs

### Photo Lightbox

```typescript
// components/gallery/photo-lightbox.tsx
'use client';

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Keyboard navigation (arrows, escape)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % photos.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [photos.length, onClose]);

  // Touch swipe (mobile)
  // ... touch event handlers

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4">✕</button>
      <button onClick={() => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length)}>‹</button>
      <Image src={photos[currentIndex].url} alt={photos[currentIndex].alt_text} fill />
      <button onClick={() => setCurrentIndex((i) => (i + 1) % photos.length)}>›</button>
      <div className="absolute bottom-4 text-white">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}
```

### Radio Player (Persistent)

```typescript
// components/layout/radio-player.tsx
'use client';

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch now playing every 10s
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/radio/nowplaying');
        const data = await res.json();
        setNowPlaying({
          artist: data.now_playing.song.artist,
          title: data.now_playing.song.title,
          album: data.now_playing.song.album,
          art: data.now_playing.song.art,
        });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg max-w-xs">
      <audio ref={audioRef} src={process.env.NEXT_PUBLIC_ICECAST_STREAM_URL} />
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (isPlaying) {
              audioRef.current?.pause();
              setIsPlaying(false);
            } else {
              audioRef.current?.play();
              setIsPlaying(true);
            }
          }}
          disabled={!isOnline}
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="flex-1">
          <div className="text-sm font-bold">
            {isOnline ? nowPlaying?.title || 'En vivo' : 'Fuera de línea'}
          </div>
          <div className="text-xs opacity-70">
            {isOnline ? nowPlaying?.artist || 'Mega Hits 506' : ''}
          </div>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-full mt-2"
      />
    </div>
  );
}
```

### Admin Layout

```typescript
// app/admin/layout.tsx
import { Sidebar } from '@/components/layout/sidebar';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
              Cerrar sesión
            </button>
          </form>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

## Security Policies

### Content Security Policy (CSP)

```typescript
// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.supabase.co https://img.youtube.com;
  font-src 'self';
  connect-src 'self' https://*.supabase.co https://azuracast.megahits506.com;
  media-src 'self' https://azuracast.megahits506.com;
  frame-src https://www.youtube.com;
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
```

### Supabase RLS (Row Level Security)

- All tables have RLS enabled
- Public read access (anyone can view photos, videos, events)
- Admin write access (only authenticated users can insert/update/delete)
- No client login → no complex permission levels

### Rate Limiting

- Supabase Auth: 5 failed login attempts per 15 minutes (built-in)
- API routes: Vercel automatic rate limiting (100 req/10s per IP)
- No custom rate limiting needed

### Middleware Security

- Auth middleware protects all `/admin/*` routes (except `/admin/login`)
- Session cookies are HTTP-only, secure, same-site=lax
- No sensitive data in client-side cookies

### File Upload Security

- Validate file type (JPG, PNG, WebP only) via MIME type + extension
- Validate file size (max 5MB)
- Sanitize filename (remove special chars, generate UUID)
- Store in Supabase Storage with public read access
- No executable files allowed

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. This is a web application with standard HTTP requests, database queries, and file uploads.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Utility functions (date formatting, validation), component logic | Vitest + React Testing Library |
| Integration | Server Actions (auth, CRUD), Supabase queries | Vitest + Supabase local instance |
| E2E | Full user flows (login, upload photo, create event, play radio) | Playwright |

### Test Coverage Targets

- **Auth flow**: login, logout, protected routes, session persistence
- **Admin CMS**: photo upload, video CRUD, event CRUD, validation errors
- **Public pages**: gallery lightbox navigation, event detail, radio player
- **Responsive**: mobile viewports (375px, 768px)
- **Accessibility**: keyboard navigation, screen reader support

### Example E2E Test

```typescript
// e2e/admin-gallery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Gallery', () => {
  test('upload photo and verify in public gallery', async ({ page }) => {
    // Login
    await page.goto('/admin/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');

    // Upload photo
    await page.goto('/admin/gallery/upload');
    await page.setInputFiles('input[type="file"]', 'test-photo.jpg');
    await page.fill('[name="alt_text"]', 'Test photo');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Photo uploaded')).toBeVisible();

    // Verify in public gallery
    await page.goto('/gallery');
    await expect(page.locator('img[alt="Test photo"]')).toBeVisible();
  });
});
```

## Migration / Rollout

No migration required. This is a full rewrite from scratch. Legacy ASP.NET remains untouched and deployable at any time. DNS cutover happens only after Vercel deploy is verified.

### Rollout Plan

1. **Phase 1**: Scaffold Next.js + Supabase + basic pages (landing, gallery, events, contact)
2. **Phase 2**: Admin auth + CMS (login, photo upload, event management)
3. **Phase 3**: Radio integration (AzuraCast + Icecast on VPS, player component)
4. **Phase 4**: Polish (SEO, responsive, accessibility, testing)
5. **Phase 5**: Deploy to Vercel + DNS cutover

## Open Questions

- [ ] AzuraCast API authentication: does the public `/api/nowplaying` endpoint require an API key?
- [ ] Supabase Storage bucket permissions: should thumbnails be in a separate bucket?
- [ ] Image optimization: use sharp (server-side) or rely on next/image (Vercel edge)?
- [ ] Radio stream fallback: what if Icecast goes down? Show offline message or hide player?
