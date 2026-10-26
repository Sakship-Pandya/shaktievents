import type { Metadata } from 'next';
import { ExternalLink, Star } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd } from '@/components/site/json-ld';
import { ContentBlock, EmptyNote, PageHero } from '@/components/site/page-shell';
import { getTestimonials } from '@/lib/catalogue-data';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { pagePhotos, workPhoto } from '@/lib/work-photos';
import { getSiteConfig } from '@/lib/settings';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Testimonials' });
  return pageMetadata({
    locale,
    path: '/testimonials',
    title: t('title'),
    description: t('intro'),
  });
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <p className="flex gap-0.5" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={i < rating ? 'size-4 fill-marigold text-marigold' : 'size-4 text-gold/30'}
        />
      ))}
    </p>
  );
}

export default async function TestimonialsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tNav, testimonials, config] = await Promise.all([
    getTranslations('Testimonials'),
    getTranslations('Nav'),
    getTestimonials(locale),
    getSiteConfig(),
  ]);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: t('title'), path: '/testimonials' },
  ];

  const videos = testimonials.filter((item) => item.kind === 'VIDEO' && item.videoUrl);
  const text = testimonials.filter((item) => item.kind === 'TEXT');

  return (
    <>
      {/* No aggregateRating is emitted: inventing a rating out of no reviews is
          exactly the kind of markup that gets a site penalised. It appears when
          real reviews do. */}
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />
      <PageHero
        trail={trail}
        title={t('title')}
        intro={t('intro')}
        photo={workPhoto(pagePhotos.testimonials, locale)}
      />

      <section className="theme-light section-pad">
        <div className="container-site">
          {testimonials.length === 0 ? (
            <EmptyNote tone="light">{t('empty')}</EmptyNote>
          ) : (
            <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {text.map((item) => (
                <RevealItem key={item.id}>
                  <figure className="flex h-full flex-col rounded-2xl border border-gold/40 bg-card p-7">
                    {item.rating ? (
                      <Stars
                        rating={item.rating}
                        label={t('ratingLabel', { rating: item.rating })}
                      />
                    ) : null}
                    <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink">
                      “{item.quote}”
                    </blockquote>
                    <figcaption className="mt-5 text-sm text-muted-foreground">
                      <span className="font-medium text-ink">{item.authorName}</span>
                      {item.town ? ` · ${item.town}` : ''}
                      {item.authorRole ? (
                        <span className="mt-0.5 block text-xs">{item.authorRole}</span>
                      ) : null}
                    </figcaption>
                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-maroon hover:underline"
                      >
                        {t('sourceLabel')}
                        <ExternalLink className="size-3" />
                      </a>
                    ) : null}
                  </figure>
                </RevealItem>
              ))}
            </RevealGroup>
          )}

          {config.googleBusinessProfileUrl ? (
            <p className="mt-10">
              <a
                href={config.googleBusinessProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-maroon/30 px-6 py-3 text-sm font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-ivory"
              >
                {t('leaveReview')}
                <ExternalLink className="size-4" />
              </a>
            </p>
          ) : null}
        </div>
      </section>

      {videos.length > 0 ? (
        <ContentBlock title={t('videoLabel')}>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <RevealItem key={item.id}>
                <figure>
                  <div className="aspect-video overflow-hidden rounded-2xl border border-gold/25">
                    <iframe
                      src={item.videoUrl ?? ''}
                      title={`${t('videoLabel')} — ${item.authorName}`}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="size-full"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-ivory-muted">
                    {item.authorName}
                    {item.town ? ` · ${item.town}` : ''}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentBlock>
      ) : null}

      <ClosingCta showCallButton />
    </>
  );
}
