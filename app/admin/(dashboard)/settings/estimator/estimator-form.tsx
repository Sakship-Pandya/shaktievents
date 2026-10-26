'use client';

import { LoaderCircle, Save } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { RepeatableList } from '../../services/repeatable-list';
import { saveEstimatorRules, type EstimatorState } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initial: EstimatorState = { ok: false, message: null };

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export type EstimatorFormValues = {
  services: { slug: string; name: string; base: string }[];
  bands: Record<string, string>[];
  peakMonths: number[];
  peakMultiplier: string;
  perKm: string;
  spreadPct: string;
  minTotal: string;
};

function SaveBar() {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-end gap-4 border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <p className="mr-auto text-xs text-muted-foreground">
        Leave every base price blank and the quote form shows no figure at all.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-7 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? 'Saving…' : 'Save rules'}
      </button>
    </div>
  );
}

export function EstimatorForm({ values }: { values: EstimatorFormValues }) {
  const [state, action] = useActionState(saveEstimatorRules, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">
          Base price per service
        </h2>
        <p className="mt-1.5 mb-5 text-sm text-muted-foreground">
          What a typical job of this service starts at, in rupees, before guest count and season.
          Blank means the estimator ignores that service.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {values.services.map((service) => (
            <div key={service.slug} className="flex items-center gap-3">
              <Label htmlFor={`base-${service.slug}`} className="flex-1 text-sm font-normal">
                {service.name}
              </Label>
              <Input
                id={`base-${service.slug}`}
                name={`base.${service.slug}`}
                type="number"
                min={0}
                step={500}
                defaultValue={service.base}
                placeholder="—"
                className="h-9 w-32"
              />
            </div>
          ))}
        </div>
      </section>

      <RepeatableList
        name="bands"
        label="Guest bands"
        hint="A job for 2,000 guests costs more than the same job for 200. Multiplier applies to the base total; bands are matched smallest first."
        fields={[
          { key: 'upTo', label: 'Up to (guests)', placeholder: '500' },
          { key: 'multiplier', label: 'Multiplier', placeholder: '1.8' },
        ]}
        initialRows={values.bands}
      />

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Season</h2>
        <p className="mt-1.5 mb-5 text-sm text-muted-foreground">
          Months that count as lagan season. The quote form also warns visitors when their date
          falls in one.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MONTHS.map((month, index) => (
            <label key={month} className="flex items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                name="peakMonths"
                value={index + 1}
                defaultChecked={values.peakMonths.includes(index + 1)}
                className="size-4 accent-[var(--color-maroon)]"
              />
              {month}
            </label>
          ))}
        </div>
        <div className="mt-5 max-w-xs">
          <Label htmlFor="peakMultiplier">Season multiplier</Label>
          <Input
            id="peakMultiplier"
            name="peakMultiplier"
            type="number"
            step="0.05"
            min="1"
            defaultValue={values.peakMultiplier}
            className="mt-2 h-9"
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Adjustments</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="perKm">Cost per km</Label>
            <Input
              id="perKm"
              name="perKm"
              type="number"
              min="0"
              defaultValue={values.perKm}
              className="mt-2 h-9"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">Blank turns distance off.</p>
          </div>
          <div>
            <Label htmlFor="spreadPct">Range width (±%)</Label>
            <Input
              id="spreadPct"
              name="spreadPct"
              type="number"
              min="0"
              max="60"
              defaultValue={values.spreadPct}
              className="mt-2 h-9"
            />
          </div>
          <div>
            <Label htmlFor="minTotal">Minimum total (₹)</Label>
            <Input
              id="minTotal"
              name="minTotal"
              type="number"
              min="0"
              defaultValue={values.minTotal}
              className="mt-2 h-9"
            />
          </div>
        </div>
      </section>

      <SaveBar />
    </form>
  );
}
