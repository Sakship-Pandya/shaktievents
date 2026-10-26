'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export type RowState = { ok: boolean; message: string | null };

const faqSchema = z.object({
  questionEn: z.string().trim().min(5).max(300),
  questionGu: z.string().trim().min(5).max(300),
  answerEn: z.string().trim().min(20).max(2000),
  answerGu: z.string().trim().min(20).max(2000),
  scope: z.enum(['GLOBAL', 'HOME', 'SERVICE']),
  order: z.coerce.number().int().min(0).max(999),
  isActive: z.boolean(),
});

function refresh() {
  // revalidatePath('/admin/faqs');
  after(() => {
    revalidateTag('faqs');
    revalidateTag('services');
    // revalidatePath('/', 'layout') removed to avoid full app cache purge
  });
}

export async function saveFaq(_prev: RowState, formData: FormData): Promise<RowState> {
  const user = await requireUser();
  const id = String(formData.get('id') ?? '');

  const parsed = faqSchema.safeParse({
    questionEn: formData.get('questionEn'),
    questionGu: formData.get('questionGu'),
    answerEn: formData.get('answerEn'),
    answerGu: formData.get('answerGu'),
    scope: formData.get('scope') || 'GLOBAL',
    order: formData.get('order') || 0,
    isActive: formData.get('isActive') !== null,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  const serviceId = String(formData.get('serviceId') ?? '') || null;
  if (parsed.data.scope === 'SERVICE' && !serviceId) {
    return { ok: false, message: 'Pick which service this question belongs to.' };
  }

  const row = id
    ? await db.faq.update({ where: { id }, data: { ...parsed.data, serviceId } })
    : await db.faq.create({ data: { ...parsed.data, serviceId } });

  recordAudit({
    userId: user.id,
    action: id ? 'update' : 'create',
    entity: 'Faq',
    entityId: row.id,
  });

  refresh();
  return { ok: true, message: id ? 'Question saved.' : 'Question added.' };
}

export async function deleteFaq(id: string) {
  const user = await requireUser();
  await db.faq.delete({ where: { id } });
  recordAudit({
    userId: user.id,
    action: 'delete',
    entity: 'Faq',
    entityId: id,
  });
  refresh();
}
