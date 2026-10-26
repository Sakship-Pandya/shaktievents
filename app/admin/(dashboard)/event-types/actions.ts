'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { locales } from '@/i18n/routing';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { readRows } from '@/lib/form-rows';
import { eventIntroSchema } from '@/lib/schemas/page-content';
import { seoSchema } from '@/lib/schemas/service-content';
import { localizedPath } from '@/lib/seo';
import type { Prisma } from '@/lib/generated/prisma/client';

export type RowState = { ok: boolean; message: string | null };

const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? null : t;
};

const scalarSchema = z.object({
  nameEn: z.string().trim().min(2).max(90),
  nameGu: z.string().trim().min(2).max(90),
  blurbEn: z.string().trim().min(20).max(400),
  blurbGu: z.string().trim().min(20).max(400),
  order: z.coerce.number().int().min(0).max(99),
  isActive: z.boolean(),
  seoTitleEn: z.preprocess(blankToNull, z.string().max(70).nullable()),
  seoTitleGu: z.preprocess(blankToNull, z.string().max(70).nullable()),
  seoDescriptionEn: z.preprocess(blankToNull, z.string().max(180).nullable()),
  seoDescriptionGu: z.preprocess(blankToNull, z.string().max(180).nullable()),
  noindex: z.boolean(),
});

function refresh(slug: string) {
  revalidatePath(`/admin/event-types/${slug}`);
  after(() => {
    revalidateTag('event-types');
    for (const locale of locales) revalidatePath(localizedPath(locale, `/events/${slug}`));
    // revalidatePath('/', 'layout') removed to avoid full app cache purge
  });
}

export async function saveEventType(_prev: RowState, formData: FormData): Promise<RowState> {
  const user = await requireUser();
  const slug = String(formData.get('slug') ?? '');

  const eventType = await db.eventType.findUnique({ where: { slug }, select: { id: true } });
  if (!eventType) return { ok: false, message: 'That event type no longer exists.' };

  const scalars = scalarSchema.safeParse({
    nameEn: formData.get('nameEn'),
    nameGu: formData.get('nameGu'),
    blurbEn: formData.get('blurbEn'),
    blurbGu: formData.get('blurbGu'),
    order: formData.get('order') || 0,
    isActive: formData.get('isActive') !== null,
    seoTitleEn: formData.get('seoTitleEn'),
    seoTitleGu: formData.get('seoTitleGu'),
    seoDescriptionEn: formData.get('seoDescriptionEn'),
    seoDescriptionGu: formData.get('seoDescriptionGu'),
    noindex: formData.get('noindex') !== null,
  });
  if (!scalars.success) {
    return { ok: false, message: scalars.error.issues[0]?.message ?? 'Check the fields.' };
  }

  const intro = (suffix: 'En' | 'Gu') =>
    eventIntroSchema.safeParse({
      promise: String(formData.get(`promise${suffix}`) ?? ''),
      paragraphs: readRows(formData, `paragraphs${suffix}`, ['text']).map((r) => r.text ?? ''),
      needs: readRows(formData, `needs${suffix}`, ['title', 'body']).map((r) => ({
        title: r.title ?? '',
        body: r.body ?? '',
      })),
    });

  const introEn = intro('En');
  const introGu = intro('Gu');
  if (!introEn.success)
    return { ok: false, message: `English copy: ${introEn.error.issues[0]?.message}` };
  if (!introGu.success)
    return { ok: false, message: `Gujarati copy: ${introGu.error.issues[0]?.message}` };

  const seo = seoSchema.parse({
    titleEn: scalars.data.seoTitleEn,
    titleGu: scalars.data.seoTitleGu,
    descriptionEn: scalars.data.seoDescriptionEn,
    descriptionGu: scalars.data.seoDescriptionGu,
    ogImage: null,
    noindex: scalars.data.noindex,
  });

  await db.eventType.update({
    where: { id: eventType.id },
    data: {
      nameEn: scalars.data.nameEn,
      nameGu: scalars.data.nameGu,
      blurbEn: scalars.data.blurbEn,
      blurbGu: scalars.data.blurbGu,
      order: scalars.data.order,
      isActive: scalars.data.isActive,
      introEn: introEn.data as unknown as Prisma.InputJsonObject,
      introGu: introGu.data as unknown as Prisma.InputJsonObject,
      seo: seo as unknown as Prisma.InputJsonObject,
    },
  });

  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'EventType',
    entityId: eventType.id,
  });

  refresh(slug);
  return { ok: true, message: 'Event type saved.' };
}
