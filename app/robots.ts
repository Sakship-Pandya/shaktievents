import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          // Filtered and paged views are thin slices of a canonical list; the
          // pages themselves are already noindex, this saves the crawl budget.
          '/portfolio?',
          '/blog?',
        ],
      },
    ],
    sitemap: [absoluteUrl('/sitemap.xml'), absoluteUrl('/image-sitemap.xml')],
    host: absoluteUrl('/'),
  };
}
