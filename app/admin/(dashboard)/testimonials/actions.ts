'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export type RowState = { ok: boolean; message: string | null };

const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? null : t;
};

const testimonialSchema = z.object({
  authorName: z.string().trim().min(2).max(120),
  authorRole: z.preprocess(blankToNull, z.string().max(120).nullable()),
  town: z.preprocess(blankToNull, z.string().max(80).nullable()),
  quoteEn: z.preprocess(blankToNull, z.string().max(1200).nullable()),
  quoteGu: z.preprocess(blankToNull, z.string().max(1200).nullable()),
  rating: z.preprocess(
    (v) => (blankToNull(v) === null ? null : Number(v)),
    z.number().int().min(1).max(5).nullable(),
  ),
  kind: z.enum(['TEXT', 'VIDEO']),
  videoUrl: z.preprocess(blankToNull, z.url().max(400).nullable()),
  sourceUrl: z.preprocess(blankToNull, z.url().max(400).nullable()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean(),
  order: z.coerce.number().int().min(0).max(999),
});

function refresh() {
  revalidatePath('/admin/testimonials');
  after(() => {
    revalidateTag('testimonials');
    // revalidatePath('/', 'layout') removed to avoid full page reload
  });
}

function read(formData: FormData) {
  return testimonialSchema.safeParse({
    authorName: formData.get('authorName'),
    authorRole: formData.get('authorRole'),
    town: formData.get('town'),
    quoteEn: formData.get('quoteEn'),
    quoteGu: formData.get('quoteGu'),
    rating: formData.get('rating'),
    kind: formData.get('kind') || 'TEXT',
    videoUrl: formData.get('videoUrl'),
    sourceUrl: formData.get('sourceUrl'),
    status: formData.get('status') || 'DRAFT',
    featured: formData.get('featured') !== null,
    order: formData.get('order') || 0,
  });
}

export async function saveTestimonial(_prev: RowState, formData: FormData): Promise<RowState> {
  const user = await requireUser();
  const id = String(formData.get('id') ?? '');
  const parsed = read(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  // A published review has to actually say something.
  if (
    parsed.data.status === 'PUBLISHED' &&
    parsed.data.kind === 'TEXT' &&
    !parsed.data.quoteEn &&
    !parsed.data.quoteGu
  ) {
    return { ok: false, message: 'Add the review text before publishing it.' };
  }
  if (parsed.data.status === 'PUBLISHED' && parsed.data.kind === 'VIDEO' && !parsed.data.videoUrl) {
    return { ok: false, message: 'Add the video URL before publishing it.' };
  }

  const serviceIds = formData.getAll('serviceIds').map(String).filter(Boolean);
  const eventTypeId = String(formData.get('eventTypeId') ?? '') || null;

  const row = id
    ? await db.testimonial.update({
        where: { id },
        data: {
          ...parsed.data,
          eventTypeId,
          services: { set: serviceIds.map((s) => ({ id: s })) },
        },
      })
    : await db.testimonial.create({
        data: {
          ...parsed.data,
          eventTypeId,
          services: { connect: serviceIds.map((s) => ({ id: s })) },
        },
      });

  recordAudit({
    userId: user.id,
    action: id ? 'update' : 'create',
    entity: 'Testimonial',
    entityId: row.id,
  });

  refresh();
  return { ok: true, message: id ? 'Review saved.' : 'Review added.' };
}

export async function deleteTestimonial(id: string) {
  const user = await requireUser();
  await db.testimonial.delete({ where: { id } });
  recordAudit({
    userId: user.id,
    action: 'delete',
    entity: 'Testimonial',
    entityId: id,
  });
  refresh();
}
