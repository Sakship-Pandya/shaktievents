'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { locales } from '@/i18n/routing';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { localizedPath } from '@/lib/seo';

export type AnnouncementState = { ok: boolean; message: string | null };

const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const trimmed = v.trim();
  return trimmed === '' ? null : trimmed;
};

const announcementSchema = z.object({
  textEn: z.string().trim().min(3, 'Enter the English text').max(160),
  textGu: z.string().trim().min(3, 'Enter the Gujarati text').max(160),
  // Site-relative only: the bar renders through the locale-aware <Link>.
  href: z.preprocess(
    blankToNull,
    z
      .string()
      .max(200)
      .nullable()
      .refine((v) => v === null || v.startsWith('/'), 'Use a site path such as /get-quote'),
  ),
  isActive: z.boolean(),
});

/** The bar shows on every page, so a change clears the public tree in the background. */
function refresh() {
  revalidatePath('/admin/announcements');
  after(() => {
    revalidateTag('announcements');
    for (const locale of locales) revalidatePath(localizedPath(locale, '/'), 'layout');
  });
}

function readForm(formData: FormData) {
  return announcementSchema.safeParse({
    textEn: formData.get('textEn'),
    textGu: formData.get('textGu'),
    href: formData.get('href'),
    isActive: formData.get('isActive') !== null,
  });
}

export async function createAnnouncement(
  _prev: AnnouncementState,
  formData: FormData,
): Promise<AnnouncementState> {
  const user = await requireUser();
  const parsed = readForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  const created = await db.announcement.create({ data: parsed.data });
  recordAudit({
    userId: user.id,
    action: 'create',
    entity: 'Announcement',
    entityId: created.id,
  });

  refresh();
  return { ok: true, message: 'Announcement added.' };
}

export async function updateAnnouncement(
  _prev: AnnouncementState,
  formData: FormData,
): Promise<AnnouncementState> {
  const user = await requireUser();
  const id = String(formData.get('id') ?? '');
  const parsed = readForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  await db.announcement.update({ where: { id }, data: parsed.data });
  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'Announcement',
    entityId: id,
  });

  refresh();
  return { ok: true, message: 'Announcement saved.' };
}

export async function deleteAnnouncement(id: string) {
  const user = await requireUser();
  await db.announcement.delete({ where: { id } });
  recordAudit({
    userId: user.id,
    action: 'delete',
    entity: 'Announcement',
    entityId: id,
  });
  refresh();
}
