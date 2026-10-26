import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { serviceIcons, type ServiceIconName } from '@/components/brand/icons';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd } from '@/components/site/json-ld';
import { ContentBlock, PageHero } from '@/components/site/page-shell';
import { PhotoCard } from '@/components/site/photo-card';
import { eventPhotos, pagePhotos, workPhoto } from '@/lib/work-photos';
import { getEventTypeList } from '@/lib/catalogue-data';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Events' });
  return pageMetadata({
    locale,
    path: '/events',
    title: t('hubTitle'),
    description: t('hubIntro'),
  });
}

export default async function EventsHubPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tNav, eventTypes] = await Promise.all([
    getTranslations('Events'),
    getTranslations('Nav'),
    getEventTypeList(locale),
  ]);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('events'), path: '/events' },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />
      <PageHero
        trail={trail}
        title={t('hubTitle')}
        intro={t('hubIntro')}
        photo={workPhoto(pagePhotos.events, locale)}
      />

      <ContentBlock title={t('all')} tone="light">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((event) => {
            const Icon = serviceIcons[event.icon as ServiceIconName] ?? serviceIcons.event;
            return (
              <RevealItem key={event.slug}>
                <PhotoCard
                  href={`/events/${event.slug}`}
                  photo={eventPhotos(event.slug, locale).cover}
                  titleAs="h2"
                  icon={<Icon className="size-6" />}
                  title={event.name}
                  body={event.blurb}
                  footer={
                    <ArrowUpRight className="size-4 text-maroon transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  }
                />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </ContentBlock>

      <ClosingCta showCallButton />
    </>
  );
}
