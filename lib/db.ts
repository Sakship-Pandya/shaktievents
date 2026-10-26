import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/lib/generated/prisma/client';

/**
 * Prisma 7 has no bundled query engine — it talks to Postgres through a
 * driver adapter. An explicit pg.Pool with keep-alive and a 5-minute idle timeout
 * prevents connections to remote databases (e.g. Neon) from constantly dropping
 * after 10 seconds of idle user time, avoiding costly 1.8s TLS handshakes.
 *
 * Both the pool and the client are cached on globalThis across hot reloads in
 * development to reuse active connections and prevent connection exhaustion.
 */
const globalForDb = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

function getOrCreatePool(connectionString: string): pg.Pool {
  if (globalForDb.pgPool) {
    return globalForDb.pgPool;
  }

  const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 300_000, // 5 minutes (default is 10s, which dropped connections between user actions)
    connectionTimeoutMillis: 10_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  // Handle idle client errors gracefully to prevent crashing
  pool.on('error', (err) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[db pool] idle client error:', err.message);
    }
  });

  // Asynchronously pre-warm a connection so initial queries avoid cold TLS handshake
  pool.query('SELECT 1').catch(() => {});

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.pgPool = pool;
  }

  return pool;
}

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
  }

  const pool = getOrCreatePool(connectionString);
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const db = globalForDb.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForDb.prisma = db;

