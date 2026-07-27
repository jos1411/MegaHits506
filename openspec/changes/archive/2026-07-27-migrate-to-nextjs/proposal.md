# Proposal: Migrate to Next.js + Supabase + Radio Online

## Intent

Full rewrite of MegaHits506 from ASP.NET MVC 5 (.NET 4.7.2 / SQL Server) to a modern, secure, scalable stack. The legacy app has no auth security (plain-text passwords, no CSRF), no mobile UX, a non-existent radio feature, and friction-heavy client quotes that users bypass via WhatsApp anyway. This change turns the site into a **public portfolio + radio streaming platform** with admin-only CMS — no client login, no quotes module.

## Scope

### In Scope
- Landing page (hero, servicios, misión/visión, trayectoria)
- Public photo gallery (lightbox) + YouTube video gallery
- Events portfolio (CRUD for admin, public showcase)
- Contact form → WhatsApp deep-link
- **Radio online streaming** (AzuraCast + Icecast, autoDJ)
- Admin auth (Supabase Auth, 1-2 users: José + papá)
- Admin CMS for gallery, videos, events content
- SQL Server → Supabase PostgreSQL migration (schema only, no data)
- VPS provisioning for stream (Hetzner CX22)
- CI/CD via Vercel + GitHub Actions

### Out of Scope
- Client login / registration
- Client quote/cotización system
- Content migration from legacy DB (start fresh)
- Legacy ASP.NET code preservation (reference only, not deployed)
- Multi-language / i18n
- Mobile app (responsive web only)
- Social login, OAuth providers
- Analytics or metrics dashboard

## Capabilities

> No existing specs — all capabilities are new.

### New Capabilities
- `landing-page`: Hero, servicios, misión/visión, trayectoria — public, no auth
- `media-gallery`: Photo gallery with lightbox + YouTube video embeds — public
- `events`: Events portfolio — public view, admin CRUD
- `contact`: WhatsApp contact — static, no backend
- `radio-streaming`: Live radio stream via AzuraCast/Icecast embedded player
- `admin-auth`: Supabase Auth, email+password, admin-only access
- `admin-cms`: Manage gallery, videos, events — protected behind admin-auth

### Modified Capabilities
- None

## Approach

1. **Scaffold**: Next.js 14 App Router + TypeScript + Tailwind CSS 4 + shadcn/ui
2. **Supabase**: PostgreSQL schema, Storage for images, Auth for admin
3. **VPS**: Hetzner CX22 → Docker Compose (AzuraCast + Icecast + Liquidsoap autoDJ)
4. **Vercel**: Deploy frontend, env vars for Supabase + AzuraCast API keys
5. **CI/CD**: GitHub Actions → lint, type-check, test, deploy to Vercel
6. **Legacy**: ASP.NET project stays as reference, no runtime migration

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `MegaHits506/` | Legacy (reference only) | Full rewrite — not deployed |
| `openspec/changes/migrate-to-nextjs/` | New | SDD artifacts for this change |
| (new repo) | New | Next.js project in new repo |
| (VPS) | New | Hetzner CX22 — AzuraCast + Icecast |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Radio streaming latency/poor quality | Med | Choose CDN-friendly Icecast + test with multiple clients |
| Supabase Storage costs for images | Low | Optimize images (WebP, responsive), set size limits |
| Single dev bottleneck (José solo) | Med | Prioritize by capability, deliver in phases |
| VPS management overhead | Med | Docker Compose + Ansible or manual scripts for repeatability |

## Rollback Plan

- Legacy ASP.NET remains untouched and deployable at any time
- DNS cutover: keep current domain pointing to legacy until Vercel deploy is verified
- Supabase project can be deleted without affecting legacy SQL Server data
- VPS can be stopped/destroyed; radio feature degrades gracefully (hide player)

## Dependencies

- Vercel account + GitHub repo
- Supabase project (free tier to start)
- Hetzner account + CX22 provisioning (≈$4-6/mo)
- AzuraCast Docker image (open source)
- Domain (new or re-point existing)

## Success Criteria

- [ ] Landing page, gallery, events, contact render correctly and are mobile-responsive
- [ ] Radio player plays live stream with <5s latency on desktop and mobile
- [ ] Admin can log in, upload images, add/edit events, embed videos
- [ ] Lighthouse scores ≥80 on all pages (mobile + desktop)
- [ ] No client login or quote capability exposed
- [ ] All builds pass in CI (lint, type-check, test)
