import { unstable_cache } from 'next/cache';
import { db } from './db';
import {
  DEFAULT_FLAGS,
  featureFlagsSchema,
  muhuratDatesSchema,
  type FeatureFlags,
  type MuhuratDates,
} from './schemas/feature-flags';
import { parseOr } from './schemas/service-content';

/**
 * Flags and the muhurat calendar, read together because every page that needs
 * one usually needs the other.
 */
export type FeatureConfig = { flags: FeatureFlags; muhuratDates: MuhuratDates };

async function loadFeatures(): Promise<FeatureConfig> {
  try {
    const row = await db.siteSettings.findUnique({
      where: { id: 'singleton' },
      select: { featureFlags: true, muhuratDates: true },
    });

    return {
      flags: parseOr(featureFlagsSchema, row?.featureFlags, DEFAULT_FLAGS),
      muhuratDates: parseOr(muhuratDatesSchema, row?.muhuratDates, []),
    };
  } catch (error) {
    // An optional feature must never be the reason a page fails.
    console.error('[features] falling back to everything off:', error);
    return { flags: DEFAULT_FLAGS, muhuratDates: [] };
  }
}

export { daysUntil, nextMuhurat } from './muhurat';

export const getFeatures = unstable_cache(loadFeatures, ['features'], {
  tags: ['settings'],
  revalidate: 3600,
});
