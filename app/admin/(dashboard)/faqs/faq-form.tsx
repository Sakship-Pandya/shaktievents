'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { deleteFaq, saveFaq, type RowState } from './actions';
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

export type FaqValues = {
  id: string | null;
  questionEn: string;
  questionGu: string;
  answerEn: string;
  answerGu: string;
  scope: string;
  serviceId: string;
  order: string;
  isActive: boolean;
};

const SCOPES = [
  { value: 'GLOBAL', label: 'General — shows on the FAQ page' },
  { value: 'HOME', label: 'Home page' },
  { value: 'SERVICE', label: 'About one service' },
];

function Fields({ values, services }: { values: Partial<FaqValues>; services: Option[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        name="questionEn"
        label="Question (English)"
        value={values.questionEn ?? ''}
        required
        wide
      />
      <Field
        name="questionGu"
        label="Question (Gujarati)"
        value={values.questionGu ?? ''}
        required
        wide
      />
      <Field
        name="answerEn"
        label="Answer (English)"
        value={values.answerEn ?? ''}
        multiline
        rows={4}
        required
        wide
      />
      <Field
        name="answerGu"
        label="Answer (Gujarati)"
        value={values.answerGu ?? ''}
        multiline
        rows={4}
        required
        wide
      />
      <Select
        name="scope"
        label="Where it appears"
        value={values.scope ?? 'GLOBAL'}
        options={SCOPES}
      />
      <Select
        name="serviceId"
        label="Service"
        value={values.serviceId ?? ''}
        options={services.map((s) => ({ value: s.id, label: s.label }))}
        placeholder="—"
      />
      <Field name="order" label="Order" value={values.order ?? '0'} type="number" />
      <div className="flex items-end pb-2">
        <Check name="isActive" label="Show on the site" checked={values.isActive ?? true} />
      </div>
    </div>
  );
}

export function NewFaqForm({ services }: { services: Option[] }) {
  const [state, action] = useActionState(saveFaq, initial);
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
      <h2 className="mb-4 font-display text-lg font-medium text-ink">Add a question</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        These carry FAQ schema markup, so the answer has to be something you can stand behind — it
        can appear directly in search results.
      </p>
      <Fields values={{ isActive: true }} services={services} />
      <div className="mt-5 flex justify-end">
        <SaveButton label="Add" />
      </div>
    </form>
  );
}

export function FaqCard({ values, services }: { values: FaqValues; services: Option[] }) {
  const [state, action] = useActionState(saveFaq, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <AdminCard
      title={values.questionEn}
      badge={
        !values.isActive ? (
          <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase">
            Hidden
          </span>
        ) : null
      }
      onDelete={
        <DeleteButton
          action={deleteFaq.bind(null, values.id ?? '')}
          confirmText="Delete this question permanently?"
        />
      }
    >
      <details>
        <summary className="cursor-pointer text-sm text-muted-foreground">Edit</summary>
        <form action={action} className="mt-4">
          <input type="hidden" name="id" value={values.id ?? ''} />
          <Fields values={values} services={services} />
          <div className="mt-5 flex justify-end">
            <SaveButton />
          </div>
        </form>
      </details>
    </AdminCard>
  );
}
