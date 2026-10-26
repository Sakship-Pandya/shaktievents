'use client';

import { LoaderCircle, Save } from 'lucide-react';
import { useActionState, useEffect, useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { RepeatableList } from '../../services/repeatable-list';
import { saveFeatures, type FeaturesState } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FeatureFlags } from '@/lib/schemas/feature-flags';

const initial: FeaturesState = { ok: false, message: null };

/**
 * Plain-English descriptions matter more here than anywhere else in the admin:
 * these switches change what visitors see, and the person flipping them is the
 * business owner, not a developer.
 */
const FLAGS: { key: keyof FeatureFlags; title: string; blurb: string }[] = [
  {
    key: 'countdown',
    title: 'Muhurat countdown',
    blurb:
      'Shows a strip on the home page counting down to the next muhurat date below. Needs at least one future date, otherwise nothing appears.',
  },
  {
    key: 'styleExplorer',
    title: 'Mandap style explorer',
    blurb:
      'A swipe-through of mandap styles on the portfolio page. Visitors keep the ones they like and send the shortlist on WhatsApp. Uses your published projects.',
  },
  {
    key: 'panorama',
    title: '360° viewer',
    blurb:
      'On a project page that has a 360 photo saved, adds a drag-to-look viewer under the gallery. Projects without one are unaffected.',
  },
  {
    key: 'instagram',
    title: 'Instagram feed',
    blurb:
      'Shows your latest Instagram posts on the home page. Needs the token below. If Instagram stops answering, the section simply disappears.',
  },
  {
    key: 'popup',
    title: 'Enquiry popup',
    blurb:
      'A small “get a quote” box that slides in after eight seconds, once per visit. Never shown on the quote or contact pages. Use sparingly — it can annoy people.',
  },
];

export type FeaturesFormValues = {
  flags: FeatureFlags;
  muhurat: Record<string, string>[];
  hasToken: boolean;
};

function Switch({
  flagKey,
  title,
  blurb,
  checked,
}: {
  flagKey: string;
  title: string;
  blurb: string;
  checked: boolean;
}) {
  const id = useId();
  return (
    <li className="flex items-start gap-4 border-b border-border/60 py-4 last:border-0 last:pb-0">
      <input
        id={id}
        type="checkbox"
        name={`flag.${flagKey}`}
        defaultChecked={checked}
        className="mt-1 size-4 shrink-0 accent-[var(--color-maroon)]"
      />
      <div>
        <label htmlFor={id} className="block text-sm font-semibold text-ink">
          {title}
        </label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{blurb}</p>
      </div>
    </li>
  );
}

function SaveBar() {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-end gap-4 border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <p className="mr-auto text-xs text-muted-foreground">
        Anything switched off is not sent to the visitor&rsquo;s browser at all.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-7 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? 'Saving…' : 'Save features'}
      </button>
    </div>
  );
}

export function FeaturesForm({ values }: { values: FeaturesFormValues }) {
  const [state, action] = useActionState(saveFeatures, initial);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Extra features</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          All off by default. Turn one on, look at the site, turn it off again if you do not like it
          — nothing else changes.
        </p>
        <ul className="mt-4">
          {FLAGS.map((flag) => (
            <Switch
              key={flag.key}
              flagKey={flag.key}
              title={flag.title}
              blurb={flag.blurb}
              checked={values.flags[flag.key]}
            />
          ))}
        </ul>
      </section>

      <RepeatableList
        name="muhurat"
        label="Muhurat dates"
        hint="Auspicious wedding dates for the season. The countdown shows the next one that has not passed. Date must be written as 2026-11-21."
        fields={[
          { key: 'date', label: 'Date (yyyy-mm-dd)', placeholder: '2026-11-21' },
          { key: 'labelEn', label: 'Label (English)', placeholder: 'Dev Uthni Ekadashi' },
          { key: 'labelGu', label: 'Label (Gujarati)', placeholder: 'દેવ ઊઠી એકાદશી' },
        ]}
        initialRows={values.muhurat}
        columns={2}
      />

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Instagram token</h2>
        <p className="mt-1.5 mb-4 text-sm text-muted-foreground">
          {values.hasToken
            ? 'A token is saved. Leave this box empty to keep it. Instagram tokens stop working after about 60 days — paste a fresh one here when the feed goes empty.'
            : 'No token saved yet. Paste a long-lived Instagram Graph API token to switch the feed on.'}
        </p>
        <div className="max-w-xl">
          <Label htmlFor="instagramToken">
            {values.hasToken ? 'Replace token' : 'Access token'}
          </Label>
          <Input
            id="instagramToken"
            name="instagramToken"
            type="password"
            autoComplete="off"
            disabled={clearing}
            placeholder={values.hasToken ? 'Leave blank to keep the saved token' : 'IGQVJ…'}
            className="mt-2 h-9 font-mono"
          />
        </div>
        {values.hasToken ? (
          <label className="mt-4 flex items-center gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              name="clearInstagramToken"
              checked={clearing}
              onChange={(event) => setClearing(event.target.checked)}
              className="size-4 accent-[var(--color-maroon)]"
            />
            Remove the saved token
          </label>
        ) : null}
      </section>

      <SaveBar />
    </form>
  );
}
