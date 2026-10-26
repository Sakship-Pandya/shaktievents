import { locales } from '@/i18n/routing';
import { db } from '@/lib/db';
import { absoluteUrl, localizedPath } from '@/lib/seo';

export const revalidate = 3600;

/**
 * A separate image sitemap, because Next's built-in sitemap type carries image
 * URLs but not captions — and the caption is the part that does the work for
 * image search. Placeholder images are left out: there is no value in getting
 * a generated gradient indexed.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let entries: { loc: string; images: { url: string; caption: string }[] }[] = [];

  try {
    const projects = await db.project.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        titleEn: true,
        cover: { select: { url: true, altEn: true, isPlaceholder: true } },
        media: {
          orderBy: { order: 'asc' },
          select: { media: { select: { url: true, altEn: true, isPlaceholder: true } } },
        },
      },
    });

    entries = projects.flatMap((project) =>
      locales.map((locale) => ({
        loc: absoluteUrl(localizedPath(locale, `/portfolio/${project.slug}`)),
        images: [project.cover, ...project.media.map((m) => m.media)]
          .filter((image): image is NonNullable<typeof image> => Boolean(image))
          .filter((image) => !image.isPlaceholder)
          .map((image) => ({
            url: absoluteUrl(image.url),
            caption: image.altEn ?? project.titleEn,
          })),
      })),
    );
  } catch (error) {
    console.error('[image-sitemap] database unavailable:', error);
  }

  const withImages = entries.filter((entry) => entry.images.length > 0);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${withImages
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${entry.images
  .map(
    (image) => `    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>
      <image:caption>${escapeXml(image.caption)}</image:caption>
    </image:image>`,
  )
  .join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
