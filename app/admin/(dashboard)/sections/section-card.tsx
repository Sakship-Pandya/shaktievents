'use client';

import { ChevronDown, ChevronUp, Eye, EyeOff, LoaderCircle, Trash2 } from 'lucide-react';
import { useActionState, useEffect, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import {
  deleteSection,
  moveSection,
  toggleSection,
  updateSectionProps,
  type SectionActionState,
} from './actions';
import type { SectionField } from '@/lib/section-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const initialState: SectionActionState = { ok: false, message: null };

export type SectionCardData = {
  id: string;
  component: string;
  label: string;
  description: string;
  isVisible: boolean;
  isFirst: boolean;
  isLast: boolean;
  fields: SectionField[];
  values: Record<string, unknown>;
};

function IconButton({
  action,
  title,
  disabled,
  danger,
  children,
}: {
  action: () => Promise<void>;
  title: string;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        title={title}
        aria-label={title}
        disabled={disabled}
        className={cn(
          'grid size-8 place-items-center rounded-lg border border-border transition-colors disabled:opacity-35',
          danger
            ? 'text-error hover:border-error/40 hover:bg-error/10'
            : 'text-ink hover:bg-sand disabled:hover:bg-transparent',
        )}
      >
        {children}
      </button>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-full bg-maroon px-5 text-[0.8rem] font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : null}
      {pending ? 'Saving…' : 'Save'}
    </button>
  );
}

function Field({ field, value }: { field: SectionField; value: unknown }) {
  const id = useId();
  const name = `props.${field.name}`;

  if (field.kind === 'boolean') {
    return (
      <label className="flex items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          name={name}
          defaultChecked={value === undefined ? field.defaultValue : value === true}
          className="size-4 accent-[var(--color-maroon)]"
        />
        {field.label}
      </label>
    );
  }

  if (field.kind === 'select') {
    return (
      <div>
        <Label htmlFor={id}>{field.label}</Label>
        <select
          id={id}
          name={name}
          defaultValue={typeof value === 'string' ? value : field.defaultValue}
          className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        name={name}
        type={field.kind === 'number' ? 'number' : 'text'}
        defaultValue={
          value === undefined || value === null ? String(field.defaultValue) : String(value)
        }
        min={field.kind === 'number' ? (field.min ?? undefined) : undefined}
        max={field.kind === 'number' ? (field.max ?? undefined) : undefined}
        maxLength={field.kind === 'text' ? (field.maxLength ?? undefined) : undefined}
        className="mt-1.5 h-9"
      />
    </div>
  );
}

export function SectionCard({ section }: { section: SectionCardData }) {
  const [state, formAction] = useActionState(updateSectionProps, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <li
      className={cn(
        'rounded-xl border border-border bg-card p-5 transition-opacity',
        !section.isVisible && 'opacity-60',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-medium text-ink">{section.label}</h3>
            {!section.isVisible ? (
              <span className="rounded-full border border-border px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase">
                Hidden
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <IconButton
            action={moveSection.bind(null, section.id, 'up')}
            title="Move up"
            disabled={section.isFirst}
          >
            <ChevronUp className="size-4" />
          </IconButton>
          <IconButton
            action={moveSection.bind(null, section.id, 'down')}
            title="Move down"
            disabled={section.isLast}
          >
            <ChevronDown className="size-4" />
          </IconButton>
          <IconButton
            action={toggleSection.bind(null, section.id)}
            title={section.isVisible ? 'Hide on the site' : 'Show on the site'}
          >
            {section.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </IconButton>
          <IconButton action={deleteSection.bind(null, section.id)} title="Remove section" danger>
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </div>

      {section.fields.length > 0 ? (
        <form action={formAction} className="mt-5 border-t border-border pt-5">
          <input type="hidden" name="sectionId" value={section.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <Field key={field.name} field={field} value={section.values[field.name]} />
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <SaveButton />
          </div>
        </form>
      ) : null}
    </li>
  );
}
