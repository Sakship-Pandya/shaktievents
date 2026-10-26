import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { serviceIcons, type ServiceIconName } from '@/components/brand/icons';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ClosingCta } from '@/components/sections/closing-cta';
import { QuoteCta, WhatsAppCta } from '@/components/site/action-buttons';
import { JsonLd } from '@/components/site/json-ld';
import { NavLink } from '@/components/site/nav-link';
import { ContentBlock, PageHero } from '@/components/site/page-shell';
import { ProjectCard } from '@/components/site/project-card';
import { routing } from '@/i18n/routing';
import { getEventTypeDetail, getEventTypeSlugs, getEventTypeList } from '@/lib/catalogue-data';
import { resolveLocale } from '@/lib/locale';
import { getProjectList } from '@/lib/projects-data';
import { breadcrumbSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { servicePath } from '@/lib/services';
import { getServiceList } from '@/lib/services-data';
import { getSiteConfig, toContactInfo } from '@/lib/settings';
import { WorkGallery } from '@/components/site/work-gallery';
import { eventPhotos } from '@/lib/work-photos';

type Props = { params: Promise<{ locale: string; type: string }> };

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getEventTypeSlugs();
  return routing.locales.flatMap((locale) => slugs.map((type) => ({ locale, type })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { type } = await params;
  const event = await getEventTypeDetail(type, locale);
  if (!event) return {};

  const seoTitle = locale === 'gu' ? event.seo.titleGu : event.seo.titleEn;
  const seoDescription = locale === 'gu' ? event.seo.descriptionGu : event.seo.descriptionEn;

  return pageMetadata({
    locale,
    path: `/events/${type}`,
    title: seoTitle ?? event.name,
    description: (seoDescription ?? event.intro.promise ?? event.blurb).slice(0, 180),
    noindex: event.seo.noindex,
  });
}

export default async function EventTypePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { type } = await params;
  setRequestLocale(locale);

  const [event, t, tNav, tCommon, others, services, projects, config] = await Promise.all([
    getEventTypeDetail(type, locale),
    getTranslations('Events'),
    getTranslations('Nav'),
    getTranslations('Common'),
    getEventTypeList(locale),
    getServiceList(locale),
    getProjectList(locale, { eventType: type, page: 1 }),
    getSiteConfig(),
  ]);

  if (!event) notFound();

  const contact = toContactInfo(config);
  const tPortfolio = await getTranslations('Portfolio');
  const tWork = await getTranslations('Work');
  const photos = eventPhotos(type, locale);
  const featured = services.filter((s) => s.featured).slice(0, 6);

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('events'), path: '/events' },
    { name: event.name, path: `/events/${type}` },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />

      <PageHero
        trail={trail}
        title={event.name}
        intro={event.intro.promise || event.blurb}
        photo={photos.cover}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <QuoteCta label={tCommon('getQuote')} size="lg" />
          <WhatsAppCta
            label={tCommon('whatsapp')}
            size="lg"
            contact={contact}
            message={`Namaste Shree Shakti! I am planning a ${event.name.toLowerCase()}. Date: ___  Town: ___  Guests: ___`}
          />
        </div>
      </PageHero>

      {event.intro.paragraphs.length > 0 ? (
        <section className="theme-light section-pad">
          <div className="container-site">
            <Reveal className="max-w-3xl">
              {event.intro.paragraphs.map((paragraph, i) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className={
                    i === 0
                      ? 'font-display text-display-sm leading-snug font-medium text-ink'
                      : 'mt-6 text-base leading-relaxed text-muted-foreground'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {event.intro.needs.length > 0 ? (
        <ContentBlock title={t('needs')}>
          <RevealGroup className="grid gap-6 md:grid-cols-2">
            {event.intro.needs.map((need, i) => (
              <RevealItem key={need.title}>
                <div className="h-full border-t-2 border-gold/30 pt-5">
                  <span className="font-display text-2xl text-marigold tabular">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-medium text-ivory">{need.title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ivory-muted">
                    {need.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentBlock>
      ) : null}

      <ContentBlock title={t('services')} tone="light">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => {
            const Icon = serviceIcons[service.icon as ServiceIconName] ?? serviceIcons.event;
            return (
              <RevealItem key={service.slug}>
                <NavLink
                  href={servicePath(service.slug)}
                  className="group flex items-center gap-4 rounded-xl border border-gold/40 bg-card p-5 transition-colors hover:border-maroon/40"
                >
                  <Icon className="size-6 shrink-0 text-maroon" />
                  <span className="font-medium text-ink group-hover:text-maroon">
                    {service.short}
                  </span>
                </NavLink>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </ContentBlock>

      <section className="border-y border-gold/20 bg-ink-800 section-pad">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow text-gold">{tWork('galleryEyebrow')}</p>
            <h2 className="mt-4 font-display text-display-md font-medium text-ivory">
              {tWork('eventGallery')}
            </h2>
          </Reveal>
          <div className="mt-10">
            <WorkGallery photos={photos.gallery} itemLabel={tWork('photo')} layout="grid" />
          </div>
        </div>
      </section>

      {/* Until a project of this type is published, the photographs above do
          this band's job — an empty "recent work" note under them would only
          contradict them. */}
      {projects.projects.length > 0 ? (
        <ContentBlock title={t('recent')}>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.projects.slice(0, 3).map((project) => (
              <RevealItem key={project.slug}>
                <ProjectCard project={project} guestsLabel={tPortfolio('guests')} />
              </RevealItem>
            ))}
          </RevealGroup>
        </ContentBlock>
      ) : null}

      <ContentBlock title={t('all')} tone="light">
        <Reveal>
          <ul className="flex flex-wrap gap-2">
            {others
              .filter((other) => other.slug !== type)
              .map((other) => (
                <li key={other.slug}>
                  <NavLink
                    href={`/events/${other.slug}`}
                    className="inline-flex rounded-full border border-gold/50 px-5 py-2 text-[0.85rem] text-ink transition-colors hover:border-maroon hover:bg-maroon hover:text-ivory"
                  >
                    {other.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        </Reveal>
      </ContentBlock>

      <ClosingCta showCallButton />
    </>
  );
}
