'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { deleteVideo, saveVideo, type RowState } from './actions';
import { AdminCard, DeleteButton, Field, SaveButton, Select } from '@/components/admin/form-bits';

const initial: RowState = { ok: false, message: null };

export type VideoValues = {
  id: string | null;
  titleEn: string;
  titleGu: string;
  youtubeId: string;
  category: string;
  order: string;
  status: string;
};

const STATUS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function Fields({ values }: { values: Partial<VideoValues> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field name="titleEn" label="Title (English)" value={values.titleEn ?? ''} required />
      <Field name="titleGu" label="Title (Gujarati)" value={values.titleGu ?? ''} required />
      <Field
        name="youtubeId"
        label="YouTube link or id"
        value={values.youtubeId ?? ''}
        required
        wide
        placeholder="https://youtu.be/…"
        hint="Paste the whole link; the id is pulled out of it."
      />
      <Field name="category" label="Category" value={values.category ?? ''} />
      <Field name="order" label="Order" value={values.order ?? '0'} type="number" />
      <Select name="status" label="Status" value={values.status ?? 'DRAFT'} options={STATUS} />
    </div>
  );
}

export function NewVideoForm() {
  const [state, action] = useActionState(saveVideo, initial);
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
      <h2 className="mb-5 font-display text-lg font-medium text-ink">Add a video</h2>
      <Fields values={{}} />
      <div className="mt-5 flex justify-end">
        <SaveButton label="Add" />
      </div>
    </form>
  );
}

export function VideoCard({ values }: { values: VideoValues }) {
  const [state, action] = useActionState(saveVideo, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <AdminCard
      title={values.titleEn}
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
          action={deleteVideo.bind(null, values.id ?? '')}
          confirmText="Remove this video?"
        />
      }
    >
      <form action={action}>
        <input type="hidden" name="id" value={values.id ?? ''} />
        <Fields values={values} />
        <div className="mt-5 flex justify-end">
          <SaveButton />
        </div>
      </form>
    </AdminCard>
  );
}
