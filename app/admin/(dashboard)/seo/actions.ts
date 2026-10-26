'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export type RowState = { ok: boolean; message: string | null };

const redirectSchema = z
  .object({
    source: z.string().trim().min(2).max(300).regex(/^\//, 'The old path must start with /'),
    destination: z.string().trim().min(1).max(300),
    permanent: z.boolean(),
  })
  .refine((v) => v.source !== v.destination, {
    message: 'A page cannot redirect to itself.',
    path: ['destination'],
  });

function refresh() {
  revalidatePath('/admin/seo');
  after(() => {
    revalidateTag('redirects');
  });
}

export async function saveRedirect(_prev: RowState, formData: FormData): Promise<RowState> {
  const user = await requireUser();

  const parsed = redirectSchema.safeParse({
    source: formData.get('source'),
    destination: formData.get('destination'),
    permanent: formData.get('permanent') !== null,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the paths.' };
  }

  const existing = await db.redirect.findUnique({ where: { source: parsed.data.source } });
  const row = existing
    ? await db.redirect.update({ where: { source: parsed.data.source }, data: parsed.data })
    : await db.redirect.create({ data: parsed.data });

  recordAudit({
    userId: user.id,
    action: existing ? 'update' : 'create',
    entity: 'Redirect',
    entityId: row.id,
  });

  refresh();
  return { ok: true, message: existing ? 'Redirect updated.' : 'Redirect added.' };
}

export async function deleteRedirect(id: string) {
  const user = await requireUser();
  await db.redirect.delete({ where: { id } });
  recordAudit({
    userId: user.id,
    action: 'delete',
    entity: 'Redirect',
    entityId: id,
  });
  refresh();
}
