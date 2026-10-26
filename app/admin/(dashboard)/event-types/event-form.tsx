'use client';

import { LoaderCircle, Save } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { saveEventType, type RowState } from './actions';
import { RepeatableList } from '../services/repeatable-list';
import { Check, Field } from '@/components/admin/form-bits';

const initial: RowState = { ok: false, message: null };

export type EventValues = {
  slug: string;
  scalars: Record<string, string>;
  flags: { isActive: boolean; noindex: boolean };
  rows: Record<string, Record<string, string>[]>;
};

function SaveBar() {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex justify-end border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-7 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? 'Saving…' : 'Save event type'}
      </button>
    </div>
  );
}

export function EventTypeForm({ values }: { values: EventValues }) {
  const [state, action] = useActionState(saveEventType, initial);
  const v = (key: string) => values.scalars[key] ?? '';

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={values.slug} />

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Names</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field name="nameEn" label="Name (English)" value={v('nameEn')} required />
          <Field name="nameGu" label="Name (Gujarati)" value={v('nameGu')} required />
          <Field
            name="blurbEn"
            label="Card blurb (English)"
            value={v('blurbEn')}
            multiline
            wide
            required
          />
          <Field
            name="blurbGu"
            label="Card blurb (Gujarati)"
            value={v('blurbGu')}
            multiline
            wide
            required
          />
          <Field
            name="promiseEn"
            label="Promise line (English)"
            value={v('promiseEn')}
            multiline
            rows={2}
            wide
          />
          <Field
            name="promiseGu"
            label="Promise line (Gujarati)"
            value={v('promiseGu')}
            multiline
            rows={2}
            wide
          />
        </div>
      </section>

      <RepeatableList
        name="paragraphsEn"
        label="Page copy — English"
        fields={[{ key: 'text', label: 'Paragraph', multiline: true }]}
        initialRows={values.rows.paragraphsEn ?? []}
        columns={1}
      />
      <RepeatableList
        name="paragraphsGu"
        label="Page copy — Gujarati"
        fields={[{ key: 'text', label: 'Paragraph', multiline: true }]}
        initialRows={values.rows.paragraphsGu ?? []}
        columns={1}
      />
      <RepeatableList
        name="needsEn"
        label="What this kind of function needs — English"
        fields={[
          { key: 'title', label: 'Heading' },
          { key: 'body', label: 'Detail', multiline: true },
        ]}
        initialRows={values.rows.needsEn ?? []}
        columns={1}
      />
      <RepeatableList
        name="needsGu"
        label="What this kind of function needs — Gujarati"
        fields={[
          { key: 'title', label: 'Heading' },
          { key: 'body', label: 'Detail', multiline: true },
        ]}
        initialRows={values.rows.needsGu ?? []}
        columns={1}
      />

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Search listing</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field name="seoTitleEn" label="Title (English)" value={v('seoTitleEn')} />
          <Field name="seoTitleGu" label="Title (Gujarati)" value={v('seoTitleGu')} />
          <Field
            name="seoDescriptionEn"
            label="Description (English)"
            value={v('seoDescriptionEn')}
            multiline
            rows={2}
          />
          <Field
            name="seoDescriptionGu"
            label="Description (Gujarati)"
            value={v('seoDescriptionGu')}
            multiline
            rows={2}
          />
          <Field name="order" label="Order" value={v('order')} type="number" />
          <div className="flex flex-col justify-end gap-3 pb-1">
            <Check name="isActive" label="Show on the site" checked={values.flags.isActive} />
            <Check
              name="noindex"
              label="Keep out of search results"
              checked={values.flags.noindex}
            />
          </div>
        </div>
      </section>

      <SaveBar />
    </form>
  );
}
