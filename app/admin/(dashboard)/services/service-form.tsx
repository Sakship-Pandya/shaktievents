'use client';

import { LoaderCircle, Save } from 'lucide-react';
import { useActionState, useEffect, useId, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { RepeatableList } from './repeatable-list';
import { saveService, type ServiceState } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const initial: ServiceState = { ok: false, message: null };

export type ServiceFormValues = {
  slug: string;
  scalars: Record<string, string>;
  flags: { featured: boolean; isActive: boolean; noindex: boolean };
  rows: {
    inclusions: Record<string, string>[];
    options: Record<string, string>[];
    specs: Record<string, string>[];
    factors: Record<string, string>[];
    processEn: Record<string, string>[];
    processGu: Record<string, string>[];
  };
};

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-display text-display-sm font-medium text-ink">{title}</h2>
      {hint ? <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  name,
  label,
  value,
  multiline,
  rows = 3,
  wide,
  type = 'text',
  hint,
}: {
  name: string;
  label: string;
  value: string;
  multiline?: boolean;
  rows?: number;
  wide?: boolean;
  type?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea id={id} name={name} defaultValue={value} rows={rows} className="mt-2" />
      ) : (
        <Input id={id} name={name} type={type} defaultValue={value} className="mt-2" />
      )}
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Check({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="size-4 accent-[var(--color-maroon)]"
      />
      {label}
    </label>
  );
}

function SaveBar() {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-end gap-4 border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <p className="mr-auto text-xs text-muted-foreground">
        Saving republishes this service page and the hub in both languages.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-7 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? 'Saving…' : 'Save service'}
      </button>
    </div>
  );
}

export function ServiceForm({ values }: { values: ServiceFormValues }) {
  const [state, action] = useActionState(saveService, initial);
  const v = (key: string) => values.scalars[key] ?? '';

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slug" value={values.slug} />

      <Group title="Names" hint="Shown on the hub card, the nav menu and the page heading.">
        <Field name="nameEn" label="Name (English)" value={v('nameEn')} />
        <Field name="nameGu" label="Name (Gujarati)" value={v('nameGu')} />
        <Field name="shortEn" label="Short label (English)" value={v('shortEn')} />
        <Field name="shortGu" label="Short label (Gujarati)" value={v('shortGu')} />
        <Field name="summaryEn" label="Summary (English)" value={v('summaryEn')} multiline wide />
        <Field name="summaryGu" label="Summary (Gujarati)" value={v('summaryGu')} multiline wide />
      </Group>

      <Group title="Page copy — English">
        <Field
          name="promiseEn"
          label="Promise line"
          value={v('promiseEn')}
          multiline
          rows={2}
          wide
        />
        <Field
          name="introEn"
          label="Intro paragraph"
          value={v('introEn')}
          multiline
          rows={6}
          wide
        />
        <Field
          name="closingEn"
          label="Closing paragraph"
          value={v('closingEn')}
          multiline
          rows={3}
          wide
        />
      </Group>

      <RepeatableList
        name="processEn"
        label="How it runs — English"
        fields={[
          { key: 'title', label: 'Step title' },
          { key: 'body', label: 'What happens', multiline: true },
        ]}
        initialRows={values.rows.processEn}
        columns={1}
      />

      <Group title="Page copy — Gujarati">
        <Field
          name="promiseGu"
          label="Promise line"
          value={v('promiseGu')}
          multiline
          rows={2}
          wide
        />
        <Field
          name="introGu"
          label="Intro paragraph"
          value={v('introGu')}
          multiline
          rows={6}
          wide
        />
        <Field
          name="closingGu"
          label="Closing paragraph"
          value={v('closingGu')}
          multiline
          rows={3}
          wide
        />
      </Group>

      <RepeatableList
        name="processGu"
        label="How it runs — Gujarati"
        fields={[
          { key: 'title', label: 'Step title' },
          { key: 'body', label: 'What happens', multiline: true },
        ]}
        initialRows={values.rows.processGu}
        columns={1}
      />

      <RepeatableList
        name="inclusions"
        label="What's included"
        fields={[
          { key: 'en', label: 'English' },
          { key: 'gu', label: 'Gujarati' },
        ]}
        initialRows={values.rows.inclusions}
      />

      <RepeatableList
        name="options"
        label="Options"
        fields={[
          { key: 'nameEn', label: 'Name (English)' },
          { key: 'nameGu', label: 'Name (Gujarati)' },
          { key: 'descEn', label: 'Description (English)', multiline: true },
          { key: 'descGu', label: 'Description (Gujarati)', multiline: true },
        ]}
        initialRows={values.rows.options}
      />

      <RepeatableList
        name="specs"
        label="Sizes and specifications"
        hint="Confirm these against your own equipment before launch."
        fields={[
          { key: 'labelEn', label: 'Label (English)' },
          { key: 'labelGu', label: 'Label (Gujarati)' },
          { key: 'value', label: 'Value', placeholder: '15 m – 30 m' },
        ]}
        initialRows={values.rows.specs}
      />

      <Group
        title="Pricing"
        hint="Leave the amount blank and the page explains that you quote after a site visit."
      >
        <Field name="fromInr" label="Starting price (₹)" value={v('fromInr')} type="number" />
        <div />
        <Field name="unitEn" label="Unit (English)" value={v('unitEn')} hint="e.g. per mandap" />
        <Field name="unitGu" label="Unit (Gujarati)" value={v('unitGu')} />
      </Group>

      <RepeatableList
        name="factors"
        label="What changes the price"
        fields={[
          { key: 'en', label: 'English' },
          { key: 'gu', label: 'Gujarati' },
        ]}
        initialRows={values.rows.factors}
      />

      <Group title="Search listing" hint="Leave blank to use the page heading and promise line.">
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
      </Group>

      <Group title="Visibility">
        <Field name="order" label="Order" value={v('order')} type="number" />
        <div className="flex flex-col justify-end gap-3 pb-1">
          <Check name="isActive" label="Show on the site" checked={values.flags.isActive} />
          <Check name="noindex" label="Keep out of search results" checked={values.flags.noindex} />
        </div>
      </Group>

      <SaveBar />
    </form>
  );
}
