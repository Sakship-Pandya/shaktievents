import type { EstimatorRules } from './schemas/estimator';

export type EstimateInput = {
  serviceSlugs: string[];
  guests: number | null;
  /** ISO date string, or null if the family has not fixed one. */
  eventDate: string | null;
  distanceKm: number | null;
};

export type Estimate =
  | { kind: 'range'; min: number; max: number; isPeakSeason: boolean }
  /**
   * No figure can be produced. `reason` is for the developer; the wizard shows
   * a written explanation from the message catalogue either way.
   */
  | { kind: 'unavailable'; reason: 'no-rules' | 'no-services' | 'no-priced-service' };

/** Rounds to something a person would say out loud. */
function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function niceStep(value: number): number {
  if (value >= 500_000) return 25_000;
  if (value >= 100_000) return 5_000;
  if (value >= 20_000) return 1_000;
  return 500;
}

export function guestMultiplier(rules: EstimatorRules, guests: number | null): number {
  if (guests == null || rules.guestBands.length === 0) return 1;

  const bands = [...rules.guestBands].sort((a, b) => a.upTo - b.upTo);
  for (const band of bands) {
    if (guests <= band.upTo) return band.multiplier;
  }
  // Above every band, the largest band's multiplier applies.
  return bands[bands.length - 1]?.multiplier ?? 1;
}

export function isPeakSeason(rules: EstimatorRules, eventDate: string | null): boolean {
  if (!eventDate || rules.peakMonths.length === 0) return false;
  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) return false;
  return rules.peakMonths.includes(date.getUTCMonth() + 1);
}

/**
 * Turns the wizard's answers into a quoted range.
 *
 * The important case is the one that returns nothing: with no base prices
 * configured there is no honest number to show, so the wizard collects the
 * enquiry and tells the visitor a quote follows a site visit. Publishing a
 * figure the business has not agreed would be worse than showing none.
 */
export function estimate(rules: EstimatorRules, input: EstimateInput): Estimate {
  if (input.serviceSlugs.length === 0) {
    return { kind: 'unavailable', reason: 'no-services' };
  }

  const priced = input.serviceSlugs
    .map((slug) => rules.baseByService[slug])
    .filter((value): value is number => typeof value === 'number' && value > 0);

  if (Object.keys(rules.baseByService).length === 0) {
    return { kind: 'unavailable', reason: 'no-rules' };
  }
  if (priced.length === 0) {
    return { kind: 'unavailable', reason: 'no-priced-service' };
  }

  const base = priced.reduce((sum, value) => sum + value, 0);
  const peak = isPeakSeason(rules, input.eventDate);

  let total = base * guestMultiplier(rules, input.guests);
  if (peak) total *= rules.peakMultiplier;
  if (rules.perKm != null && input.distanceKm != null) {
    total += rules.perKm * input.distanceKm;
  }
  if (rules.minTotal != null) total = Math.max(total, rules.minTotal);

  const step = niceStep(total);
  const min = Math.max(0, roundToNearest(total * (1 - rules.spread), step));
  const max = roundToNearest(total * (1 + rules.spread), step);

  return { kind: 'range', min, max: Math.max(max, min + step), isPeakSeason: peak };
}

/** "₹1,20,000 – ₹1,60,000" in Indian digit grouping. */
export function formatRange(min: number, max: number): string {
  const format = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  return `${format(min)} – ${format(max)}`;
}
