import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EstimatorForm, type EstimatorFormValues } from './estimator-form';
import { db } from '@/lib/db';
import { EMPTY_RULES, estimatorRulesSchema } from '@/lib/schemas/estimator';
import { parseOr } from '@/lib/schemas/service-content';

export const metadata: Metadata = { title: 'Estimator rules' };
export const dynamic = 'force-dynamic';

export default async function EstimatorSettingsPage() {
  const [settings, services] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: 'singleton' }, select: { estimatorRules: true } }),
    db.service.findMany({ orderBy: { order: 'asc' }, select: { slug: true, nameEn: true } }),
  ]);

  const rules = parseOr(estimatorRulesSchema, settings?.estimatorRules, EMPTY_RULES);

  const values: EstimatorFormValues = {
    services: services.map((s) => ({
      slug: s.slug,
      name: s.nameEn,
      base: rules.baseByService[s.slug] ? String(rules.baseByService[s.slug]) : '',
    })),
    bands: rules.guestBands.map((b) => ({
      upTo: String(b.upTo),
      multiplier: String(b.multiplier),
    })),
    peakMonths: rules.peakMonths,
    peakMultiplier: String(rules.peakMultiplier),
    perKm: rules.perKm == null ? '' : String(rules.perKm),
    spreadPct: String(Math.round(rules.spread * 100)),
    minTotal: rules.minTotal == null ? '' : String(rules.minTotal),
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

      <h1 className="mt-4 font-display text-display-md font-medium text-ink">Estimator rules</h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
        What the quote form uses to work out the rough range it shows. Until base prices are set it
        shows no figure and tells the visitor a quote follows a site visit — which is the safe
        default, not a bug.
      </p>

      <EstimatorForm values={values} />
    </div>
  );
}
