import { unstable_cache } from 'next/cache';
import { db } from './db';

export type RedirectRule = { source: string; destination: string; permanent: boolean };

/**
 * Redirects live in the database rather than next.config so the client can add
 * one without a deploy — which matters most exactly when it matters: a page
 * has been renamed and the old URL is already out there on a card or a
 * WhatsApp forward.
 */
async function loadRedirects(): Promise<RedirectRule[]> {
  try {
    const rows = await db.redirect.findMany({
      select: { source: true, destination: true, permanent: true },
    });
    return rows;
  } catch (error) {
    console.error('[redirects] unavailable, serving without them:', error);
    return [];
  }
}

export const getRedirects = unstable_cache(loadRedirects, ['redirects'], {
  tags: ['redirects'],
  revalidate: 3600,
});

/** Exact-path match only. Patterns would need a rule language the client would then have to learn. */
export function matchRedirect(rules: RedirectRule[], pathname: string): RedirectRule | null {
  const normalised = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return rules.find((rule) => rule.source === normalised) ?? null;
}
