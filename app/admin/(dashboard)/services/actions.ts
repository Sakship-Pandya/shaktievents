'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { locales } from '@/i18n/routing';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { readRows } from '@/lib/form-rows';
import {
  inclusionsSchema,
  optionsSchema,
  pricingSchema,
  seoSchema,
  serviceContentSchema,
  specsSchema,
} from '@/lib/schemas/service-content';
import { localizedPath } from '@/lib/seo';
import { servicePath } from '@/lib/services';
import type { Prisma } from '@/lib/generated/prisma/client';

export type ServiceState = { ok: boolean; message: string | null };

const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? null : t;
};

const scalarSchema = z.object({
  nameEn: z.string().trim().min(2).max(120),
  nameGu: z.string().trim().min(2).max(120),
  shortEn: z.string().trim().min(2).max(60),
  shortGu: z.string().trim().min(2).max(60),
  summaryEn: z.string().trim().min(20).max(400),
  summaryGu: z.string().trim().min(20).max(400),
  order: z.coerce.number().int().min(0).max(99),
  featured: z.boolean(),
  isActive: z.boolean(),
  fromInr: z.preprocess(
    (v) => (blankToNull(v) === null ? null : Number(v)),
    z.number().int().positive().nullable(),
  ),
  seoTitleEn: z.preprocess(blankToNull, z.string().max(70).nullable()),
  seoTitleGu: z.preprocess(blankToNull, z.string().max(70).nullable()),
  seoDescriptionEn: z.preprocess(blankToNull, z.string().max(180).nullable()),
  seoDescriptionGu: z.preprocess(blankToNull, z.string().max(180).nullable()),
  noindex: z.boolean(),
});

/** A service change touches its own page and the hub, in both locales. */
function refresh(slug: string) {
  // Revalidate admin pages synchronously so current view updates immediately
  revalidatePath('/admin/services');
  revalidatePath(`/admin/services/${slug}`);

  // Revalidate public pages and cache tags in the background to avoid stalling the admin action
  after(() => {
    revalidateTag('services');
    for (const locale of locales) {
      revalidatePath(localizedPath(locale, servicePath(slug)));
      revalidatePath(localizedPath(locale, '/services'));
      revalidatePath(localizedPath(locale, '/'));
    }
  });
}

