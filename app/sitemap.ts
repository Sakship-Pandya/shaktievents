import type { MetadataRoute } from 'next';
import { locales, localeTags } from '@/i18n/routing';
import { db } from '@/lib/db';
import { absoluteUrl, localizedPath } from '@/lib/seo';

export const revalidate = 3600;

/**
 * One sitemap for the whole site rather than the five split files the brief
 * suggests: at a couple of hundred URLs a single file is well inside every
 * limit, and Google reads one file more reliably than an index of five.
 *
 * Each entry carries hreflang alternates, so both language versions are
 * discovered together and neither is mistaken for a duplicate of the other.
 */
type Entry = {
  path: string;
  lastModified?: Date;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

/** Pages whose content is a template rather than a database row. */
const STATIC_PAGES: Entry[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/events', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/testimonials', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/videos', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/get-quote', priority: 0.9, changeFrequency: 'yearly' },
  // Low priority but listed: a visible privacy policy is one of the trust
  // signals a local business is judged on.
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

async function databaseEntries(): Promise<Entry[]> {
  try {
    const [services, eventTypes, projects, posts] = await Promise.all([
      db.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      db.eventType.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      db.project.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...services.map((r) => ({
        path: `/services/${r.slug}`,
        lastModified: r.updatedAt,
        priority: 0.9,
        changeFrequency: 'monthly' as const,
      })),
      ...eventTypes.map((r) => ({
        path: `/events/${r.slug}`,
        lastModified: r.updatedAt,
        priority: 0.8,
        changeFrequency: 'monthly' as const,
      })),
      ...projects.map((r) => ({
        path: `/portfolio/${r.slug}`,
        lastModified: r.updatedAt,
        priority: 0.7,
        changeFrequency: 'yearly' as const,
      })),
      ...posts.map((r) => ({
        path: `/blog/${r.slug}`,
        lastModified: r.updatedAt,
        priority: 0.7,
        changeFrequency: 'yearly' as const,
      })),
    ];
  } catch (error) {
    // A sitemap missing its database rows is better than a 500 that makes
    // Search Console drop the file entirely.
    console.error('[sitemap] database unavailable, listing static pages only:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = [...STATIC_PAGES, ...(await databaseEntries())];

  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, entry.path)),
      lastModified: entry.lastModified ?? new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [localeTags[l], absoluteUrl(localizedPath(l, entry.path))]),
          ['x-default', absoluteUrl(localizedPath('en', entry.path))],
        ]),
      },
    })),
  );
}
