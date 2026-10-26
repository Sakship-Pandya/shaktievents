/**
 * The shape of an Instagram post and the mapping from the Graph API payload.
 *
 * Kept apart from lib/instagram.ts, which constructs the Prisma client at
 * module scope and so cannot be imported — or tested — without a database.
 */
export type InstagramPost = {
  id: string;
  caption: string;
  permalink: string;
  imageUrl: string;
};

export type GraphMedia = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
};

/**
 * Turns a Graph API payload into what the grid renders.
 *
 * Every field is optional in practice — a deleted post, a story, a media type
 * the API has stopped serving — so anything without both an image and a link
 * is dropped rather than rendered broken. Exported for its own test; the
 * fetch around it needs a token and a network.
 */
export function mapInstagramMedia(items: GraphMedia[]): InstagramPost[] {
  return items
    .map((item) => ({
      id: item.id ?? '',
      // Instagram captions run to paragraphs of hashtags; the first line is
      // the only part worth showing under a thumbnail.
      caption: (item.caption ?? '').split('\n')[0]?.trim().slice(0, 140) ?? '',
      permalink: item.permalink ?? '',
      imageUrl: item.media_type === 'VIDEO' ? (item.thumbnail_url ?? '') : (item.media_url ?? ''),
    }))
    .filter((post) => post.id !== '' && post.imageUrl !== '' && post.permalink !== '');
}
