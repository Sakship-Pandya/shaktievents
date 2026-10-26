import { ArrowUpRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { serviceIcons } from '@/components/brand/icons';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { PhotoCard } from '@/components/site/photo-card';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { servicePath } from '@/lib/services';
import { getServiceList } from '@/lib/services-data';
import { servicePhotos } from '@/lib/work-photos';

export type ServicesGridProps = {
  limit: number;
  showViewAll: boolean;
};

/** Light section — the ivory break that lets the dark hero and CTA breathe. */
export async function ServicesGrid({ limit, showViewAll }: ServicesGridProps) {
  const [t, tNav, locale] = await Promise.all([
    getTranslations('Home'),
    getTranslations('Nav'),
    getLocale() as Promise<Locale>,
  ]);

  const allServices = await getServiceList(locale);
  const featured = allServices.filter((s) => s.featured);

  // Show the featured services by default; asking for more pulls from the full
  // catalogue rather than silently rendering fewer cards than requested.
  const pool = featured.length >= limit ? featured : allServices;
  const shown = pool.slice(0, limit);

  return (
    <section className="theme-light section-pad">
      <div className="container-site">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-maroon">{t('servicesEyebrow')}</p>
            <h2 className="mt-4 font-display text-display-lg font-medium text-ink">
              {t('servicesTitle')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {t('servicesBody')}
            </p>
          </div>
          {showViewAll ? (
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-maroon/30 px-6 py-3 text-sm font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-ivory md:self-auto"
            >
              {tNav('allServices')}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : null}
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((service) => {
            const Icon =
              (service.icon && serviceIcons[service.icon as keyof typeof serviceIcons]) ||
              serviceIcons.mandap;
            return (
              <RevealItem key={service.slug}>
                <PhotoCard
                  href={servicePath(service.slug)}
                  photo={servicePhotos(service.slug, locale).cover}
                  icon={<Icon className="size-6" />}
                  title={service.name}
                  body={service.summary}
                  footer={
                    <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold tracking-[0.06em] text-maroon uppercase">
                      {t('servicesLink')}
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
  );
}
