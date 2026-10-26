import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServiceForm, type ServiceFormValues } from '../service-form';
import { db } from '@/lib/db';
import {
  EMPTY_SEO,
  inclusionsSchema,
  optionsSchema,
  parseOr,
  pricingSchema,
  seoSchema,
  serviceContentSchema,
  specsSchema,
  type ServiceContent,
} from '@/lib/schemas/service-content';
import { servicePath } from '@/lib/services';

export const metadata: Metadata = { title: 'Edit service' };
export const dynamic = 'force-dynamic';

const EMPTY_CONTENT: ServiceContent = { promise: '', intro: '', process: [], closing: null };

/** Json columns come back untyped; parse them into the shapes the form expects. */
function toRows(values: Record<string, unknown>[]): Record<string, string>[] {
  return values.map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v == null ? '' : String(v)])),
  );
}

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const service = await db.service.findUnique({ where: { slug } });
  if (!service) notFound();

  const contentEn = service.contentEn
    ? parseOr(serviceContentSchema, service.contentEn, EMPTY_CONTENT)
    : EMPTY_CONTENT;
  const contentGu = service.contentGu
    ? parseOr(serviceContentSchema, service.contentGu, EMPTY_CONTENT)
    : EMPTY_CONTENT;
  const pricing = service.pricing
    ? parseOr(pricingSchema, service.pricing, {
        fromInr: null,
        unitEn: '',
        unitGu: '',
        factors: [],
      })
    : { fromInr: null, unitEn: '', unitGu: '', factors: [] };
  const seo = parseOr(seoSchema, service.seo, EMPTY_SEO);

  const values: ServiceFormValues = {
    slug: service.slug,
    scalars: {
      nameEn: service.nameEn,
      nameGu: service.nameGu,
      shortEn: service.shortEn,
      shortGu: service.shortGu,
      summaryEn: service.summaryEn,
      summaryGu: service.summaryGu,
      promiseEn: contentEn.promise,
      promiseGu: contentGu.promise,
      introEn: contentEn.intro,
      introGu: contentGu.intro,
      closingEn: contentEn.closing ?? '',
      closingGu: contentGu.closing ?? '',
      fromInr: pricing.fromInr == null ? '' : String(pricing.fromInr),
      unitEn: pricing.unitEn,
      unitGu: pricing.unitGu,
      seoTitleEn: seo.titleEn ?? '',
      seoTitleGu: seo.titleGu ?? '',
      seoDescriptionEn: seo.descriptionEn ?? '',
      seoDescriptionGu: seo.descriptionGu ?? '',
      order: String(service.order),
    },
    flags: { featured: service.featured, isActive: service.isActive, noindex: seo.noindex },
    rows: {
      inclusions: toRows(parseOr(inclusionsSchema, service.inclusions, [])),
      options: toRows(parseOr(optionsSchema, service.options, [])),
      specs: toRows(parseOr(specsSchema, service.specs, [])),
      factors: toRows(pricing.factors),
      processEn: toRows(contentEn.process),
      processGu: toRows(contentGu.process),
    },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-maroon"
      >
        <ArrowLeft className="size-4" />
        All services
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-display-md font-medium text-ink">{service.nameEn}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <code className="rounded bg-sand px-1.5 py-0.5 text-xs">{servicePath(slug)}</code>
          </p>
        </div>
        <a
          href={servicePath(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-maroon"
        >
          View page ↗
        </a>
      </div>

      <ServiceForm values={values} />
    </div>
  );
}
