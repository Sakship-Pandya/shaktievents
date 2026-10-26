import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd } from '@/components/site/json-ld';
import { EmptyNote, PageHero } from '@/components/site/page-shell';
import { getVideos } from '@/lib/catalogue-data';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { pagePhotos, workPhoto } from '@/lib/work-photos';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Videos' });
  return pageMetadata({ locale, path: '/videos', title: t('title'), description: t('intro') });
}

export default async function VideosPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tNav, videos] = await Promise.all([
    getTranslations('Videos'),
    getTranslations('Nav'),
    getVideos(locale),
  ]);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: t('title'), path: '/videos' },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />
      <PageHero
        trail={trail}
        title={t('title')}
        intro={t('intro')}
        photo={workPhoto(pagePhotos.videos, locale)}
      />

      <section className="bg-ink section-pad">
        <div className="container-site">
          {videos.length === 0 ? (
            <EmptyNote>{t('empty')}</EmptyNote>
          ) : (
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <RevealItem key={video.id}>
                  <figure>
                    <div className="aspect-video overflow-hidden rounded-2xl border border-gold/25">
                      {/* nocookie so an embed does not set a tracking cookie
                          before the visitor has done anything. */}
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="size-full"
                      />
                    </div>
                    <figcaption className="mt-3 text-[0.95rem] text-ivory">
                      {video.title}
                      {video.category ? (
                        <span className="mt-0.5 block text-xs text-ivory-muted">
                          {video.category}
                        </span>
                      ) : null}
                    </figcaption>
                  </figure>
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
