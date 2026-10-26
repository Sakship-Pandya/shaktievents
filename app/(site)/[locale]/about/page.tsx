import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { serviceIcons, type ServiceIconName } from '@/components/brand/icons';
import { CountUp } from '@/components/motion/count-up';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd } from '@/components/site/json-ld';
import { NavLink } from '@/components/site/nav-link';
import { ContentBlock, PageHero } from '@/components/site/page-shell';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { servicePath } from '@/lib/services';
import { getServiceList } from '@/lib/services-data';
import { getSiteConfig } from '@/lib/settings';
import { WorkImage } from '@/components/site/work-image';
import { pagePhotos, workPhoto } from '@/lib/work-photos';

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'About' });
  return pageMetadata({ locale, path: '/about', title: t('title'), description: t('intro') });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const [t, tNav, tHero, services, config] = await Promise.all([
    getTranslations('About'),
    getTranslations('Nav'),
    getTranslations('Hero'),
    getServiceList(locale),
    getSiteConfig(),
  ]);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('about'), path: '/about' },
  ];

  const values = [1, 2, 3, 4, 5, 6].map((n) => ({
    title: t(`v${n}Title` as 'v1Title'),
    body: t(`v${n}Body` as 'v1Body'),
  }));

  const stats = [
    { key: 'events', value: config.stats.eventsCompleted, suffix: '+' },
    { key: 'years', value: config.stats.years, suffix: '+' },
    { key: 'towns', value: config.stats.townsServed, suffix: '+' },
    { key: 'team', value: config.stats.teamSize, suffix: '+' },
  ] as const;

  // Shown only when the client has filled in at least one figure — a row of
  // [TBD] markers says less than no row at all.
  const hasStats = stats.some((stat) => stat.value !== null);

  return (
    <>
      <JsonLd
        schemas={[
          localBusinessSchema(config, [config.city]),
          breadcrumbSchema(locale, trail),
        ]}
      />
      <PageHero
        trail={trail}
        title={t('title')}
        intro={t('intro')}
        photo={workPhoto(pagePhotos.about, locale)}
      />

      <ContentBlock title={t('storyHeading')} tone="light">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          <Reveal className="max-w-3xl">
            <p className="font-display text-display-sm leading-snug font-medium text-ink">
              {t('storyBody')}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">{t('storyPending')}</p>
          </Reveal>

          {/* Arch frame with a smaller square tucked over its corner. */}
          <Reveal className="relative mx-auto w-full max-w-sm pb-10 pl-10 lg:max-w-none">
            <span
              aria-hidden
              className="absolute top-3 -right-3 bottom-7 left-7 rounded-t-full border border-maroon/25"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/50 bg-ink-700">
              <WorkImage
                photo={workPhoto('white-mandap-dusk', locale)}
                sizes="(max-width: 1024px) 24rem, 26rem"
              />
            </div>
            <div className="absolute bottom-0 left-0 aspect-square w-[42%] overflow-hidden rounded-2xl border-4 border-ivory bg-ink-700 shadow-[0_24px_50px_-24px_rgba(20,16,13,0.6)]">
              <WorkImage photo={workPhoto('haldi-stage-lights', locale)} sizes="12rem" />
            </div>
          </Reveal>
        </div>
      </ContentBlock>

      <ContentBlock title={t('valuesHeading')}>
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <RevealItem key={value.title}>
              <div className="h-full border-t-2 border-gold/30 pt-5">
                <span className="font-display text-2xl text-marigold tabular">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-lg font-medium text-ivory">{value.title}</h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ivory-muted">
                  {value.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </ContentBlock>

      {hasStats ? (
        <section className="border-y border-gold/20 bg-ink-800">
          <dl className="container-site grid grid-cols-2 divide-gold/15 md:grid-cols-4 md:divide-x">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="border-t border-gold/15 px-1 py-6 md:border-t-0 md:px-6"
              >
                <dt className="eyebrow text-gold-soft">{tHero(`stats.${stat.key}`)}</dt>
                <dd className="mt-2 font-display text-display-sm text-ivory">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <ContentBlock title={t('crewHeading')} tone="light">
        <Reveal className="max-w-3xl">
          <p className="text-base leading-relaxed text-muted-foreground">{t('crewBody')}</p>
        </Reveal>
        <RevealGroup className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {(['night-catering-counters', 'hanger-dining-hall', 'grand-ground-dusk'] as const).map(
            (slug, i) => (
              <RevealItem key={slug} className={i === 2 ? 'col-span-2 md:col-span-1' : undefined}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/40 bg-ink-700">
                  <WorkImage
                    photo={workPhoto(slug, locale)}
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              </RevealItem>
            ),
          )}
        </RevealGroup>
      </ContentBlock>

      <ContentBlock title={t('servicesHeading')}>
        <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = serviceIcons[service.icon as ServiceIconName] ?? serviceIcons.event;
            return (
              <RevealItem key={service.slug}>
                <NavLink
                  href={servicePath(service.slug)}
                  className="group flex items-center gap-3 rounded-xl border border-gold/30 p-4 transition-colors hover:border-gold/60 hover:bg-gold/5"
                >
                  <Icon className="size-5 shrink-0 text-gold" />
                  <span className="text-[0.9rem] text-ivory/85 group-hover:text-marigold">
                    {service.short}
                  </span>
                </NavLink>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </ContentBlock>

      <ClosingCta showCallButton />
    </>
  );
}
