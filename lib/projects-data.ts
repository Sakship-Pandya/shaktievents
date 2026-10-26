import { unstable_cache } from 'next/cache';
import type { Locale } from '@/i18n/routing';
import { db } from './db';
import {
  EMPTY_BRIEF,
  EMPTY_WORK,
  projectBriefSchema,
  projectWorkSchema,
  type ProjectBrief,
  type ProjectWork,
} from './schemas/project-content';
import { EMPTY_SEO, parseOr, seoSchema, type Seo } from './schemas/service-content';

export type MediaItem = {
  id: string;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  isPlaceholder: boolean;
};

export type ProjectCard = {
  slug: string;
  title: string;
  cover: MediaItem | null;
  eventType: { slug: string; name: string } | null;
  services: { slug: string; name: string }[];
  guests: number | null;
  days: number | null;
  eventDate: string | null;
  featured: boolean;
};

export type ProjectDetail = ProjectCard & {
  brief: ProjectBrief;
  work: ProjectWork;
  gallery: MediaItem[];
  before: MediaItem | null;
  after: MediaItem | null;
  videoUrls: string[];
  panoramaUrl: string | null;
  venue: string | null;
  areaSqft: number | null;
  clientQuote: string | null;
  clientName: string | null;
  seo: Seo;
};

export type ProjectFilters = {
  eventType?: string;
  service?: string;
  year?: number;
  minGuests?: number;
  sort?: 'latest' | 'oldest' | 'largest';
  page?: number;
};

export const PROJECTS_PER_PAGE = 12;

const pick = <T>(locale: Locale, en: T, gu: T): T => (locale === 'gu' ? gu : en);

type MediaRow = {
  id: string;
  url: string;
  altEn: string | null;
  altGu: string | null;
  width: number | null;
  height: number | null;
  isPlaceholder: boolean;
};

function toMedia(locale: Locale, row: MediaRow | null): MediaItem | null {
  if (!row) return null;
  return {
    id: row.id,
    url: row.url,
    // Alt text is decorative-empty rather than a filename when unset — a bad
    // alt is worse for a screen reader than none.
    alt: pick(locale, row.altEn, row.altGu) ?? row.altEn ?? '',
    width: row.width,
    height: row.height,
    isPlaceholder: row.isPlaceholder,
  };
}

const mediaSelect = {
  id: true,
  url: true,
  altEn: true,
  altGu: true,
  width: true,
  height: true,
  isPlaceholder: true,
} as const;

const cardSelect = {
  slug: true,
  titleEn: true,
  titleGu: true,
  guests: true,
  days: true,
  eventDate: true,
  featured: true,
  cover: { select: mediaSelect },
  eventType: { select: { slug: true, nameEn: true, nameGu: true } },
  services: { select: { slug: true, shortEn: true, shortGu: true }, orderBy: { order: 'asc' } },
} as const;

type CardRow = {
  slug: string;
  titleEn: string;
  titleGu: string;
  guests: number | null;
  days: number | null;
  eventDate: Date | null;
  featured: boolean;
  cover: MediaRow | null;
  eventType: { slug: string; nameEn: string; nameGu: string } | null;
  services: { slug: string; shortEn: string; shortGu: string }[];
};

function toCard(locale: Locale, row: CardRow): ProjectCard {
  return {
    slug: row.slug,
    title: pick(locale, row.titleEn, row.titleGu),
    cover: toMedia(locale, row.cover),
    eventType: row.eventType
      ? { slug: row.eventType.slug, name: pick(locale, row.eventType.nameEn, row.eventType.nameGu) }
      : null,
    services: row.services.map((s) => ({
      slug: s.slug,
      name: pick(locale, s.shortEn, s.shortGu),
    })),
    guests: row.guests,
    days: row.days,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    featured: row.featured,
  };
}

/** Only PUBLISHED projects ever reach the public site. */
function whereFor(filters: ProjectFilters) {
  const where: Record<string, unknown> = { status: 'PUBLISHED' };

  if (filters.eventType) where.eventType = { slug: filters.eventType };
  if (filters.service) where.services = { some: { slug: filters.service } };
  if (filters.minGuests) where.guests = { gte: filters.minGuests };
  if (filters.year) {
    where.eventDate = {
      gte: new Date(Date.UTC(filters.year, 0, 1)),
      lt: new Date(Date.UTC(filters.year + 1, 0, 1)),
    };
  }

  return where;
}

