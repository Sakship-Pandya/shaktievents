'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { settingsSchema } from '@/lib/schemas/settings';

export type SettingsState = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[] | undefined>;
};

type AuditValue = string | number | boolean | null;

/** Flattens a value to something JSON-safe and readable in the audit log. */
function toAuditValue(value: unknown): AuditValue {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return JSON.stringify(value);
}

/** Only the keys that actually changed, so the audit log stays readable. */
function diff(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): Record<string, { from: AuditValue; to: AuditValue }> {
  const changed: Record<string, { from: AuditValue; to: AuditValue }> = {};

  for (const [key, value] of Object.entries(after)) {
    const previous = before[key];
    if (JSON.stringify(previous ?? null) !== JSON.stringify(value ?? null)) {
      changed[key] = { from: toAuditValue(previous), to: toAuditValue(value) };
    }
  }

  return changed;
}

export async function saveSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const user = await requireUser();

  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some fields need attention.',
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const before = await db.siteSettings.findUnique({ where: { id: 'singleton' } });
  const settings = await db.siteSettings.upsert({
    where: { id: 'singleton' },
    update: parsed.data,
    create: { id: 'singleton', ...parsed.data },
  });

  const changed = diff((before ?? {}) as Record<string, unknown>, parsed.data);
  if (Object.keys(changed).length > 0) {
    recordAudit({
      userId: user.id,
      action: 'update',
      entity: 'SiteSettings',
      entityId: settings.id,
      meta: changed,
    });
  }

  // The tag clears the cached settings query; the path revalidation clears
  // the rendered HTML that embedded them in the background.
  after(() => {
    revalidateTag('settings');
// revalidatePath('/', 'layout') removed to avoid full page reload
  });

  return {
    ok: true,
    message: Object.keys(changed).length > 0 ? 'Settings saved.' : 'No changes to save.',
    errors: {},
  };
}
