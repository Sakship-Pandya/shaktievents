'use client';

import { LoaderCircle, Save, Trash2 } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * The field, select, checkbox and button pieces every admin form was
 * redefining. Kept deliberately small — anything that needs more than these
 * gets its own component rather than growing options here.
 */
export function Field({
  name,
  label,
  value,
  type = 'text',
  multiline,
  rows = 3,
  wide,
  hint,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  value: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  wide?: boolean;
  hint?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="ml-0.5 text-error">*</span> : null}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          name={name}
          defaultValue={value}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className="mt-2"
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          required={required}
          className="mt-2 h-9"
        />
      )}
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Select({
  name,
  label,
  value,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
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
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Check({
  name,
  label,
  checked,
  value,
}: {
  name: string;
  label: string;
  checked: boolean;
  value?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={checked}
        className="size-4 accent-[var(--color-maroon)]"
      />
      {label}
    </label>
  );
}

export function SaveButton({
  label = 'Save',
  busyLabel = 'Saving…',
}: {
  label?: string;
  busyLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-full bg-maroon px-5 text-[0.8rem] font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
      {pending ? busyLabel : label}
    </button>
  );
}

export function DeleteButton({
  action,
  confirmText,
}: {
  action: () => Promise<void>;
  confirmText: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        title="Delete"
        aria-label="Delete"
        onClick={(e) => {
          if (!confirm(confirmText)) e.preventDefault();
        }}
        className="grid size-8 place-items-center rounded-lg border border-border text-error transition-colors hover:border-error/40 hover:bg-error/10"
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}

export function AdminCard({
  title,
  badge,
  onDelete,
  children,
}: {
  title: ReactNode;
  badge?: ReactNode;
  onDelete?: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <h3 className="truncate font-medium text-ink">{title}</h3>
          {badge}
        </div>
        {onDelete}
      </div>
      {children}
    </li>
  );
}
