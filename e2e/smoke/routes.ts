/**
 * The routes a deployment has to serve. Kept in one place so every spec agrees
 * on what "the site" means, and so adding a page means adding it here rather
 * than remembering which specs to touch.
 */
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/wedding-mandap-decoration-surendranagar',
  '/services/german-hanger-pandal-tent-surendranagar',
  '/services/sound-system-pa-service-surendranagar',
  '/events',
  '/events/weddings',
  '/portfolio',
  '/areas',
  '/areas/limbdi',
  '/areas/chotila',
  '/packages',
  '/testimonials',
  '/videos',
  '/blog',
  '/blog/wedding-mandap-cost-surendranagar-2026',
  '/faq',
  '/get-quote',
  '/contact',
  '/privacy-policy',
  '/terms',
] as const;

/** Locale prefix rules: English is unprefixed, Gujarati sits under /gu. */
export const gu = (path: string) => (path === '/' ? '/gu' : `/gu${path}`);

/** Pages worth checking in both languages; the rest are covered in English. */
export const BILINGUAL_ROUTES = [
  '/',
  '/services',
  '/services/wedding-mandap-decoration-surendranagar',
  '/portfolio',
  '/areas/limbdi',
  '/get-quote',
  '/contact',
  '/blog',
] as const;

export const FILES = ['/robots.txt', '/sitemap.xml', '/image-sitemap.xml'] as const;
