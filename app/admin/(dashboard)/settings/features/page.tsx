import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FeaturesForm, type FeaturesFormValues } from './features-form';
import { db } from '@/lib/db';
import { DEFAULT_FLAGS, featureFlagsSchema, muhuratDatesSchema } from '@/lib/schemas/feature-flags';
import { parseOr } from '@/lib/schemas/service-content';

export const metadata: Metadata = { title: 'Extra features' };
export const dynamic = 'force-dynamic';

export default async function FeaturesSettingsPage() {
  const settings = await db.siteSettings.findUnique({
    where: { id: 'singleton' },
    select: { featureFlags: true, muhuratDates: true, instagramToken: true },
  });

  const values: FeaturesFormValues = {
    flags: parseOr(featureFlagsSchema, settings?.featureFlags, DEFAULT_FLAGS),
    muhurat: parseOr(muhuratDatesSchema, settings?.muhuratDates, []).map((entry) => ({
      date: entry.date,
      labelEn: entry.labelEn,
      labelGu: entry.labelGu,
    })),
    // Only whether a token exists crosses to the browser, never the token.
    hasToken: Boolean(settings?.instagramToken),
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/settings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-maroon"
      >
        <ArrowLeft className="size-4" />
        Settings
      </Link>

      <h1 className="mt-4 font-display text-display-md font-medium text-ink">Extra features</h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
        Optional additions to the public site. Every one is off until you switch it on, and
        switching one off removes it completely — visitors do not download it.
      </p>

      <FeaturesForm values={values} />
    </div>
  );
}
