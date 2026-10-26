'use client';

import { LoaderCircle, Save, Trash2 } from 'lucide-react';
import { useActionState, useEffect, useId, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { MediaPicker, type PickableMedia } from './media-picker';
import { RepeatableList } from '../services/repeatable-list';
import { deleteProject, saveProject, type ProjectState } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const initial: ProjectState = { ok: false, message: null };

export type Option = { id: string; label: string };

export type ProjectFormValues = {
  id: string | null;
  scalars: Record<string, string>;
  flags: { featured: boolean };
  status: string;
  serviceIds: string[];
  media: {
    all: PickableMedia[];
    coverId: string | null;
    galleryIds: string[];
    beforeId: string | null;
    afterId: string | null;
  };
  rows: Record<string, Record<string, string>[]>;
  options: { eventTypes: Option[]; services: Option[] };
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
  type = 'text',
  wide,
  multiline,
  hint,
}: {
  name: string;
  label: string;
  value: string;
  type?: string;
  wide?: boolean;
  multiline?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea id={id} name={name} defaultValue={value} rows={3} className="mt-2" />
      ) : (
        <Input id={id} name={name} type={type} defaultValue={value} className="mt-2" />
      )}
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Select({
  name,
  label,
  value,
  options,
  placeholder = '—',
}: {
  name: string;
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        defaultValue={value}
        className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SaveBar({ id }: { id: string | null }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-end gap-3 border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <p className="mr-auto text-xs text-muted-foreground">
        Only published projects appear on the site.
      </p>
      {id ? (
        <button
          type="submit"
          formAction={deleteProject.bind(null, id)}
          onClick={(e) => {
            // Deleting a project takes its URL with it; make it deliberate.
            if (!confirm('Delete this project permanently? Its page and photos links go too.')) {
              e.preventDefault();
            }
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-error/40 px-5 text-sm font-semibold text-error transition-colors hover:bg-error/10"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-7 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? 'Saving…' : 'Save project'}
      </button>
    </div>
  );
}

export function ProjectForm({ values }: { values: ProjectFormValues }) {
  const [state, action] = useActionState(saveProject, initial);
  const v = (key: string) => values.scalars[key] ?? '';

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-6">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}

      <Group title="Event">
        <Field name="titleEn" label="Title (English)" value={v('titleEn')} />
        <Field name="titleGu" label="Title (Gujarati)" value={v('titleGu')} />
        <Field
          name="slug"
          label="URL slug"
          value={v('slug')}
          wide
          hint="Changing this breaks any link already shared. Lowercase, hyphens only."
        />
        <Select
          name="eventTypeId"
          label="Event type"
          value={v('eventTypeId')}
          options={values.options.eventTypes}
        />
        <Field name="venue" label="Venue" value={v('venue')} />
        <Field name="eventDate" label="Date" value={v('eventDate')} type="date" />
      </Group>

      <Group
        title="Scale"
        hint="Leave blank rather than estimating — blank fields are simply not shown."
      >
        <Field name="guests" label="Guests" value={v('guests')} type="number" />
        <Field name="days" label="Days on site" value={v('days')} type="number" />
        <Field name="areaSqft" label="Area covered (sq ft)" value={v('areaSqft')} type="number" />
      </Group>

      <fieldset className="rounded-xl border border-border bg-card p-6">
        <legend className="px-2 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Services on this job
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {values.options.services.map((service) => (
            <label key={service.id} className="flex items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                name="serviceIds"
                value={service.id}
                defaultChecked={values.serviceIds.includes(service.id)}
                className="size-4 accent-[var(--color-maroon)]"
              />
              {service.label}
            </label>
          ))}
        </div>
      </fieldset>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-5 font-display text-display-sm font-medium text-ink">Photographs</h2>
        <MediaPicker
          media={values.media.all}
          initialCoverId={values.media.coverId}
          initialGalleryIds={values.media.galleryIds}
          initialBeforeId={values.media.beforeId}
          initialAfterId={values.media.afterId}
        />
      </section>

      <RepeatableList
        name="briefEn"
        label="The event — English"
        fields={[{ key: 'text', label: 'Paragraph', multiline: true }]}
        initialRows={values.rows.briefEn ?? []}
        columns={1}
      />
      <RepeatableList
        name="briefGu"
        label="The event — Gujarati"
        fields={[{ key: 'text', label: 'Paragraph', multiline: true }]}
        initialRows={values.rows.briefGu ?? []}
        columns={1}
      />
      <RepeatableList
        name="didEn"
        label="What we did — English"
        fields={[{ key: 'text', label: 'Item' }]}
        initialRows={values.rows.didEn ?? []}
        columns={1}
      />
      <RepeatableList
        name="didGu"
        label="What we did — Gujarati"
        fields={[{ key: 'text', label: 'Item' }]}
        initialRows={values.rows.didGu ?? []}
        columns={1}
      />
      <RepeatableList
        name="challengesEn"
        label="What got in the way — English"
        hint="Optional. Leave empty if there was nothing worth telling."
        fields={[
          { key: 'problem', label: 'The problem', multiline: true },
          { key: 'solution', label: 'What we did about it', multiline: true },
        ]}
        initialRows={values.rows.challengesEn ?? []}
        columns={1}
      />
      <RepeatableList
        name="challengesGu"
        label="What got in the way — Gujarati"
        fields={[
          { key: 'problem', label: 'The problem', multiline: true },
          { key: 'solution', label: 'What we did about it', multiline: true },
        ]}
        initialRows={values.rows.challengesGu ?? []}
        columns={1}
      />
      <RepeatableList
        name="videos"
        label="Videos"
        hint="YouTube or Reel URLs."
        fields={[{ key: 'url', label: 'URL' }]}
        initialRows={values.rows.videos ?? []}
        columns={1}
      />

      <Group
        title="360° photograph"
        hint="A single equirectangular (2:1) photo of the finished setup. Shown as a drag-to-look viewer, but only while the 360 viewer is switched on in Settings › Features."
      >
        <Field
          name="panoramaUrl"
          label="Panorama image URL"
          value={v('panoramaUrl')}
          wide
          hint="Leave blank if there is no 360 photo for this project."
        />
      </Group>

      <Group title="Client quote" hint="Only with the client's permission.">
        <Field name="clientName" label="Client name" value={v('clientName')} />
        <div />
        <Field
          name="clientQuoteEn"
          label="Quote (English)"
          value={v('clientQuoteEn')}
          multiline
          wide
        />
        <Field
          name="clientQuoteGu"
          label="Quote (Gujarati)"
          value={v('clientQuoteGu')}
          multiline
          wide
        />
      </Group>

      <Group title="Visibility">
        <Select
          name="status"
          label="Visibility"
          value={values.status}
          placeholder="Not Visible"
          options={[
            { id: 'PUBLISHED', label: 'Visible (Live on website)' },
            { id: 'DRAFT', label: 'Not Visible (Hidden from website)' },
            { id: 'ARCHIVED', label: 'Archived (Hidden from website)' },
          ]}
        />
        <Field name="order" label="Order" value={v('order')} type="number" />
      </Group>

      <SaveBar id={values.id} />
    </form>
  );
}
