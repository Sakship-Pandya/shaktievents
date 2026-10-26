import { unstable_cache } from 'next/cache';
import type { Locale } from '@/i18n/routing';
import { db } from './db';
import {
  EMPTY_SEO,
  inclusionsSchema,
  optionsSchema,
  parseOr,
  pricingSchema,
  seoSchema,
  serviceContentSchema,
  specsSchema,
  type Seo,
  type ServiceContent,
  type ServicePricing,
} from './schemas/service-content';

/**
 * Reads services out of the database and parses their Json columns into
 * shapes the page can rely on. Anything that fails validation falls back to
 * an empty value, so a half-filled row renders a shorter page rather than
 * throwing.
 */
export type ServiceListItem = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  icon: string;
  featured: boolean;
};

export type ServiceDetail = ServiceListItem & {
  content: ServiceContent | null;
  inclusions: { en: string; gu: string }[];
  options: { nameEn: string; nameGu: string; descEn: string; descGu: string }[];
  specs: { labelEn: string; labelGu: string; value: string }[];
  pricing: ServicePricing | null;
  seo: Seo;
  faqs: { question: string; answer: string }[];
};

const EMPTY_CONTENT: ServiceContent = {
  promise: '',
  intro: '',
  process: [],
  closing: null,
};

function pickLocale<T>(locale: Locale, en: T, gu: T): T {
  return locale === 'gu' ? gu : en;
}

async function loadServiceList(locale: Locale): Promise<ServiceListItem[]> {
  const rows = await db.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      slug: true,
      nameEn: true,
      nameGu: true,
      shortEn: true,
      shortGu: true,
      summaryEn: true,
      summaryGu: true,
      icon: true,
      featured: true,
    },
  });

  return rows.map((row) => ({
    slug: row.slug,
    name: pickLocale(locale, row.nameEn, row.nameGu),
    short: pickLocale(locale, row.shortEn, row.shortGu),
    summary: pickLocale(locale, row.summaryEn, row.summaryGu),
    icon: row.icon,
    featured: row.featured,
  }));
}

export const getServiceList = unstable_cache(loadServiceList, ['service-list'], {
  tags: ['services'],
  revalidate: 3600,
});

async function loadServiceDetail(slug: string, locale: Locale): Promise<ServiceDetail | null> {
  const row = await db.service.findFirst({
    where: { slug, isActive: true },
    include: {
      faqs: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: { questionEn: true, questionGu: true, answerEn: true, answerGu: true },
      },
    },
  });

  if (!row) return null;

  const content = pickLocale(locale, row.contentEn, row.contentGu);

  return {
    slug: row.slug,
    name: pickLocale(locale, row.nameEn, row.nameGu),
    short: pickLocale(locale, row.shortEn, row.shortGu),
    summary: pickLocale(locale, row.summaryEn, row.summaryGu),
    icon: row.icon,
    featured: row.featured,
    content: content ? parseOr(serviceContentSchema, content, EMPTY_CONTENT) : null,
    inclusions: parseOr(inclusionsSchema, row.inclusions, []),
    options: parseOr(optionsSchema, row.options, []),
    specs: parseOr(specsSchema, row.specs, []),
    pricing: row.pricing ? parseOr(pricingSchema, row.pricing, null as never) : null,
    seo: parseOr(seoSchema, row.seo, EMPTY_SEO),
    faqs: row.faqs.map((faq) => ({
      question: pickLocale(locale, faq.questionEn, faq.questionGu),
      answer: pickLocale(locale, faq.answerEn, faq.answerGu),
    })),
  };
}

export const getServiceDetail = unstable_cache(loadServiceDetail, ['service-detail'], {
  tags: ['services'],
  revalidate: 3600,
});

/** Slugs for generateStaticParams — active services only. */
export const getServiceSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await db.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
  ['service-slugs'],
  { tags: ['services'], revalidate: 3600 },
);
