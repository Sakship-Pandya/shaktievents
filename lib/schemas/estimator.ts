import { z } from 'zod';

/**
 * Estimator rules, stored on SiteSettings.estimatorRules and edited in the
 * admin. Everything is optional: until the client fills in real numbers the
 * estimator deliberately produces no figure at all rather than a guess, and
 * the quote wizard says so. See lib/estimator.ts.
 */
export const guestBandSchema = z.object({
  /** Upper bound of the band, inclusive. */
  upTo: z.number().int().positive(),
  multiplier: z.number().positive().max(20),
});

export const estimatorRulesSchema = z.object({
  /** Base cost per service slug, in rupees. */
  baseByService: z.record(z.string(), z.number().nonnegative()).default({}),
  /** Applied by guest count. Bands are matched in ascending order of `upTo`. */
  guestBands: z.array(guestBandSchema).max(8).default([]),
  /** Months (1-12) that count as lagan season. */
  peakMonths: z.array(z.number().int().min(1).max(12)).max(12).default([]),
  peakMultiplier: z.number().positive().max(5).default(1),
  /** Flat cost per km beyond the base town. Null disables the distance term. */
  perKm: z.number().nonnegative().nullable().default(null),
  /** Half-width of the quoted range, as a fraction. 0.15 = ±15%. */
  spread: z.number().min(0).max(0.6).default(0.15),
  /** Nothing is quoted below this. */
  minTotal: z.number().nonnegative().nullable().default(null),
});

export type EstimatorRules = z.infer<typeof estimatorRulesSchema>;

export const EMPTY_RULES: EstimatorRules = {
  baseByService: {},
  guestBands: [],
  peakMonths: [],
  peakMultiplier: 1,
  perKm: null,
  spread: 0.15,
  minTotal: null,
};
