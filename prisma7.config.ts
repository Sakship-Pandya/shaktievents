import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 no longer reads .env automatically and no longer takes the URL
 * from schema.prisma. We load .env.local — the same file Next.js reads — so
 * the app and the CLI can never point at different databases.
 */
if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile('.env.local');
  } catch {
    // No .env.local (CI, Vercel): the platform supplies DATABASE_URL directly.
  }
}

/**
 * Neon routes every endpoint through one shared IP pair and tells them apart
 * by the TLS SNI hostname. The app is fine — it talks to Postgres through the
 * `pg` driver adapter, and Node's TLS stack sends SNI. The Prisma CLI is not:
 * its Rust migration engine omits SNI, so `migrate deploy` against a Neon URL
 * fails with P1001 "Can't reach database server" even though the host resolves
 * and accepts TCP. Neon's documented workaround is to name the endpoint
 * explicitly with `options=endpoint=<id>`.
 *
 * We also pin `connect_timeout`, because the engine's 5s default intermittently
 * loses the race against a suspended Neon compute waking up.
 *
 * This only ever runs in the CLI, never at app runtime.
 */
function migrationUrl(): string | undefined {
  const raw = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!raw) return undefined;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return raw;
  }

  if (!url.hostname.endsWith('.neon.tech')) return raw;

  // The pooler is PgBouncer in transaction mode, which has no advisory locks
  // for the migration lock. Always migrate against the direct endpoint.
  url.hostname = url.hostname.replace('-pooler', '');

  const endpointId = url.hostname.split('.')[0];
  if (!url.searchParams.has('options')) {
    url.searchParams.set('options', `endpoint=${endpointId}`);
  }
  if (!url.searchParams.has('connect_timeout')) {
    url.searchParams.set('connect_timeout', '30');
  }
  // Channel binding requires the SNI-selected endpoint, which we just bypassed.
  url.searchParams.delete('channel_binding');

  return url.toString();
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: migrationUrl(),
  },
});
