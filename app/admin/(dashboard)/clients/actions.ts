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

const clientSchema = z.object({
  nameEn: z.string().trim().min(2).max(160),
  nameGu: z.string().trim().min(2).max(160),
  logoUrl: z.preprocess(blankToNull, z.string().max(500).nullable()),
  website: z.preprocess(blankToNull, z.url().max(400).nullable()),
  order: z.coerce.number().int().min(0).max(999),
  isActive: z.boolean(),
});

function refresh() {
  // revalidatePath('/admin/clients');
  after(() => {
    revalidateTag('clients');
    // revalidatePath('/', 'layout') removed to avoid full page reload
  });
}

export async function saveClient(_prev: RowState, formData: FormData): Promise<RowState> {
  const user = await requireUser();
  const id = String(formData.get('id') ?? '');

  const parsed = clientSchema.safeParse({
    nameEn: formData.get('nameEn'),
    nameGu: formData.get('nameGu'),
    logoUrl: formData.get('logoUrl'),
    website: formData.get('website'),
    order: formData.get('order') || 0,
    isActive: formData.get('isActive') !== null,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  const row = id
    ? await db.client.update({ where: { id }, data: parsed.data })
    : await db.client.create({ data: parsed.data });

  recordAudit({
    userId: user.id,
    action: id ? 'update' : 'create',
    entity: 'Client',
    entityId: row.id,
  });

  refresh();
  return { ok: true, message: id ? 'Saved.' : 'Added.' };
}

export async function deleteClient(id: string) {
  const user = await requireUser();
  await db.client.delete({ where: { id } });
  recordAudit({
    userId: user.id,
    action: 'delete',
    entity: 'Client',
    entityId: id,
  });
  refresh();
}
