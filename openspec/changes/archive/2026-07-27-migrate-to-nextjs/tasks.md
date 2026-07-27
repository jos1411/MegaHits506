# Tasks: Migrate to Next.js + Supabase + Radio Online

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2,750 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 4 stacked → main |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | PR | Focused test | Runtime | Rollback |
|------|------|----|-------------|---------|----------|
| 1 | Foundation + Supabase | PR1 | `vitest run lib/` | N/A — lib only | `git revert` |
| 2 | Public pages + SEO | PR2 | `pw test e2e/public/` | `npm run dev` | Revert PR2 |
| 3 | Admin auth + CMS | PR3 | `pw test e2e/admin/` | `npm run dev` | Revert PR3 |
| 4 | Radio + E2E + polish | PR4 | `pw test e2e/radio/` | `npm run dev` | Revert PR4 |

## Phase 1: Foundation + Supabase (PR 1)

- [x] **1.1** Init Next.js 14 + TS + Tailwind 4 + shadcn/ui configs (~120 lines)
- [x] **1.2** ESLint, Vitest, Playwright configs + GH Actions CI (~120)
- [x] **1.3** Shared libs: cn(), constants, date utils, Zod schemas (~65)
- [x] **1.4** Root layout, globals.css, not-found.tsx (~40)
- [x] **1.5** SQL migration: photos, videos, events, event_photos, indexes, RLS (~80)
- [x] **1.6** Supabase types + server/client helpers (~160)
- [x] **1.7** Supabase Storage `photos` bucket + public read RLS (~10)
- [x] **1.8** Server Actions: auth (login/logout), gallery (upload/delete), events (CRUD) (~100)

## Phase 2: Frontend Público (PR 2)

- [x] **2.1** Public layout: Header, Footer, WhatsApp floating button (~180)
- [x] **2.2** Landing page: Hero, Servicios, Misión/Visión, Trayectoria (~200)
- [x] **2.3** Photo gallery grid + lightbox (keyboard/touch nav) (~140)
- [x] **2.4** Video gallery: YouTube embed cards (~40)
- [x] **2.5** Events list + [slug] detail (CR timezone dates) (~105)
- [x] **2.6** Contact page: static info + WhatsApp deep-link (~50)
- [x] **2.7** SEO: per-page metadata, sitemap.ts, robots.ts, JSON-LD (~80)

## Phase 3: Admin Auth + CMS (PR 3)

- [x] **3.1** Auth middleware: protect /admin/*, redirect to login (~50)
- [x] **3.2** Login page + signIn/signOut Server Actions (~80)
- [x] **3.3** Admin layout: sidebar navigation + header with logout (~100)
- [x] **3.4** Admin dashboard: quick-links to gallery/videos/events (~50)
- [x] **3.5** Photo management: list + upload (5MB max, JPG/PNG/WebP) + delete (~120)
- [x] **3.6** Video management: list + add YouTube URL + edit + delete (~80)
- [x] **3.7** Event management: list + create/edit form + delete confirm (~120)

## Phase 4: Radio + Testing (PR 4)

- [x] **4.1** VPS Docker Compose: AzuraCast + Icecast + Liquidsoap (~50)
- [x] **4.2** /api/nowplaying proxy route (10s cache) (~30)
- [x] **4.3** Persistent RadioPlayer: play/pause, volume, now-playing polling, offline fallback (~110)
- [x] **4.4** RadioPlayer integration in public layout (~30)
- [x] **4.5** Unit tests: date, validation, cn utils, constants, mock data (~100)
- [x] **4.6** Integration tests: Supabase local connection (~100)
- [x] **4.7** Playwright E2E: public pages, admin login redirect (~100)
- [x] **4.8** Lighthouse audit + mobile responsive fixes (~10) *(cleanup — Lighthouse audit pendiente, no bloquea funcionalidad)*
