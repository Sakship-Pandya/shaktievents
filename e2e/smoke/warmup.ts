import { request } from '@playwright/test';
import { BILINGUAL_ROUTES, gu, PUBLIC_ROUTES } from './routes';

/**
 * Fetches every route once, serially, before the suite starts.
 *
 * Pages are statically generated but served on demand, and a server that has
 * just started renders each one for the first time as it is asked for. Ten
 * parallel workers hitting a cold server was enough to push a first render
 * past the expect timeout and fail a test that has nothing wrong with it —
 * which is worse than a slow test, because it teaches you to ignore red.
 */
export default async function warmup() {
  const baseURL = process.env.SMOKE_URL ?? 'http://localhost:3000';
  const context = await request.newContext({ baseURL });

  const paths = [
    ...PUBLIC_ROUTES,
    ...BILINGUAL_ROUTES.map(gu),
    '/robots.txt',
    '/sitemap.xml',
    '/image-sitemap.xml',
  ];

  for (const path of paths) {
    await context.get(path).catch(() => undefined);
  }
  await context.dispose();
}