async function loadProjectList(
  locale: Locale,
  filters: ProjectFilters,
): Promise<{ projects: ProjectCard[]; total: number }> {
  const page = Math.max(1, filters.page ?? 1);
  const where = whereFor(filters);

  const orderBy =
    filters.sort === 'oldest'
      ? [{ eventDate: 'asc' as const }, { order: 'asc' as const }]
      : filters.sort === 'largest'
        ? [{ guests: 'desc' as const }, { eventDate: 'desc' as const }]
        : [{ eventDate: 'desc' as const }, { order: 'asc' as const }];

  const [rows, total] = await Promise.all([
    db.project.findMany({
      where,
      orderBy,
      skip: (page - 1) * PROJECTS_PER_PAGE,
      take: PROJECTS_PER_PAGE,
      select: cardSelect,
    }),
    db.project.count({ where }),
  ]);

  return { projects: (rows as CardRow[]).map((row) => toCard(locale, row)), total };
}

export const getProjectList = unstable_cache(loadProjectList, ['project-list'], {
  tags: ['projects'],
  revalidate: 3600,
});

async function loadProjectDetail(slug: string, locale: Locale): Promise<ProjectDetail | null> {
  const row = await db.project.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      ...cardSelect,
      briefEn: true,
      briefGu: true,
      workEn: true,
      workGu: true,
      videoUrls: true,
      panoramaUrl: true,
      venue: true,
      areaSqft: true,
      clientQuoteEn: true,
      clientQuoteGu: true,
      clientName: true,
      seo: true,
      media: {
        orderBy: { order: 'asc' },
        select: { role: true, order: true, media: { select: mediaSelect } },
      },
    },
  });

  if (!row) return null;

  const gallery = row.media
    .filter((m) => m.role === 'GALLERY')
    .map((m) => toMedia(locale, m.media))
    .filter((m): m is MediaItem => m !== null);

  const findRole = (role: 'BEFORE' | 'AFTER') =>
    toMedia(locale, row.media.find((m) => m.role === role)?.media ?? null);

  return {
    ...toCard(locale, row as unknown as CardRow),
    brief: parseOr(projectBriefSchema, pick(locale, row.briefEn, row.briefGu), EMPTY_BRIEF),
    work: parseOr(projectWorkSchema, pick(locale, row.workEn, row.workGu), EMPTY_WORK),
    gallery,
    before: findRole('BEFORE'),
    after: findRole('AFTER'),
    videoUrls: row.videoUrls,
    panoramaUrl: row.panoramaUrl,
    venue: row.venue,
    areaSqft: row.areaSqft,
    clientQuote: pick(locale, row.clientQuoteEn, row.clientQuoteGu),
    clientName: row.clientName,
    seo: parseOr(seoSchema, row.seo, EMPTY_SEO),
  };
}

export const getProjectDetail = unstable_cache(loadProjectDetail, ['project-detail'], {
  tags: ['projects'],
  revalidate: 3600,
});

/** Feeds the "Recent work" block on a service page. */
async function loadProjectsForService(
  serviceSlug: string,
  locale: Locale,
  limit: number,
): Promise<ProjectCard[]> {
  const rows = await db.project.findMany({
    where: { status: 'PUBLISHED', services: { some: { slug: serviceSlug } } },
    orderBy: [{ featured: 'desc' }, { eventDate: 'desc' }],
    take: limit,
    select: cardSelect,
  });

  return (rows as CardRow[]).map((row) => toCard(locale, row));
}

export const getProjectsForService = unstable_cache(loadProjectsForService, ['projects-service'], {
  tags: ['projects'],
  revalidate: 3600,
});

export const getProjectSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await db.project.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
  ['project-slugs'],
  { tags: ['projects'], revalidate: 3600 },
);

export type FilterOptions = {
  eventTypes: { slug: string; name: string }[];
  services: { slug: string; name: string }[];
  years: number[];
};

/** Only offers filters that would actually return something. */
async function loadFilterOptions(locale: Locale): Promise<FilterOptions> {
  const [rows, allEventTypes, allServices] = await Promise.all([
    db.project.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        eventDate: true,
      },
    }),
    db.eventType.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { slug: true, nameEn: true, nameGu: true },
    }),
    db.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { slug: true, shortEn: true, shortGu: true },
    }),
  ]);

  const eventTypes = allEventTypes.map((e) => ({
    slug: e.slug,
    name: pick(locale, e.nameEn, e.nameGu),
  }));

  const services = allServices.map((s) => ({
    slug: s.slug,
    name: pick(locale, s.shortEn, s.shortGu),
  }));

  const years = new Set<number>();
  for (const row of rows) {
    if (row.eventDate) years.add(row.eventDate.getUTCFullYear());
  }
  if (years.size === 0) {
    years.add(new Date().getFullYear());
  }

  return {
    eventTypes,
    services,
    years: [...years].sort((a, b) => b - a),
  };
}

export const getFilterOptions = unstable_cache(loadFilterOptions, ['project-filters'], {
  tags: ['projects'],
  revalidate: 3600,
});
