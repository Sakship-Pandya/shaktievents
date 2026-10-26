'use server';

import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { readRows } from '@/lib/form-rows';
import { estimatorRulesSchema } from '@/lib/schemas/estimator';
import type { Prisma } from '@/lib/generated/prisma/client';

export type EstimatorState = { ok: boolean; message: string | null };

const optionalNumber = (value: FormDataEntryValue | null): number | null => {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

export async function saveEstimatorRules(
  _prev: EstimatorState,
  formData: FormData,
): Promise<EstimatorState> {
  const user = await requireUser();

  // Base prices arrive as `base.<slug>`; a blank input means "no price set",
  // which is what makes the estimator stay silent for that service.
  const baseByService: Record<string, number> = {};
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('base.')) continue;
    const slug = key.slice(5);
    const amount = optionalNumber(value);
    if (slug && amount !== null && amount > 0) baseByService[slug] = amount;
  }

  const guestBands = readRows(formData, 'bands', ['upTo', 'multiplier'])
    .map((row) => ({ upTo: Number(row.upTo), multiplier: Number(row.multiplier) }))
    .filter((band) => Number.isFinite(band.upTo) && Number.isFinite(band.multiplier));

  const peakMonths = formData
    .getAll('peakMonths')
    .map((m) => Number(m))
    .filter((m) => Number.isInteger(m) && m >= 1 && m <= 12);

  const parsed = estimatorRulesSchema.safeParse({
    baseByService,
    guestBands,
    peakMonths,
    peakMultiplier: optionalNumber(formData.get('peakMultiplier')) ?? 1,
    perKm: optionalNumber(formData.get('perKm')),
    spread: (optionalNumber(formData.get('spreadPct')) ?? 15) / 100,
    minTotal: optionalNumber(formData.get('minTotal')),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the numbers.' };
  }

  await db.siteSettings.update({
    where: { id: 'singleton' },
    data: { estimatorRules: parsed.data as unknown as Prisma.InputJsonObject },
  });

  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'SiteSettings',
    entityId: 'singleton',
    meta: { estimatorRules: 'updated' },
  });

  revalidatePath('/admin/settings/estimator');
  // The quote page reads peakMonths to flag lagan-season dates.
  after(() => {
    revalidatePath('/[locale]/get-quote', 'page');
    // revalidatePath('/', 'layout') removed to avoid full app cache purge
  });

  return {
    ok: true,
    message:
      Object.keys(parsed.data.baseByService).length === 0
        ? 'Saved. With no base prices set, the quote form will not show a figure.'
        : 'Estimator rules saved.',
  };
}
