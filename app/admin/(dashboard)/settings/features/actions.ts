'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { readRows } from '@/lib/form-rows';
import { DEFAULT_FLAGS, featureFlagsSchema, muhuratDatesSchema } from '@/lib/schemas/feature-flags';
import type { Prisma } from '@/lib/generated/prisma/client';

export type FeaturesState = { ok: boolean; message: string | null };

const FLAG_KEYS = Object.keys(DEFAULT_FLAGS) as (keyof typeof DEFAULT_FLAGS)[];

export async function saveFeatures(
  _prev: FeaturesState,
  formData: FormData,
): Promise<FeaturesState> {
  const user = await requireUser();

  // An unchecked checkbox sends nothing at all, so every flag is read as
  // "present or not" rather than trusting a value.
  const flags = featureFlagsSchema.safeParse(
    Object.fromEntries(FLAG_KEYS.map((key) => [key, formData.get(`flag.${key}`) === 'on'])),
  );
  if (!flags.success) return { ok: false, message: 'Could not read the switches.' };

  const dates = muhuratDatesSchema.safeParse(
    readRows(formData, 'muhurat', ['date', 'labelEn', 'labelGu'])
      .filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date ?? ''))
      .map((row) => ({
        date: row.date ?? '',
        labelEn: row.labelEn ?? '',
        labelGu: row.labelGu ?? '',
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  );
  if (!dates.success) {
    return { ok: false, message: dates.error.issues[0]?.message ?? 'Check the muhurat dates.' };
  }

  // A blank token box means "leave the saved token alone" — the value is never
  // sent back to the browser, so a blank box is the normal state on load.
  const tokenInput = String(formData.get('instagramToken') ?? '').trim();
  const clearToken = formData.get('clearInstagramToken') === 'on';
  const tokenUpdate: { instagramToken?: string | null } = clearToken
    ? { instagramToken: null }
    : tokenInput
      ? { instagramToken: tokenInput }
      : {};

  await db.siteSettings.update({
    where: { id: 'singleton' },
    data: {
      featureFlags: flags.data as unknown as Prisma.InputJsonObject,
      muhuratDates: dates.data as unknown as Prisma.InputJsonValue,
      ...tokenUpdate,
    },
  });

  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'SiteSettings',
    entityId: 'singleton',
    // The token itself is never logged — only whether it moved.
    meta: {
      flags: FLAG_KEYS.filter((key) => flags.data[key]).join(', ') || 'all off',
      muhuratDates: dates.data.length,
      instagramToken: clearToken ? 'cleared' : tokenInput ? 'updated' : 'unchanged',
    },
  });

  revalidatePath('/admin/settings/features');
  after(() => {
    revalidateTag('settings');
    revalidateTag('instagram');
    // revalidatePath('/', 'layout') removed to avoid full app cache purge
  });

  const on = FLAG_KEYS.filter((key) => flags.data[key]);
  return {
    ok: true,
    message:
      on.length === 0 ? 'Saved. All extra features are off.' : `Saved. On: ${on.join(', ')}.`,
  };
}
