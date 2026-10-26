import { unstable_cache } from 'next/cache';
import type { Locale } from '@/i18n/routing';
import { db } from './db';
import {
  EMPTY_DOC,
  readingMinutes,
  richTextSchema,
  tableOfContents,
  toPlainText,
  type RichText,
  type TocEntry,
} from './schemas/rich-text';
import { EMPTY_SEO, parseOr, seoSchema, type Seo } from './schemas/service-content';

const pick = <T>(locale: Locale, en: T, gu: T): T => (locale === 'gu' ? gu : en);

export type BlogCard = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: { slug: string; name: string } | null;
  publishedAt: string | null;
  readMinutes: number;
  coverUrl: string | null;
};

export type BlogDetail = BlogCard & {
  body: RichText;
  toc: TocEntry[];
  plainText: string;
  author: string | null;
  updatedAt: string;
  seo: Seo;
};

const cardSelect = {
  slug: true,
  titleEn: true,
  titleGu: true,
  excerptEn: true,
  excerptGu: true,
  coverUrl: true,
  publishedAt: true,
  readMinutes: true,
  bodyEn: true,
  bodyGu: true,
  category: { select: { slug: true, nameEn: true, nameGu: true } },
} as const;

type CardRow = {
  slug: string;
  titleEn: string;
  titleGu: string;
  excerptEn: string | null;
  excerptGu: string | null;
  coverUrl: string | null;
  publishedAt: Date | null;
  readMinutes: number | null;
  bodyEn: unknown;
  bodyGu: unknown;
  category: { slug: string; nameEn: string; nameGu: string } | null;
};

function toCard(locale: Locale, row: CardRow): BlogCard {
  const body = parseOr(richTextSchema, pick(locale, row.bodyEn, row.bodyGu), EMPTY_DOC);

  return {
    slug: row.slug,
    title: pick(locale, row.titleEn, row.titleGu),
    excerpt: pick(locale, row.excerptEn, row.excerptGu),
    category: row.category
      ? { slug: row.category.slug, name: pick(locale, row.category.nameEn, row.category.nameGu) }
      : null,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    // The stored value wins if set; otherwise it is derived from the body, so
    // a post never shows a reading time that contradicts its length.
    readMinutes: row.readMinutes ?? readingMinutes(body),
    coverUrl: row.coverUrl,
  };
}

export const getBlogList = unstable_cache(
  async (locale: Locale, categorySlug?: string): Promise<BlogCard[]> => {
    const rows = await db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: cardSelect,
    });
    return (rows as CardRow[]).map((row) => toCard(locale, row));
  },
  ['blog-list'],
  { tags: ['blog'], revalidate: 3600 },
);

export const getBlogCategories = unstable_cache(
  async (locale: Locale): Promise<{ slug: string; name: string; count: number }[]> => {
    const rows = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
    });
    return rows
      .map((row) => ({
        slug: row.slug,
        name: pick(locale, row.nameEn, row.nameGu),
        count: row._count.posts,
      }))
      .filter((row) => row.count > 0);
  },
  ['blog-categories'],
  { tags: ['blog'], revalidate: 3600 },
);

export const getBlogPost = unstable_cache(
  async (slug: string, locale: Locale): Promise<BlogDetail | null> => {
    const row = await db.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        ...cardSelect,
        updatedAt: true,
        seo: true,
        author: { select: { name: true } },
      },
    });
    if (!row) return null;

    const body = parseOr(richTextSchema, pick(locale, row.bodyEn, row.bodyGu), EMPTY_DOC);

    return {
      ...toCard(locale, row as unknown as CardRow),
      body,
      toc: tableOfContents(body),
      plainText: toPlainText(body),
      author: row.author?.name ?? null,
      updatedAt: row.updatedAt.toISOString(),
      seo: parseOr(seoSchema, row.seo, EMPTY_SEO),
    };
  },
  ['blog-post'],
  { tags: ['blog'], revalidate: 3600 },
);

export const getBlogSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
  ['blog-slugs'],
  { tags: ['blog'], revalidate: 3600 },
);
