import type { Metadata } from 'next';
import Link from 'next/link';
import { SettingsForm, type SettingsValues } from './settings-form';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

/** Form inputs are strings; null columns become empty inputs. */
function toFormValues(row: Record<string, unknown> | null): SettingsValues {
  const values: SettingsValues = {};
  if (!row) return values;

  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) values[key] = '';
    else if (Array.isArray(value)) values[key] = value.join('\n');
    else if (value instanceof Date) values[key] = value.toISOString();
    else if (typeof value === 'object')
      continue; // Json columns are edited elsewhere
    else values[key] = String(value);
  }

  return values;
}

export default async function SettingsPage() {
  const settings = await db.siteSettings.findUnique({ where: { id: 'singleton' } });

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Settings</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Business details used across the public site, the schema markup and every enquiry email.
      </p>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/settings/estimator"
          className="rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-maroon/40"
        >
          <p className="text-sm font-semibold text-maroon">Estimator rules</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Base prices, guest bands and season — what the quote form shows.
          </p>
        </Link>
        <Link
          href="/admin/settings/features"
          className="rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-maroon/40"
        >
          <p className="text-sm font-semibold text-maroon">Extra features</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Countdown, style explorer, 360 viewer, Instagram feed and the popup.
          </p>
        </Link>
      </div>

      <SettingsForm values={toFormValues(settings)} />
    </div>
  );
}
