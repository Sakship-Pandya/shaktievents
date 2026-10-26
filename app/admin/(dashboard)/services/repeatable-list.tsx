'use client';

import { Plus, X } from 'lucide-react';
import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type RowField = {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
};

/**
 * Repeatable rows for the Json list columns. Inputs are named
 * `<name>.<index>.<field>`, which lib/form-rows.ts reads back. Removing a row
 * leaves a gap in the indices on purpose — the parser closes it — so the other
 * rows never have to be renumbered and lose their values.
 */
export function RepeatableList({
  name,
  label,
  hint,
  fields,
  initialRows,
  columns = 2,
}: {
  name: string;
  label: string;
  hint?: string;
  fields: RowField[];
  initialRows: Record<string, string>[];
  columns?: 1 | 2;
}) {
  const baseId = useId();
  const [keys, setKeys] = useState<number[]>(() =>
    initialRows.length > 0 ? initialRows.map((_, i) => i) : [0],
  );
  const [nextKey, setNextKey] = useState(() => Math.max(1, initialRows.length));

  const addRow = () => {
    setKeys((current) => [...current, nextKey]);
    setNextKey((n) => n + 1);
  };

  const removeRow = (key: number) => {
    setKeys((current) => (current.length === 1 ? current : current.filter((k) => k !== key)));
  };

  return (
    <fieldset className="rounded-xl border border-border bg-card p-5">
      <legend className="px-2 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </legend>
      {hint ? <p className="mb-4 text-xs text-muted-foreground">{hint}</p> : null}

      <ul className="space-y-4">
        {keys.map((key) => {
          const row = initialRows[key] ?? {};
          return (
            <li
              key={key}
              className="flex items-start gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0"
            >
              <div className={`grid flex-1 gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
                {fields.map((field) => {
                  const inputId = `${baseId}-${key}-${field.key}`;
                  const inputName = `${name}.${key}.${field.key}`;
                  return (
                    <div
                      key={field.key}
                      className={field.multiline && columns === 2 ? 'sm:col-span-2' : undefined}
                    >
                      <label
                        htmlFor={inputId}
                        className="mb-1.5 block text-[0.7rem] text-muted-foreground"
                      >
                        {field.label}
                      </label>
                      {field.multiline ? (
                        <Textarea
                          id={inputId}
                          name={inputName}
                          defaultValue={row[field.key] ?? ''}
                          placeholder={field.placeholder}
                          rows={2}
                        />
                      ) : (
                        <Input
                          id={inputId}
                          name={inputName}
                          defaultValue={row[field.key] ?? ''}
                          placeholder={field.placeholder}
                          className="h-9"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => removeRow(key)}
                title="Remove row"
                aria-label="Remove row"
                className="mt-6 grid size-8 shrink-0 place-items-center rounded-lg border border-border text-error transition-colors hover:border-error/40 hover:bg-error/10"
              >
                <X className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-border px-4 text-[0.8rem] font-semibold text-ink transition-colors hover:bg-sand"
      >
        <Plus className="size-3.5" />
        Add row
      </button>
    </fieldset>
  );
}
