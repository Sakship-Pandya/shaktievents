'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { deleteTestimonial, saveTestimonial, type RowState } from './actions';
import {
  AdminCard,
  Check,
  DeleteButton,
  Field,
  SaveButton,
  Select,
} from '@/components/admin/form-bits';

const initial: RowState = { ok: false, message: null };

export type Option = { id: string; label: string };

export type TestimonialValues = {
  id: string | null;
  authorName: string;
  authorRole: string;
  town: string;
  quoteEn: string;
  quoteGu: string;
  rating: string;
  kind: string;
  videoUrl: string;
  sourceUrl: string;
  status: string;
  featured: boolean;
  order: string;
  serviceIds: string[];
  eventTypeId: string;
};

const STATUS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const KIND = [
  { value: 'TEXT', label: 'Written review' },
  { value: 'VIDEO', label: 'Video review' },
];

function Fields({
  values,
  services,
  eventTypes,
}: {
  values: Partial<TestimonialValues>;
  services: Option[];
  eventTypes: Option[];
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="authorName" label="Name" value={values.authorName ?? ''} required />
        <Field name="authorRole" label="Role or family" value={values.authorRole ?? ''} />
        <Field name="town" label="Town" value={values.town ?? ''} />
        <Field name="rating" label="Rating (1–5)" value={values.rating ?? ''} type="number" />
        <Field
          name="quoteEn"
          label="Review (English)"
          value={values.quoteEn ?? ''}
          multiline
          wide
        />
        <Field
          name="quoteGu"
          label="Review (Gujarati)"
          value={values.quoteGu ?? ''}
          multiline
          wide
        />
        <Select name="kind" label="Type" value={values.kind ?? 'TEXT'} options={KIND} />
        <Field
          name="videoUrl"
          label="Video embed URL"
          value={values.videoUrl ?? ''}
          hint="Only for video reviews."
        />
        <Field
          name="sourceUrl"
          label="Original review link"
          value={values.sourceUrl ?? ''}
          hint="Google or another site, if it was posted there."
        />
        <Select
          name="eventTypeId"
          label="Event type"
          value={values.eventTypeId ?? ''}
          options={eventTypes.map((e) => ({ value: e.id, label: e.label }))}
          placeholder="—"
        />
        <Select name="status" label="Status" value={values.status ?? 'DRAFT'} options={STATUS} />
        <Field name="order" label="Order" value={values.order ?? '0'} type="number" />
      </div>

      <fieldset className="mt-4">
        <legend className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Services mentioned
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {services.map((service) => (
            <Check
              key={service.id}
              name="serviceIds"
              value={service.id}
              label={service.label}
              checked={(values.serviceIds ?? []).includes(service.id)}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <Check name="featured" label="Show first" checked={values.featured ?? false} />
      </div>
    </>
  );
}

export function NewTestimonialForm({
  services,
  eventTypes,
}: {
  services: Option[];
  eventTypes: Option[];
}) {
  const [state, action] = useActionState(saveTestimonial, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      ref.current?.reset();
    } else toast.error(state.message);
  }, [state]);

  return (
    <form
      ref={ref}
      action={action}
      className="rounded-xl border border-dashed border-border bg-card p-5"
    >
      <h2 className="mb-4 font-display text-lg font-medium text-ink">Add a review</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Publish reviews as they were given. Nothing here is invented for you — an empty page is
        better than a made-up one.
      </p>
      <Fields values={{}} services={services} eventTypes={eventTypes} />
      <div className="mt-5 flex justify-end">
        <SaveButton label="Add" />
      </div>
    </form>
  );
}

export function TestimonialCard({
  values,
  services,
  eventTypes,
}: {
  values: TestimonialValues;
  services: Option[];
  eventTypes: Option[];
}) {
  const [state, action] = useActionState(saveTestimonial, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <AdminCard
      title={values.authorName}
      badge={
        <span
          className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase ${
            values.status === 'PUBLISHED'
              ? 'bg-success/15 text-success'
              : 'border border-border text-muted-foreground'
          }`}
        >
          {values.status}
        </span>
      }
      onDelete={
        <DeleteButton
          action={deleteTestimonial.bind(null, values.id ?? '')}
          confirmText="Delete this review permanently?"
        />
      }
    >
      <form action={action}>
        <input type="hidden" name="id" value={values.id ?? ''} />
        <Fields values={values} services={services} eventTypes={eventTypes} />
        <div className="mt-5 flex justify-end">
          <SaveButton />
        </div>
      </form>
    </AdminCard>
  );
}
