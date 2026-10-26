import type { MuhuratDates } from './schemas/feature-flags';

/**
 * Date maths for the muhurat countdown.
 *
 * Deliberately in its own module with no imports: lib/features.ts constructs
 * the Prisma client at module scope, so anything living beside it cannot be
 * used — or tested — without a database.
 */

/** The next muhurat on or after today, or null once the list runs out. */
export function nextMuhurat(dates: MuhuratDates, now = new Date()): MuhuratDates[number] | null {
  const today = now.toISOString().slice(0, 10);
  const upcoming = dates
    .filter((entry) => entry.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? null;
}

/**
 * Whole days from now until the given date, floored at zero.
 *
 * Compared in UTC on both sides so the answer does not change with the time of
 * day — a countdown that says "3 days" in the morning and "2 days" after lunch
 * is worse than no countdown.
 */
export function daysUntil(date: string, now = new Date()): number {
  const target = Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
  );
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.round((target - today) / 86_400_000));
}
