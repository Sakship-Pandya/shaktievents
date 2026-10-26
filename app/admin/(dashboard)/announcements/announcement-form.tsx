'use client';

import { LoaderCircle, Trash2 } from 'lucide-react';
import { useActionState, useEffect, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  type AnnouncementState,
} from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initial: AnnouncementState = { ok: false, message: null };

export type AnnouncementRow = {
  id: string;
  textEn: string;
  textGu: string;
  href: string | null;
  isActive: boolean;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-full bg-maroon px-5 text-[0.8rem] font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
      {pending ? 'Saving…' : label}
    </button>
  );
}

function Fields({ row }: { row?: AnnouncementRow }) {
  const ids = { en: useId(), gu: useId(), href: useId() };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor={ids.en}>English text</Label>
        <Input
          id={ids.en}
          name="textEn"
          defaultValue={row?.textEn ?? ''}
          maxLength={160}
          required
          placeholder="Now booking for Lagan Season 2026-27"
          className="mt-1.5 h-9"
        />
      </div>
      <div>
        <Label htmlFor={ids.gu}>Gujarati text</Label>
        <Input
          id={ids.gu}
          name="textGu"
          defaultValue={row?.textGu ?? ''}
          maxLength={160}
          required
          className="mt-1.5 h-9"
        />
      </div>
      <div>
        <Label htmlFor={ids.href}>Link (optional)</Label>
        <Input
          id={ids.href}
          name="href"
          defaultValue={row?.href ?? ''}
          placeholder="/get-quote"
          className="mt-1.5 h-9"
        />
      </div>
      <label className="flex items-end gap-2.5 pb-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={row?.isActive ?? false}
          className="size-4 accent-[var(--color-maroon)]"
        />
        Show on the site
      </label>
    </div>
  );
}

export function NewAnnouncementForm() {
  const [state, action] = useActionState(createAnnouncement, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="rounded-xl border border-dashed border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-medium text-ink">Add an announcement</h2>
      <Fields />
      <div className="mt-5 flex justify-end">
        <SubmitButton label="Add" />
      </div>
    </form>
  );
}

export function AnnouncementCard({ row }: { row: AnnouncementRow }) {
  const [state, action] = useActionState(updateAnnouncement, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <li className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase ${
            row.isActive
              ? 'bg-success/15 text-success'
              : 'border border-border text-muted-foreground'
          }`}
        >
          {row.isActive ? 'Live' : 'Hidden'}
        </span>
        <form action={deleteAnnouncement.bind(null, row.id)}>
          <button
            type="submit"
            title="Delete"
            aria-label="Delete announcement"
            className="grid size-8 place-items-center rounded-lg border border-border text-error transition-colors hover:border-error/40 hover:bg-error/10"
          >
            <Trash2 className="size-4" />
          </button>
        </form>
      </div>

      <form action={action}>
        <input type="hidden" name="id" value={row.id} />
        <Fields row={row} />
        <div className="mt-5 flex justify-end">
          <SubmitButton label="Save" />
        </div>
      </form>
    </li>
  );
}
