# Deploying to Vercel

The site is a Next.js 15 app backed by Postgres (Neon) through Prisma 7 driver
adapters. The detail pages (services, areas, events, portfolio, blog) call
`generateStaticParams`, which queries the database **during the build** — so
the build needs a reachable, migrated, seeded database, not just a running app.

`vercel.json` builds with:

```
prisma migrate deploy && next build --turbopack
```

Migrations run before `next build` so the tables exist by the time the static
params are generated.

## Environment variables

Set these in **Settings → Environment Variables** for Production, Preview and
Development. Only three are required for a working deploy.

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | the Neon **pooled** connection string (the host containing `-pooler`) |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXT_PUBLIC_SITE_URL` | the live origin, e.g. `https://shaktievents.vercel.app` |

The database was created directly in the Neon console rather than through the
Vercel Marketplace integration, so `DATABASE_URL` must be pasted in by hand —
nothing injects it automatically.

Use the **pooled** string. Serverless functions open a connection per
invocation and would exhaust a direct endpoint's connection limit under load.
Migrations are handled separately — see below.

`NEXT_PUBLIC_SITE_URL` must be a full absolute URL. `lib/env.ts` validates it
with `z.url()` and silently falls back to `http://localhost:3000` when unset,
which would put localhost links in the sitemap and canonical tags.

Everything else in `.env.example` is optional. `lib/env.ts` marks each one
optional and the features degrade rather than crash:

- **Cloudinary** unset → `/api/upload/signature` returns 503, so admin media
  upload is disabled. The public site still renders.
- **Resend** unset → enquiry notification emails are skipped.
- **Turnstile** unset → the enquiry form skips captcha verification.
- **Instagram / WhatsApp Cloud** are behind feature flags and off by default.

Add them later in the dashboard; each needs a redeploy to take effect (or a
settings save, for the ones read from the `SiteSettings` row).

## Neon and the Prisma CLI

Neon routes every endpoint through one shared IP pair and distinguishes them by
the TLS **SNI hostname**. Both the pooled and direct hostnames resolve to the
same addresses.

The app is unaffected — it reaches Postgres through the `pg` driver adapter and
Node's TLS stack sends SNI correctly. The Prisma CLI is a different story: its
Rust migration engine omits SNI, so `prisma migrate deploy` fails with

```
P1001: Can't reach database server at ep-....neon.tech:5432
```

even though the host resolves and accepts TCP connections. The engine's 5s
connect timeout also intermittently loses the race against a suspended Neon
compute waking up, which makes the failure look random.

`prisma7.config.ts` handles this: for any `*.neon.tech` URL it derives the
migration URL by dropping `-pooler`, adding `options=endpoint=<id>` and
`connect_timeout=30`, and removing `channel_binding`. That runs only in the
CLI, never at app runtime, so `DATABASE_URL` stays the plain pooled string.

Set `DIRECT_DATABASE_URL` to override the derivation if you ever need to.

The pooler is PgBouncer in transaction mode and has no advisory locks, so
migrations must go to the direct endpoint regardless.

## Seeding

`prisma migrate deploy` creates empty tables. Until seeded, the site builds
successfully but has no services, areas or blog posts. Seed once from your
machine, using the **pooled** URL (the seed goes through the driver adapter):

```sh
DATABASE_URL="<pooled connection string>" \
SEED_ADMIN_EMAIL="you@example.com" \
pnpm db:seed
```

The seed is idempotent — every write is an upsert on a natural unique key, so
re-running it against a live database is safe. Leave `SEED_ADMIN_PASSWORD`
blank and it prints a generated password once; that is the only time it is
shown.

Detail pages use the default `dynamicParams: true`, so slugs created after the
build render on demand — seeding does not require a redeploy.

Seeding changes the database out of band from `unstable_cache`. Run
`rm -rf .next` before rebuilding locally, or the build reuses stale content.
Admin edits revalidate properly.

## After the first deploy

Sign in at `/admin/login`, change the seeded password, then fill in the
`SiteSettings` row at `/admin/settings` (phone, WhatsApp number, addresses).
The public pages read that row in preference to the `NEXT_PUBLIC_*` fallbacks.

## Custom domain

Add it under **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL` to the
new origin and redeploy so the sitemap, canonical tags and OG image URLs point
at the real domain.

## Notes

- `engines.node` is `>=22`. Vercel does not offer the Node 25 used locally.
- `vercel.json` pins `regions: ["bom1"]` (Mumbai) while the Neon database is in
  `us-east-2` (Ohio). Cached public pages are served from the CDN and are
  unaffected, but every admin query and form submission crosses a continent.
  Co-locating the two — a Neon database in `ap-southeast-1`, or the functions
  in `iad1` — would remove roughly 200ms per query.
- The `Shiv Shakti events` folder is local input for
  `scripts/import-work-photos.mjs` and is gitignored. It was previously
  committed as a submodule gitlink with no `.gitmodules`, which broke Vercel's
  clone step.
