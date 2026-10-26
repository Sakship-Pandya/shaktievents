'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export type RowState = { ok: boolean; message: string | null };

/** Accepts a full YouTube URL or a bare id, and stores the id. */
function toYoutubeId(raw: string): string | null {
  const value = raw.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  const match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

const videoSchema = z.object({
  titleEn: z.string().trim().min(3).max(160),
  titleGu: z.string().trim().min(3).max(160),
  category: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? null : v),
    z.string().max(80).nullable(),
  ),
  order: z.coerce.number().int().min(0).max(999),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

function refresh() {
  revalidatePath('/admin/videos');
  after(() => {
    revalidateTag('videos');
    // revalidatePath('/', 'layout') removed to avoid full app cache purge
  });
}

export async function saveVideo(_prev: RowState, formData: FormData): Promise<RowState> {
  const user = await requireUser();
  const id = String(formData.get('id') ?? '');

  const youtubeId = toYoutubeId(String(formData.get('youtubeId') ?? ''));
  if (!youtubeId) {
    return { ok: false, message: 'Paste a YouTube link or an 11-character video id.' };
  }

  const parsed = videoSchema.safeParse({
    titleEn: formData.get('titleEn'),
    titleGu: formData.get('titleGu'),
    category: formData.get('category'),
    order: formData.get('order') || 0,
    status: formData.get('status') || 'DRAFT',
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  const row = id
    ? await db.video.update({ where: { id }, data: { ...parsed.data, youtubeId } })
    : await db.video.create({ data: { ...parsed.data, youtubeId } });

  recordAudit({
    userId: user.id,
    action: id ? 'update' : 'create',
    entity: 'Video',
    entityId: row.id,
  });

  refresh();
  return { ok: true, message: id ? 'Video saved.' : 'Video added.' };
}

export async function deleteVideo(id: string) {
  const user = await requireUser();
  await db.video.delete({ where: { id } });
  recordAudit({
    userId: user.id,
    action: 'delete',
    entity: 'Video',
    entityId: id,
  });
  refresh();
}
