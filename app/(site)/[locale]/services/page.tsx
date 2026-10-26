import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { serviceIcons, type ServiceIconName } from '@/components/brand/icons';
import { Texture } from '@/components/brand/texture';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { JsonLd } from '@/components/site/json-ld';
import { NavLink } from '@/components/site/nav-link';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { getServiceList } from '@/lib/services-data';
import { servicePath } from '@/lib/services';
import { getSiteConfig } from '@/lib/settings';
import { PhotoCard } from '@/components/site/photo-card';
import { PhotoBackdrop } from '@/components/site/work-image';
import { pagePhotos, servicePhotos, workPhoto } from '@/lib/work-photos';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Service' });

  return pageMetadata({
    locale,
    path: '/services',
    title: t('hubTitle'),
    description: t('hubIntro'),
  });
}

export default async function ServicesHubPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tNav, services, config] = await Promise.all([
    getTranslations('Service'),
    getTranslations('Nav'),
    getServiceList(locale),
    getSiteConfig(),
  ]);

  const areaNames = [config.city];
  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('services'), path: '/services' },
  ];

  return (
    <>
      <JsonLd schemas={[localBusinessSchema(config, areaNames), breadcrumbSchema(locale, trail)]} />

      <section className="relative hero-under-header overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28 lg:min-h-[34rem]">
        <PhotoBackdrop photo={workPhoto(pagePhotos.services, locale)} priority />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,color-mix(in_oklab,var(--color-maroon)_70%,transparent)_0%,transparent_65%)]"
        />
        <Texture opacity={0.06} />
        <div className="relative container-site max-w-4xl">
          <Breadcrumbs trail={trail} />
          <h1 className="mt-7 font-display text-display-lg font-medium text-ivory">
            {t('hubTitle')}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-muted md:text-lg">
            {t('hubIntro')}
          </p>
        </div>
      </section>

      <section className="theme-light section-pad">
        <div className="container-site">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon as ServiceIconName] ?? serviceIcons.event;
              return (
                <RevealItem key={service.slug}>
                  <PhotoCard
                    href={servicePath(service.slug)}
                    photo={servicePhotos(service.slug, locale).cover}
                    titleAs="h2"
                    icon={<Icon className="size-6" />}
                    badge={
                      service.featured ? (
                        <span className="rounded-full bg-ivory/90 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] text-maroon uppercase backdrop-blur-sm">
                          {t('hubFeatured')}
                        </span>
                      ) : null
                    }
                    title={service.name}
                    body={service.summary}
                    footer={
                      <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-[0.06em] text-maroon uppercase">
                        {t('backToServices')}
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    }
                  />
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <ClosingCta showCallButton />
    </>
  );
}
