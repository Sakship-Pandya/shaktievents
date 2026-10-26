# Shree Shakti Sound Service & Mandap Contractor

The website for a mandap, german hanger and sound contractor working across
Surendranagar district, Gujarat. Bilingual English and Gujarati, with an admin
panel the business runs itself.

It was built to do three things:  

1. **Rank** for mandap, pandal, german hanger and sound-hire searches across the
   district — not just in Surendranagar town.
2. **Convert** a visitor into a phone call, a WhatsApp message or a quote
   request in two taps.
3. **Be handed over.** Every word, price, photograph and page on the public site
   is editable from `/admin` by somebody who has never seen a terminal.

---

## Running it

```bash
pnpm install
cp .env.example .env.local        # then fill in DATABASE_URL and AUTH_SECRET
pnpm db:migrate                   # creates the schema
SEED_ADMIN_EMAIL=you@example.com pnpm db:seed
pnpm dev
```

The seed is idempotent — run it as often as you like. With `SEED_ADMIN_EMAIL`
set it creates the first admin and prints a generated password **once**; write
it down.

The public site is at `/`, the Gujarati site at `/gu`, the admin at `/admin`.

### Environment

Everything in `.env.example` is optional except `DATABASE_URL` and
`AUTH_SECRET`; a feature whose keys are missing switches itself off rather than
crashing. The two that matter most in production:

| Variable               | Why it matters                                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Every canonical, hreflang and sitemap URL is built from it. Wrong value = the live site tells Google its canonical is `localhost`. |
| `AUTH_SECRET`          | Signs the admin session. `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`                             |

Cloudinary powers image uploads, Resend delivers enquiry emails, Turnstile is
optional spam protection on the quote form. Without Cloudinary the media library
cannot upload; without Resend, enquiries are still saved to the database and
visible in the admin — they just do not land in an inbox.

---

## Commands

|                                                |                                                                                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                                     | Development server                                                                                                     |
| `pnpm build` / `pnpm start`                    | Production build and server                                                                                            |
| `pnpm typecheck` / `pnpm lint` / `pnpm format` | Static checks                                                                                                          |
| `pnpm test`                                    | Unit tests (vitest) — 81 tests                                                                                         |
| `pnpm smoke`                                   | Playwright smoke tests against a running site — 129 checks                                                             |
| `pnpm smoke:strict`                            | The same, plus the launch-readiness checks. Run this on the live URL.                                                  |
| `pnpm verify:*`                                | Deep functional suites: `admin`, `builder`, `services`, `portfolio`, `quote`, `pages`, `blog`, `features` — 148 checks |
| `pnpm lighthouse`                              | Mobile Lighthouse on four representative pages                                                                         |
| `pnpm db:migrate` / `db:seed` / `db:studio`    | Database                                                                                                               |
| `pnpm docs:guide`                              | Regenerates the two admin guides from `lib/admin-guide.ts`                                                             |

`smoke` is read-only and safe against production:

```bash
SMOKE_URL=https://yourdomain.com pnpm smoke:strict
```

The `verify:*` suites sign in, write to the database and put back what they
changed — those belong on a local build:

```bash
pnpm build && pnpm start
ADMIN_EMAIL=… ADMIN_PASSWORD=… pnpm verify:features
```

---

## How it is put together

**Next.js 15 App Router, React 19, TypeScript, Tailwind v4, Prisma 7 on
PostgreSQL, Auth.js v5, next-intl.**

A few decisions worth knowing before you change anything:

- **Localised content is paired columns**, `titleEn` / `titleGu`, not a
  translations table. Two languages, known at build time, and every query stays
  a single row read.
- **Rich and repeatable content is `Json`, validated by zod** on the way in and
  on the way out (`lib/schemas/`). A malformed row renders as empty, never as a
  crash.
- **Pages are static, regenerated hourly.** Every admin save calls both
  `revalidateTag` and `revalidatePath` — the tag alone clears the cached query
  but leaves the rendered page, which looks exactly like a save that did not
  work.
- **The home page is assembled from `PageSection` rows**, so the client can
  reorder and hide blocks at `/admin/sections` without a deploy.
- **Optional features are behind flags and genuinely absent when off.** See
  `components/features/lazy.tsx` for why the obvious approaches ship the code
  anyway.

### The rule the whole project is built on

**Never invent a business fact.** Anything unknown renders a visible `[TBD]`
rather than a plausible guess. There are no fabricated testimonials, no
`aggregateRating`, no invented event counts, no stock photographs of somebody
else's mandap, and no prices until the client sets them. The estimator shows no
figure at all until base prices exist, and says so.

This is not caution for its own sake — a made-up review or an invented star
rating is a manual-action risk, and a stock mandap photograph is the first thing
a visitor in this district spots.

---

## Handing it over

Read in this order:

1. **[`docs/content-review.md`](docs/content-review.md)** — everything still
   waiting on the client, why each was left blank, and the two places the build
   deliberately departs from the brief.
2. **[`docs/seo-launch-checklist.md`](docs/seo-launch-checklist.md)** — what to
   do before the domain switches over, on the day, and every month after.
3. **[`docs/admin-guide.md`](docs/admin-guide.md)** /
   **[`docs/admin-guide.gu.md`](docs/admin-guide.gu.md)** — the guide for the
   business, in both languages. The same guide is inside the admin at
   `/admin/help`, which is where it will actually be read; the markdown copies
   are generated from the same source with `pnpm docs:guide`.

### Deploying

Vercel, with a managed Postgres. Set the environment variables above, point the
build at `pnpm build`, and run `pnpm db:deploy` against the production database
before the first deploy. Then:

```bash
SMOKE_URL=https://yourdomain.com pnpm smoke:strict
```

That will fail until the business details are filled in — which is the point.
Fill them in at `/admin/settings`, run it again, and when it passes the site is
ready to be told to Google.

---

## Where things live

```
app/(site)/[locale]/     public pages, both languages
app/admin/(dashboard)/   the admin panel
components/features/     the five flagged features and their gates
components/sections/     home page blocks + the builder's registry
lib/schemas/             zod schemas for every Json column and every form
lib/seed-content/        the written copy that ships in the seed
prisma/                  schema, migrations, idempotent seed
e2e/smoke/               Playwright smoke tests (read-only, any environment)
e2e/verify-*.mjs         deep functional suites (local build, signs in)
docs/                    handover
```
