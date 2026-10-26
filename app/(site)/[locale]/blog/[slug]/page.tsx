import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd } from '@/components/site/json-ld';
import { NavLink } from '@/components/site/nav-link';
import { ContentBlock, PageHero } from '@/components/site/page-shell';
import { RichTextBody } from '@/components/site/rich-text';
import { routing } from '@/i18n/routing';
import { getBlogList, getBlogPost, getBlogSlugs } from '@/lib/blog-data';
import { resolveLocale } from '@/lib/locale';
import { articleSchema, breadcrumbSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { getSiteConfig } from '@/lib/settings';
import { photoForIndex } from '@/lib/work-photos';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const post = await getBlogPost(slug, locale);
  if (!post) return {};

  const seoTitle = locale === 'gu' ? post.seo.titleGu : post.seo.titleEn;
  const seoDescription = locale === 'gu' ? post.seo.descriptionGu : post.seo.descriptionEn;

  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: seoTitle ?? post.title,
    // Falls back to the opening of the article, so a post without a written
    // excerpt still gets a description rather than none.
    description: (seoDescription ?? post.excerpt ?? post.plainText).slice(0, 180),
    noindex: post.seo.noindex,
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
  });
}

export default async function BlogPostPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPost(slug, locale);
  if (!post) notFound();

  const [t, tNav, format, config, all] = await Promise.all([
    getTranslations('Blog'),
    getTranslations('Nav'),
    getFormatter(),
    getSiteConfig(),
    getBlogList(locale),
  ]);

  const related = all.filter((item) => item.slug !== slug).slice(0, 3);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('blog'), path: '/blog' },
    { name: post.title, path: `/blog/${slug}` },
  ];

  return (
    <>
      <JsonLd
        schemas={[
          articleSchema({
            headline: post.title,
            description: post.excerpt ?? post.plainText.slice(0, 180),
            path: `/blog/${slug}`,
            locale,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            authorName: post.author,
            imageUrl: post.coverUrl,
            config,
          }),
          breadcrumbSchema(locale, trail),
        ]}
      />

      <PageHero
        trail={trail}
        title={post.title}
        intro={post.excerpt ?? undefined}
        photo={photoForIndex(
          all.findIndex((item) => item.slug === slug),
          locale,
        )}
      >
        <p className="mt-6 text-sm text-gold-soft/90">
          {t('readTime', { minutes: post.readMinutes })}
          {post.publishedAt
            ? ` · ${t('published', { date: format.dateTime(new Date(post.publishedAt), 'short') })}`
            : ''}
          {post.author ? ` · ${t('by', { author: post.author })}` : ''}
        </p>
      </PageHero>

      <section className="theme-light section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
          {post.toc.length > 1 ? (
            <nav aria-label={t('contents')} className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="mb-4 eyebrow text-maroon">{t('contents')}</h2>
              <ul className="space-y-2 border-l border-gold/40 pl-4">
                {post.toc.map((entry) => (
                  <li key={entry.id} className={entry.level === 3 ? 'pl-3' : undefined}>
                    <a
                      href={`#${entry.id}`}
                      className="text-[0.85rem] leading-snug text-muted-foreground transition-colors hover:text-maroon"
                    >
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <div aria-hidden />
          )}

          <article className="max-w-3xl">
            <RichTextBody doc={post.body} />
            <p className="mt-14 border-t border-gold/30 pt-6 text-xs text-muted-foreground">
              {t('updated', { date: format.dateTime(new Date(post.updatedAt), 'short') })}
            </p>
          </article>
        </div>
      </section>

      {related.length > 0 ? (
        <ContentBlock title={t('related')}>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <RevealItem key={item.slug}>
                <NavLink
                  href={`/blog/${item.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-gold/30 p-6 transition-colors hover:border-gold/60 hover:bg-gold/5"
                >
                  {item.category ? (
                    <span className="eyebrow text-gold">{item.category.name}</span>
                  ) : null}
                  <h3 className="mt-3 font-display text-lg leading-snug font-medium text-ivory group-hover:text-marigold">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-xs text-ivory-muted">
                    {t('readTime', { minutes: item.readMinutes })}
                  </p>
                </NavLink>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-8">
            <NavLink
              href="/blog"
              className="inline-flex rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:border-gold hover:bg-gold/10"
            >
              {t('backToBlog')}
            </NavLink>
          </Reveal>
        </ContentBlock>
      ) : null}

      <ClosingCta showCallButton />
    </>
  );
}
