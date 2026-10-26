import { unstable_cache } from 'next/cache';
import { db } from './db';
import { mapInstagramMedia, type GraphMedia, type InstagramPost } from './instagram-media';

export { mapInstagramMedia };
export type { InstagramPost };

/**
 * Recent Instagram posts through the Graph API.
 *
 * The token lives in settings so the client can refresh it — Instagram's
 * long-lived tokens expire every 60 days — falling back to INSTAGRAM_TOKEN in
 * the environment. Returns an empty list on any failure rather than throwing:
 * an expired token is the normal end state of an Instagram integration and it
 * has to degrade to the manual gallery, not take a page down.
 */
async function loadInstagram(): Promise<InstagramPost[]> {
  let token = process.env.INSTAGRAM_TOKEN ?? '';

  try {
    const row = await db.siteSettings.findUnique({
      where: { id: 'singleton' },
      select: { instagramToken: true },
    });
    if (row?.instagramToken) token = row.instagramToken;
  } catch {
    // Fall through to the environment token.
  }

  if (!token) return [];

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink';
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=12&access_token=${encodeURIComponent(token)}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) {
      console.warn(`[instagram] ${res.status} — falling back to the manual gallery`);
      return [];
    }

    const json = (await res.json()) as { data?: GraphMedia[] };
    return mapInstagramMedia(json.data ?? []);
  } catch (error) {
    console.warn('[instagram] unreachable — falling back to the manual gallery:', error);
    return [];
  }
}

export const getInstagramPosts = unstable_cache(loadInstagram, ['instagram'], {
  // Tagged with `settings` as well so saving a new token clears the cache that
  // is holding the old token's failure.
  tags: ['instagram', 'settings'],
  revalidate: 3600,
});
