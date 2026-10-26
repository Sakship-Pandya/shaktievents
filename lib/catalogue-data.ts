import { unstable_cache } from 'next/cache';
import type { Locale } from '@/i18n/routing';
import { db } from './db';
import {
  eventIntroSchema,
  EMPTY_EVENT_INTRO,
  type EventIntro,
} from './schemas/page-content';
import { EMPTY_SEO, parseOr, seoSchema, type Seo } from './schemas/service-content';

const pick = <T>(locale: Locale, en: T, gu: T): T => (locale === 'gu' ? gu : en);

/* ------------------------------------------------------------ event types */

export type EventTypeCard = { slug: string; name: string; blurb: string; icon: string };

export type EventTypeDetail = EventTypeCard & { intro: EventIntro; seo: Seo };

export const getEventTypeList = unstable_cache(
  async (locale: Locale): Promise<EventTypeCard[]> => {
    const rows = await db.eventType.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { slug: true, nameEn: true, nameGu: true, blurbEn: true, blurbGu: true, icon: true },
    });
    return rows.map((r) => ({
      slug: r.slug,
      name: pick(locale, r.nameEn, r.nameGu),
      blurb: pick(locale, r.blurbEn, r.blurbGu),
      icon: r.icon,
    }));
  },
  ['event-type-list'],
  { tags: ['event-types'], revalidate: 3600 },
);

export const getEventTypeDetail = unstable_cache(
  async (slug: string, locale: Locale): Promise<EventTypeDetail | null> => {
    const row = await db.eventType.findFirst({ where: { slug, isActive: true } });
    if (!row) return null;

    return {
      slug: row.slug,
      name: pick(locale, row.nameEn, row.nameGu),
      blurb: pick(locale, row.blurbEn, row.blurbGu),
      icon: row.icon,
      intro: parseOr(eventIntroSchema, pick(locale, row.introEn, row.introGu), EMPTY_EVENT_INTRO),
      seo: parseOr(seoSchema, row.seo, EMPTY_SEO),
    };
  },
  ['event-type-detail'],
  { tags: ['event-types'], revalidate: 3600 },
);

export const getEventTypeSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await db.eventType.findMany({ where: { isActive: true }, select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ['event-type-slugs'],
  { tags: ['event-types'], revalidate: 3600 },
);

/* ----------------------------------------------------------- testimonials */

export type TestimonialCard = {
  id: string;
  kind: 'TEXT' | 'VIDEO';
  authorName: string;
  authorRole: string | null;
  town: string | null;
  quote: string | null;
  rating: number | null;
  videoUrl: string | null;
  sourceUrl: string | null;
  serviceSlugs: string[];
  eventTypeSlug: string | null;
};

export const getTestimonials = unstable_cache(
  async (locale: Locale, serviceSlug?: string): Promise<TestimonialCard[]> => {
    const rows = await db.testimonial.findMany({
      where: {
        status: 'PUBLISHED',
        ...(serviceSlug ? { services: { some: { slug: serviceSlug } } } : {}),
      },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      include: {
        services: { select: { slug: true } },
        eventType: { select: { slug: true } },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      authorName: row.authorName,
      authorRole: row.authorRole,
      town: row.town,
      quote: pick(locale, row.quoteEn, row.quoteGu),
      rating: row.rating,
      videoUrl: row.videoUrl,
      sourceUrl: row.sourceUrl,
      serviceSlugs: row.services.map((s) => s.slug),
      eventTypeSlug: row.eventType?.slug ?? null,
    }));
  },
  ['testimonials'],
  { tags: ['testimonials'], revalidate: 3600 },
);

/* -------------------------------------------------------------------- faq */

export type FaqItem = { question: string; answer: string };

export const getGlobalFaqs = unstable_cache(
  async (locale: Locale): Promise<FaqItem[]> => {
    const rows = await db.faq.findMany({
      where: { isActive: true, scope: { in: ['GLOBAL', 'HOME'] } },
      orderBy: { order: 'asc' },
    });
    return rows.map((row) => ({
      question: pick(locale, row.questionEn, row.questionGu),
      answer: pick(locale, row.answerEn, row.answerGu),
    }));
  },
  ['global-faqs'],
  { tags: ['faqs'], revalidate: 3600 },
);

/** Every active FAQ, grouped by the service it belongs to (or "general"). */
export const getAllFaqs = unstable_cache(
  async (locale: Locale): Promise<{ heading: string; items: FaqItem[] }[]> => {
    const rows = await db.faq.findMany({
      where: { isActive: true },
      orderBy: [{ scope: 'asc' }, { order: 'asc' }],
      include: { service: { select: { nameEn: true, nameGu: true } } },
    });

    const groups = new Map<string, FaqItem[]>();
    for (const row of rows) {
      const heading = row.service ? pick(locale, row.service.nameEn, row.service.nameGu) : '';
      const list = groups.get(heading) ?? [];
      list.push({
        question: pick(locale, row.questionEn, row.questionGu),
        answer: pick(locale, row.answerEn, row.answerGu),
      });
      groups.set(heading, list);
    }

    // General questions first, then one group per service.
    return [...groups.entries()]
      .sort((a, b) => (a[0] === '' ? -1 : b[0] === '' ? 1 : a[0].localeCompare(b[0])))
      .map(([heading, items]) => ({ heading, items }));
  },
  ['all-faqs'],
  { tags: ['faqs'], revalidate: 3600 },
);

/* ----------------------------------------------------------------- videos */

export type VideoCard = { id: string; title: string; youtubeId: string; category: string | null };

export const getVideos = unstable_cache(
  async (locale: Locale): Promise<VideoCard[]> => {
    const rows = await db.video.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      title: pick(locale, row.titleEn, row.titleGu),
      youtubeId: row.youtubeId,
      category: row.category,
    }));
  },
  ['videos'],
  { tags: ['videos'], revalidate: 3600 },
);

/* ---------------------------------------------------------------- clients */

export type ClientLogo = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
};

export const getClients = unstable_cache(
  async (locale: Locale): Promise<ClientLogo[]> => {
    const rows = await db.client.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      name: pick(locale, row.nameEn, row.nameGu),
      logoUrl: row.logoUrl,
      website: row.website,
    }));
  },
  ['clients'],
  { tags: ['clients'], revalidate: 3600 },
);
