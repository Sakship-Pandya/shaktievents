import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EventTypeForm, type EventValues } from '../event-form';
import { db } from '@/lib/db';
import { EMPTY_EVENT_INTRO, eventIntroSchema } from '@/lib/schemas/page-content';
import { EMPTY_SEO, parseOr, seoSchema } from '@/lib/schemas/service-content';

export const metadata: Metadata = { title: 'Edit event type' };
export const dynamic = 'force-dynamic';

export default async function EditEventTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await db.eventType.findUnique({ where: { slug } });
  if (!row) notFound();

  const introEn = parseOr(eventIntroSchema, row.introEn, EMPTY_EVENT_INTRO);
  const introGu = parseOr(eventIntroSchema, row.introGu, EMPTY_EVENT_INTRO);
  const seo = parseOr(seoSchema, row.seo, EMPTY_SEO);

  const values: EventValues = {
    slug: row.slug,
    scalars: {
      nameEn: row.nameEn,
      nameGu: row.nameGu,
      blurbEn: row.blurbEn,
      blurbGu: row.blurbGu,
      promiseEn: introEn.promise,
      promiseGu: introGu.promise,
      order: String(row.order),
      seoTitleEn: seo.titleEn ?? '',
      seoTitleGu: seo.titleGu ?? '',
      seoDescriptionEn: seo.descriptionEn ?? '',
      seoDescriptionGu: seo.descriptionGu ?? '',
    },
    flags: { isActive: row.isActive, noindex: seo.noindex },
    rows: {
      paragraphsEn: introEn.paragraphs.map((text) => ({ text })),
      paragraphsGu: introGu.paragraphs.map((text) => ({ text })),
      needsEn: introEn.needs.map((n) => ({ title: n.title, body: n.body })),
      needsGu: introGu.needs.map((n) => ({ title: n.title, body: n.body })),
    },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/event-types"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-maroon"
      >
        <ArrowLeft className="size-4" />
        All event types
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-display-md font-medium text-ink">{row.nameEn}</h1>
        <a
          href={`/events/${row.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-maroon"
        >
          View page ↗
        </a>
      </div>

      <EventTypeForm values={values} />
    </div>
  );
}
