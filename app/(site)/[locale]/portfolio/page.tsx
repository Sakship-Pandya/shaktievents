import type { Metadata } from 'next';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Texture } from '@/components/brand/texture';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { StyleExplorerGate } from '@/components/features/gates';
import { ClosingCta } from '@/components/sections/closing-cta';
import { Breadcrumbs } from '@/components/site/breadcrumbs';
import { JsonLd } from '@/components/site/json-ld';
import { Link } from '@/i18n/navigation';
import { getEventTypeList } from '@/lib/catalogue-data';
import { resolveLocale } from '@/lib/locale';
import {
  getFilterOptions,
  getProjectList,
  PROJECTS_PER_PAGE,
  type ProjectFilters,
} from '@/lib/projects-data';
import { breadcrumbSchema } from '@/lib/schema-org';
import { pageMetadata } from '@/lib/seo';
import { WorkGallery } from '@/components/site/work-gallery';
import { PhotoBackdrop } from '@/components/site/work-image';
import {
  allWorkPhotos,
  eventPhotos,
  galleryCategories,
  pagePhotos,
  workPhoto,
} from '@/lib/work-photos';
import { FilterBar } from './filter-bar';

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
};

const one = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

function toFilters(params: SearchParams): ProjectFilters {
  const year = Number(one(params.year));
  const page = Number(one(params.page));
  const sort = one(params.sort);

  return {
    eventType: one(params.eventType),
    service: one(params.service),
    year: Number.isFinite(year) && year > 1900 ? year : undefined,
    sort: sort === 'oldest' ? 'oldest' : 'latest',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function hasFilters(filters: ProjectFilters): boolean {
  return Boolean(
    filters.eventType ||
      filters.service ||
      filters.year ||
      filters.sort === 'oldest',
  );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Portfolio' });
  const filters = toFilters(await searchParams);

  return pageMetadata({
    locale,
    path: '/portfolio',
    title: t('hubTitle'),
    description: t('hubIntro'),
    noindex: hasFilters(filters) || (filters.page ?? 1) > 1,
  });
}

export default async function PortfolioPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);

  const filters = toFilters(await searchParams);
  const [t, tNav, { projects, total }, eventTypes, options] = await Promise.all([
    getTranslations('Portfolio'),
    getTranslations('Nav'),
    getProjectList(locale, filters),
    getEventTypeList(locale),
    getFilterOptions(locale),
  ]);

  const page = filters.page ?? 1;
  const pageCount = Math.max(1, Math.ceil(total / PROJECTS_PER_PAGE));
  const filtered = hasFilters(filters);
  const tWork = await getTranslations('Work');

  const trail = [
    { name: tNav('home'), path: '/' },
    { name: tNav('portfolio'), path: '/portfolio' },
  ];

  const selectedEventType = filters.eventType
    ? eventTypes.find((e) => e.slug === filters.eventType)
    : null;

  const pageHref = (n: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value && key !== 'page' && !(key === 'sort' && value === 'latest')) {
        next.set(key, String(value));
      }
    }
    if (n > 1) next.set('page', String(n));
    const qs = next.toString();
    return qs ? `/portfolio?${qs}` : '/portfolio';
  };

  const whenFormatter = new Intl.DateTimeFormat(locale === 'gu' ? 'gu-IN' : 'en-IN', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(locale, trail)]} />

      {/* Hero Section */}
      <section className="relative hero-under-header overflow-hidden pt-14 pb-16 md:pt-20 md:pb-28 lg:min-h-[34rem]">
        <PhotoBackdrop photo={workPhoto(pagePhotos.portfolio, locale)} priority />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,color-mix(in_oklab,var(--color-maroon)_70%,transparent)_0%,transparent_65%)]"
        />
        <Texture opacity={0.06} />
        <div className="relative container-site">
          <Breadcrumbs trail={trail} />
          <h1 className="mt-7 max-w-3xl font-display text-display-lg font-medium text-ivory">
            {t('hubTitle')}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-muted md:text-lg">
            {t('hubIntro')}
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-y border-gold/20 bg-ink-800 py-6">
        <div className="container-site">
          <FilterBar
            options={{
              ...options,
              eventTypes: eventTypes.map((e) => ({ slug: e.slug, name: e.name })),
            }}
            active={filtered}
            labels={{
              eventType: t('filterEventType'),
              service: t('filterService'),
              year: t('filterYear'),
              any: t('filterAny'),
              sort: t('sort'),
              sortLatest: t('sortLatest'),
              sortOldest: t('sortOldest'),
              clear: t('clearFilters'),
            }}
          />
        </div>
      </section>

      {/* Filtered Portfolio Showcase Grid */}
      <section className="bg-ink section-pad">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="eyebrow text-gold">
                {selectedEventType ? selectedEventType.name : t('filters')}
              </p>
              <h2 className="mt-2 font-display text-display-md font-medium text-ivory">
                {selectedEventType ? selectedEventType.name : t('hubTitle')}
              </h2>
            </div>
            <p className="text-sm text-ivory-muted">
              {t('showing', { count: total })}
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gold/40 px-6 py-20 text-center">
              <p className="text-lg font-medium text-ivory">
                {filtered ? t('emptyFiltered') : t('empty')}
              </p>
              <p className="mt-2 text-sm text-ivory-muted">
                Try selecting a different event type, service, or year to see our work.
              </p>
              {filtered ? (
                <div className="mt-6">
                  <Link
                    href="/portfolio"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-gold/40 px-5 text-sm font-semibold text-ivory transition-colors hover:border-gold hover:text-marigold"
                  >
                    {t('clearFilters')}
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, i) => {
                  const eventTitle = project.eventType?.name ?? selectedEventType?.name ?? 'Event';
                  const fallbackCover = project.eventType?.slug
                    ? eventPhotos(project.eventType.slug, locale).cover.src
                    : null;
                  const imageUrl = project.cover?.url || fallbackCover;
                  const imageAlt = project.cover?.alt || project.title;

                  const dateFormatted = project.eventDate
                    ? whenFormatter.format(new Date(project.eventDate))
                    : null;

                  return (
                    <RevealItem key={project.slug}>
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/25 bg-ink-800 transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={imageAlt}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              priority={i < 3 && page === 1}
                              className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.05]"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-gold/40">
                              <ImageOff className="size-8" aria-hidden />
                            </span>
                          )}

                          <div
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-50"
                          />

                          {/* Event Title Badge from Event Type Section */}
                          <span className="absolute top-3 left-3 rounded-full border border-gold/30 bg-ink/85 px-3 py-1 text-[0.7rem] font-semibold tracking-wider text-marigold uppercase backdrop-blur-md">
                            {eventTitle}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-xl font-medium text-ivory transition-colors group-hover:text-marigold">
                              {project.title}
                            </h3>
                            <ArrowUpRight className="mt-1 size-4 shrink-0 text-gold/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-marigold" />
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-gold/10 text-xs text-ivory-muted">
                            {dateFormatted ? <span>{dateFormatted}</span> : null}
                            {project.guests ? (
                              <span>
                                {dateFormatted ? '· ' : ''}
                                {project.guests.toLocaleString('en-IN')} {t('guests')}
                              </span>
                            ) : null}
                            {project.services.length > 0 ? (
                              <span className="truncate">
                                · {project.services.map((s) => s.name).slice(0, 2).join(', ')}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    </RevealItem>
                  );
                })}
              </RevealGroup>

              {/* Pagination */}
              {pageCount > 1 ? (
                <nav
                  aria-label={t('showing', { count: total })}
                  className="mt-12 flex items-center justify-between gap-4 border-t border-gold/15 pt-8"
                >
                  {page > 1 ? (
                    <Link
                      href={pageHref(page - 1)}
                      rel="prev"
                      className="rounded-full border border-gold/35 px-5 py-2.5 text-sm text-ivory transition-colors hover:border-gold hover:text-marigold"
                    >
                      ← {t('previous')}
                    </Link>
                  ) : (
                    <span />
                  )}

                  <span className="text-sm text-ivory-muted">
                    {t('pageOf', { page, total: pageCount })}
                  </span>

                  {page < pageCount ? (
                    <Link
                      href={pageHref(page + 1)}
                      rel="next"
                      className="rounded-full border border-gold/35 px-5 py-2.5 text-sm text-ivory transition-colors hover:border-gold hover:text-marigold"
                    >
                      {t('next')} →
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              ) : null}
            </>
          )}
        </div>
      </section>

      {/* Full Work Photography Explorer */}
      <section
        id="photographs"
        className="scroll-mt-24 border-t border-gold/20 bg-ink-800 section-pad"
      >
        <div className="container-site">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-gold">{tWork('galleryEyebrow')}</p>
            <h2 className="mt-4 font-display text-display-md font-medium text-ivory">
              {tWork('galleryTitle')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ivory-muted">
              {tWork('galleryIntro')}
            </p>
          </Reveal>
          <div className="mt-10">
            <WorkGallery
              photos={allWorkPhotos(locale)}
              filters={galleryCategories.map((category) => ({
                key: category.key,
                label: tWork(`categories.${category.key}`),
                tags: category.tags,
              }))}
              allLabel={tWork('all')}
              itemLabel={tWork('photo')}
              moreLabel={tWork('showMore')}
              initial={20}
            />
          </div>
        </div>
      </section>

      <StyleExplorerGate />

      <ClosingCta showCallButton />
    </>
  );
}
