import { describe, expect, it } from 'vitest';
import { estimate, formatRange, guestMultiplier, isPeakSeason } from '@/lib/estimator';
import { EMPTY_RULES, estimatorRulesSchema, type EstimatorRules } from '@/lib/schemas/estimator';

const RULES: EstimatorRules = {
  baseByService: { mandap: 40_000, sound: 25_000, lighting: 15_000, unpriced: 0 },
  guestBands: [
    { upTo: 500, multiplier: 1 },
    { upTo: 2000, multiplier: 1.8 },
    { upTo: 5000, multiplier: 3 },
  ],
  peakMonths: [11, 12, 1, 2],
  peakMultiplier: 1.25,
  perKm: 40,
  spread: 0.15,
  minTotal: null,
};

describe('estimate — when it must not produce a number', () => {
  it('returns nothing when no rules are configured', () => {
    // The launch state: the client has not set any prices yet.
    expect(
      estimate(EMPTY_RULES, {
        serviceSlugs: ['mandap'],
        guests: 500,
        eventDate: null,
        distanceKm: null,
      }),
    ).toEqual({ kind: 'unavailable', reason: 'no-rules' });
  });

  it('returns nothing when no service is selected', () => {
    expect(
      estimate(RULES, { serviceSlugs: [], guests: 500, eventDate: null, distanceKm: null }).kind,
    ).toBe('unavailable');
  });

  it('returns nothing when the chosen services have no price set', () => {
    expect(
      estimate(RULES, {
        serviceSlugs: ['unpriced', 'not-in-rules'],
        guests: 500,
        eventDate: null,
        distanceKm: null,
      }),
    ).toEqual({ kind: 'unavailable', reason: 'no-priced-service' });
  });
});

describe('estimate — the arithmetic', () => {
  const run = (input: Partial<Parameters<typeof estimate>[1]> = {}) =>
    estimate(RULES, {
      serviceSlugs: ['mandap', 'sound'],
      guests: 400,
      eventDate: null,
      distanceKm: null,
      ...input,
    });

  it('sums the base prices of the chosen services', () => {
    const result = run();
    // 65,000 ± 15% → 55,250 … 74,750, rounded to the nearest 1,000.
    expect(result).toMatchObject({ kind: 'range', min: 55_000, max: 75_000 });
  });

  it('ignores services with no price rather than failing', () => {
    expect(run({ serviceSlugs: ['mandap', 'not-in-rules'] })).toMatchObject({
      kind: 'range',
      min: 34_000,
    });
  });

  it('applies the guest band', () => {
    const small = run({ guests: 400 });
    const large = run({ guests: 1500 });
    if (small.kind !== 'range' || large.kind !== 'range') throw new Error('expected ranges');
    expect(large.min).toBeGreaterThan(small.min);
  });

  it('applies the largest band above the top bound', () => {
    expect(guestMultiplier(RULES, 9000)).toBe(3);
  });

  it('applies the season multiplier and reports it', () => {
    const peak = run({ eventDate: '2026-12-05' });
    const off = run({ eventDate: '2026-07-05' });
    if (peak.kind !== 'range' || off.kind !== 'range') throw new Error('expected ranges');
    expect(peak.isPeakSeason).toBe(true);
    expect(off.isPeakSeason).toBe(false);
    expect(peak.min).toBeGreaterThan(off.min);
  });

  it('adds the distance term only when both a rate and a distance exist', () => {
    const near = run({ distanceKm: 0 });
    const far = run({ distanceKm: 100 });
    if (near.kind !== 'range' || far.kind !== 'range') throw new Error('expected ranges');
    expect(far.min).toBeGreaterThan(near.min);
    expect(
      estimate(
        { ...RULES, perKm: null },
        {
          serviceSlugs: ['mandap'],
          guests: 400,
          eventDate: null,
          distanceKm: 100,
        },
      ),
    ).toMatchObject({ min: 34_000 });
  });

  it('respects a minimum total', () => {
    const result = estimate(
      { ...RULES, minTotal: 500_000 },
      { serviceSlugs: ['lighting'], guests: 100, eventDate: null, distanceKm: null },
    );
    if (result.kind !== 'range') throw new Error('expected a range');
    expect(result.min).toBeGreaterThanOrEqual(400_000);
  });

  it('never produces a max at or below the min', () => {
    const result = estimate(
      { ...RULES, spread: 0 },
      { serviceSlugs: ['lighting'], guests: 100, eventDate: null, distanceKm: null },
    );
    if (result.kind !== 'range') throw new Error('expected a range');
    expect(result.max).toBeGreaterThan(result.min);
  });
});

describe('isPeakSeason', () => {
  it('is false when no peak months are configured', () => {
    expect(isPeakSeason(EMPTY_RULES, '2026-12-05')).toBe(false);
  });

  it('is false for an unparseable date', () => {
    expect(isPeakSeason(RULES, 'not-a-date')).toBe(false);
  });
});

describe('formatRange', () => {
  it('groups digits the Indian way', () => {
    expect(formatRange(120_000, 160_000)).toBe('₹1,20,000 – ₹1,60,000');
  });
});

describe('estimatorRulesSchema', () => {
  it('fills in defaults for an empty object', () => {
    expect(estimatorRulesSchema.parse({})).toEqual(EMPTY_RULES);
  });

  it('rejects a negative base price', () => {
    expect(estimatorRulesSchema.safeParse({ baseByService: { mandap: -1 } }).success).toBe(false);
  });
});
