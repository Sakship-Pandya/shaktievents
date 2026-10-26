import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd } from '@/components/site/json-ld';
import { NavLink } from '@/components/site/nav-link';
import { EmptyNote, PageHero } from '@/components/site/page-shell';
import { getBlogCategories, getBlogList } from '@/lib/blog-data';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { PhotoCard } from '@/components/site/photo-card';
import { pagePhotos, photoForIndex, workPhoto } from '@/lib/work-photos';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const category = (await searchParams).category;

  return pageMetadata({
    locale,
    path: '/blog',
    title: t('title'),
    description: t('intro'),
    // A category view is a slice of the same list, not a page of its own.
    noindex: typeof category === 'string' && category !== '',
  });
}

export default async function BlogHubPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const raw = (await searchParams).category;
  const category = typeof raw === 'string' && raw !== '' ? raw : undefined;

  const [t, tNav, format, posts, categories] = await Promise.all([
    getTranslations('Blog'),
    getTranslations('Nav'),
    getFormatter(),
    getBlogList(locale, category),
    getBlogCategories(locale),
  ]);

  // Photographs go by position in the full list, so no two cards share one
  // and a post keeps the same photograph on its own page and in any category.
  const order = (category ? await getBlogList(locale) : posts).map((post) => post.slug);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('blog'), path: '/blog' },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />
      <PageHero
        trail={trail}
        title={t('title')}
        intro={t('intro')}
        photo={workPhoto(pagePhotos.blog, locale)}
      />

      <section className="theme-light section-pad">
        <div className="container-site">
          {categories.length > 0 ? (
            <ul className="mb-10 flex flex-wrap gap-2">
              <li>
                <NavLink
                  href="/blog"
                  className={`inline-flex rounded-full border px-5 py-2 text-[0.85rem] transition-colors ${
                    category
                      ? 'border-gold/50 text-ink hover:border-maroon'
                      : 'border-maroon bg-maroon text-ivory'
                  }`}
                >
                  {t('all')}
                </NavLink>
              </li>
              {categories.map((item) => (
                <li key={item.slug}>
                  <NavLink
                    href={`/blog?category=${item.slug}`}
                    className={`inline-flex rounded-full border px-5 py-2 text-[0.85rem] transition-colors ${
                      category === item.slug
                        ? 'border-maroon bg-maroon text-ivory'
                        : 'border-gold/50 text-ink hover:border-maroon'
                    }`}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : null}

          {posts.length === 0 ? (
            <EmptyNote tone="light">{t('empty')}</EmptyNote>
          ) : (
            <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <RevealItem key={post.slug}>
                  <PhotoCard
                    href={`/blog/${post.slug}`}
                    photo={photoForIndex(order.indexOf(post.slug), locale)}
                    titleAs="h2"
                    eyebrow={
                      post.category ? (
                        <span className="eyebrow text-maroon">{post.category.name}</span>
                      ) : null
                    }
                    title={post.title}
                    body={post.excerpt}
                    footer={
                      <p className="text-xs text-muted-foreground">
                        {t('readTime', { minutes: post.readMinutes })}
                        {post.publishedAt
                          ? ` · ${format.dateTime(new Date(post.publishedAt), 'short')}`
                          : ''}
                      </p>
                    }
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      <ClosingCta showCallButton />
    </>
  );
}
