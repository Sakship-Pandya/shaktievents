'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { saveRedirect, type RowState } from './actions';
import { Check, Field, SaveButton } from '@/components/admin/form-bits';

const initial: RowState = { ok: false, message: null };

export function NewRedirectForm() {
  const [state, action] = useActionState(saveRedirect, initial);
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
      <h2 className="mb-2 font-display text-lg font-medium text-ink">Add a redirect</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Use this when a page URL changes. The old address keeps working, and search engines move the
        ranking across instead of starting the new page from nothing.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="source"
          label="Old path"
          value=""
          required
          placeholder="/services/old-name"
          hint="Must start with /. No language prefix — it applies to both."
        />
        <Field
          name="destination"
          label="New path"
          value=""
          required
          placeholder="/services/new-name"
        />
        <div className="flex items-end pb-2 sm:col-span-2">
          <Check name="permanent" label="Permanent (301) — the usual choice" checked />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <SaveButton label="Add redirect" />
      </div>
    </form>
  );
}