export async function saveService(_prev: ServiceState, formData: FormData): Promise<ServiceState> {
  const user = await requireUser();

  const slug = String(formData.get('slug') ?? '');
  const existing = await db.service.findUnique({ where: { slug }, select: { id: true } });
  if (!existing) return { ok: false, message: 'That service no longer exists.' };

  const scalars = scalarSchema.safeParse({
    nameEn: formData.get('nameEn'),
    nameGu: formData.get('nameGu'),
    shortEn: formData.get('shortEn'),
    shortGu: formData.get('shortGu'),
    summaryEn: formData.get('summaryEn'),
    summaryGu: formData.get('summaryGu'),
    order: formData.get('order'),
    featured: formData.get('featured') !== null,
    isActive: formData.get('isActive') !== null,
    fromInr: formData.get('fromInr'),
    seoTitleEn: formData.get('seoTitleEn'),
    seoTitleGu: formData.get('seoTitleGu'),
    seoDescriptionEn: formData.get('seoDescriptionEn'),
    seoDescriptionGu: formData.get('seoDescriptionGu'),
    noindex: formData.get('noindex') !== null,
  });

  if (!scalars.success) {
    return { ok: false, message: scalars.error.issues[0]?.message ?? 'Check the fields.' };
  }

  // Long-form copy, one object per language.
  const buildContent = (suffix: 'En' | 'Gu') =>
    serviceContentSchema.safeParse({
      promise: String(formData.get(`promise${suffix}`) ?? ''),
      intro: String(formData.get(`intro${suffix}`) ?? ''),
      process: readRows(formData, `process${suffix}`, ['title', 'body']),
      closing: blankToNull(formData.get(`closing${suffix}`)),
    });

  const contentEn = buildContent('En');
  const contentGu = buildContent('Gu');
  if (!contentEn.success) {
    return { ok: false, message: `English copy: ${contentEn.error.issues[0]?.message}` };
  }
  if (!contentGu.success) {
    return { ok: false, message: `Gujarati copy: ${contentGu.error.issues[0]?.message}` };
  }

  const inclusions = inclusionsSchema.safeParse(readRows(formData, 'inclusions', ['en', 'gu']));
  const options = optionsSchema.safeParse(
    readRows(formData, 'options', ['nameEn', 'nameGu', 'descEn', 'descGu']),
  );
  const specs = specsSchema.safeParse(readRows(formData, 'specs', ['labelEn', 'labelGu', 'value']));
  const factors = readRows(formData, 'factors', ['en', 'gu']);

  for (const [label, result] of [
    ['Inclusions', inclusions],
    ['Options', options],
    ['Specs', specs],
  ] as const) {
    if (!result.success) {
      return { ok: false, message: `${label}: ${result.error.issues[0]?.message}` };
    }
  }

  const pricing = pricingSchema.safeParse({
    fromInr: scalars.data.fromInr,
    unitEn: String(formData.get('unitEn') ?? ''),
    unitGu: String(formData.get('unitGu') ?? ''),
    factors,
  });
  if (!pricing.success) {
    return { ok: false, message: `Pricing: ${pricing.error.issues[0]?.message}` };
  }

  const seo = seoSchema.parse({
    titleEn: scalars.data.seoTitleEn,
    titleGu: scalars.data.seoTitleGu,
    descriptionEn: scalars.data.seoDescriptionEn,
    descriptionGu: scalars.data.seoDescriptionGu,
    ogImage: null,
    noindex: scalars.data.noindex,
  });

  await db.service.update({
    where: { id: existing.id },
    data: {
      nameEn: scalars.data.nameEn,
      nameGu: scalars.data.nameGu,
      shortEn: scalars.data.shortEn,
      shortGu: scalars.data.shortGu,
      summaryEn: scalars.data.summaryEn,
      summaryGu: scalars.data.summaryGu,
      order: scalars.data.order,
      featured: scalars.data.featured,
      isActive: scalars.data.isActive,
      contentEn: contentEn.data as unknown as Prisma.InputJsonObject,
      contentGu: contentGu.data as unknown as Prisma.InputJsonObject,
      inclusions: inclusions.data as unknown as Prisma.InputJsonArray,
      options: options.data as unknown as Prisma.InputJsonArray,
      specs: specs.data as unknown as Prisma.InputJsonArray,
      pricing: pricing.data as unknown as Prisma.InputJsonObject,
      seo: seo as unknown as Prisma.InputJsonObject,
    },
  });

  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'Service',
    entityId: existing.id,
  });

  refresh(slug);
  return { ok: true, message: 'Service saved.' };
}

/** Quick toggles from the list page. Supports direct target value to avoid redundant find query. */
export async function toggleServiceFlag(
  slug: string,
  flag: 'featured' | 'isActive',
  targetValue?: boolean | FormData,
) {
  const user = await requireUser();
  let nextVal = targetValue;
  let serviceId: string;

  if (typeof nextVal === 'boolean') {
    const updated = await db.service.update({
      where: { slug },
      data: { [flag]: nextVal },
      select: { id: true },
    });
    serviceId = updated.id;
  } else {
    const service = await db.service.findUnique({
      where: { slug },
      select: { id: true, featured: true, isActive: true },
    });
    if (!service) return;
    serviceId = service.id;
    nextVal = !service[flag];
    await db.service.update({ where: { id: service.id }, data: { [flag]: nextVal } });
  }

  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'Service',
    entityId: serviceId,
    meta: { [flag]: nextVal },
  });

  refresh(slug);
}
