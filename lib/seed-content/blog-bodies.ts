import { blogBodies1 } from './blog-bodies-1';
import { blogBodies2 } from './blog-bodies-2';
import { blogBodies3 } from './blog-bodies-3';
import { blogBodies4 } from './blog-bodies-4';
import type { ArticleBody } from './blocks';

/**
 * Bodies for the eight seeded articles. A post with no entry here keeps its
 * slug and excerpt but stays DRAFT — the blog never publishes an empty page.
 */
export const blogBodies: ArticleBody[] = [
  ...blogBodies1,
  ...blogBodies2,
  ...blogBodies3,
  ...blogBodies4,
];
