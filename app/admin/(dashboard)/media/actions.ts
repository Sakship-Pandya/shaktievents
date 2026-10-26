'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireUser } from '@/lib/auth-helpers';
import { destroyAsset } from '@/lib/cloudinary';
import { db } from '@/lib/db';

const uploadResultSchema = z.object({
  url: z.url(),
  publicId: z.string().min(1),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  bytes: z.number().int().nonnegative().nullable(),
  format: z.string().max(20).nullable(),
  folder: z.string().max(120).default('uploads'),
});

export type UploadResult = z.input<typeof uploadResultSchema>;

/** Records an asset the Cloudinary widget has already uploaded. */
export async function saveUploadedMedia(input: UploadResult) {
  const user = await requireUser();
  const parsed = uploadResultSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: 'That upload could not be recorded.' };

  const data = parsed.data;
  const media = await db.media.upsert({
    where: { publicId: data.publicId },
    update: {
      url: data.url,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      format: data.format,
    },
    create: data,
  });

  await db.auditLog.create({
    data: { userId: user.id, action: 'create', entity: 'Media', entityId: media.id },
  });

  revalidatePath('/admin/media');
  return { ok: true as const, id: media.id };
}

const altSchema = z.object({
  id: z.string().min(1),
  altEn: z.string().max(300).nullable(),
  altGu: z.string().max(300).nullable(),
});

export async function updateMediaAlt(input: z.input<typeof altSchema>) {
  await requireUser();
  const parsed = altSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: 'Alt text is too long.' };

  const { id, ...alt } = parsed.data;
  await db.media.update({ where: { id }, data: alt });
  revalidatePath('/admin/media');
  return { ok: true as const };
}

export async function deleteMedia(id: string) {
  const user = await requireUser();

  const media = await db.media.findUnique({
    where: { id },
    select: {
      id: true,
      publicId: true,
      _count: { select: { projectMedia: true, coverForProject: true } },
    },
  });
  if (!media) return { ok: false as const, error: 'That file no longer exists.' };

  const usage = media._count.projectMedia + media._count.coverForProject;
  if (usage > 0) {
    return {
      ok: false as const,
      error: `Still used by ${usage} project${usage === 1 ? '' : 's'}. Remove it there first.`,
    };
  }

  // Remove the remote asset first — a failed DB delete is recoverable, an
  // orphaned Cloudinary asset is not visible anywhere.
  if (media.publicId) await destroyAsset(media.publicId);
  await db.media.delete({ where: { id } });

  await db.auditLog.create({
    data: { userId: user.id, action: 'delete', entity: 'Media', entityId: id },
  });

  revalidatePath('/admin/media');
  return { ok: true as const };
}
