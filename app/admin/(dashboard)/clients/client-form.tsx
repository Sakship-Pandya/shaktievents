'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { deleteClient, saveClient, type RowState } from './actions';
import { AdminCard, Check, DeleteButton, Field, SaveButton } from '@/components/admin/form-bits';

const initial: RowState = { ok: false, message: null };

export type ClientValues = {
  id: string | null;
  nameEn: string;
  nameGu: string;
  logoUrl: string;
  website: string;
  order: string;
  isActive: boolean;
};

function Fields({ values }: { values: Partial<ClientValues> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field name="nameEn" label="Name (English)" value={values.nameEn ?? ''} required />
      <Field name="nameGu" label="Name (Gujarati)" value={values.nameGu ?? ''} required />
      <Field
        name="logoUrl"
        label="Logo URL"
        value={values.logoUrl ?? ''}
        hint="Optional. Upload in Media first, then paste the URL."
      />
      <Field name="website" label="Website" value={values.website ?? ''} />
      <Field name="order" label="Order" value={values.order ?? '0'} type="number" />
      <div className="flex items-end pb-2">
        <Check name="isActive" label="Show on the site" checked={values.isActive ?? true} />
      </div>
    </div>
  );
}

export function NewClientForm() {
  const [state, action] = useActionState(saveClient, initial);
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
      <h2 className="mb-4 font-display text-lg font-medium text-ink">Add an organisation</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Temples, trusts, schools, samaj and institutions you have worked for. Only add ones that
        would be happy to be named.
      </p>
      <Fields values={{ isActive: true }} />
      <div className="mt-5 flex justify-end">
        <SaveButton label="Add" />
      </div>
    </form>
  );
}

export function ClientCard({ values }: { values: ClientValues }) {
  const [state, action] = useActionState(saveClient, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <AdminCard
      title={values.nameEn}
      onDelete={
        <DeleteButton
          action={deleteClient.bind(null, values.id ?? '')}
          confirmText="Remove this organisation?"
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
