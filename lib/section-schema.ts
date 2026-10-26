import { z } from 'zod';

/**
 * Turns a section's zod schema into a list of form fields, so the page builder
 * can render an editor for any registered section without hand-writing a form
 * per section. Only the four field types below are supported — a section that
 * needs anything richer should get a bespoke editor rather than widening this.
 *
 * The label comes from `.describe()`, so schemas read as their own docs:
 *   showStats: z.boolean().default(true).describe('Show the stats strip')
 */
export type SectionField =
  | { name: string; label: string; kind: 'boolean'; defaultValue: boolean }
  | {
      name: string;
      label: string;
      kind: 'number';
      defaultValue: number;
      min: number | null;
      max: number | null;
    }
  | { name: string; label: string; kind: 'text'; defaultValue: string; maxLength: number | null }
  | { name: string; label: string; kind: 'select'; defaultValue: string; options: string[] };

export type SectionSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;

type Def = {
  type: string;
  innerType?: unknown;
  defaultValue?: unknown;
  entries?: Record<string, string>;
};

const defOf = (schema: unknown): Def => (schema as { def: Def }).def;

/** Peels `.default()` / `.optional()` wrappers off, remembering the default. */
function unwrap(schema: unknown): { inner: unknown; defaultValue: unknown } {
  let current = schema;
  let defaultValue: unknown;

  for (let depth = 0; depth < 5; depth++) {
    const def = defOf(current);
    if (def.type === 'default') {
      const raw = def.defaultValue;
      defaultValue = typeof raw === 'function' ? (raw as () => unknown)() : raw;
      current = def.innerType;
    } else if (def.type === 'optional' || def.type === 'nullable') {
      current = def.innerType;
    } else {
      break;
    }
  }

  return { inner: current, defaultValue };
}

export function describeSection(schema: SectionSchema): SectionField[] {
  const shape = (schema as unknown as { def: { shape: Record<string, unknown> } }).def.shape;

  return Object.entries(shape).map(([name, field]) => {
    const label = (field as { description?: string }).description ?? name;
    const { inner, defaultValue } = unwrap(field);
    const kind = defOf(inner).type;

    if (kind === 'boolean') {
      return { name, label, kind: 'boolean', defaultValue: defaultValue === true };
    }

    if (kind === 'number') {
      const num = inner as { minValue: number | null; maxValue: number | null };
      return {
        name,
        label,
        kind: 'number',
        defaultValue: typeof defaultValue === 'number' ? defaultValue : 0,
        min: num.minValue,
        max: num.maxValue,
      };
    }

    if (kind === 'enum') {
      return {
        name,
        label,
        kind: 'select',
        defaultValue: typeof defaultValue === 'string' ? defaultValue : '',
        options: Object.values(defOf(inner).entries ?? {}),
      };
    }

    const str = inner as { maxLength: number | null };
    return {
      name,
      label,
      kind: 'text',
      defaultValue: typeof defaultValue === 'string' ? defaultValue : '',
      maxLength: str.maxLength ?? null,
    };
  });
}

/**
 * Reads a submitted form back into the shape the schema expects. Unchecked
 * checkboxes are absent from FormData, which is why booleans are derived from
 * presence rather than value.
 */
export function readSectionForm(
  fields: SectionField[],
  formData: FormData,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = formData.get(`props.${field.name}`);

    if (field.kind === 'boolean') {
      values[field.name] = raw !== null;
    } else if (field.kind === 'number') {
      values[field.name] = raw === null || raw === '' ? field.defaultValue : Number(raw);
    } else {
      values[field.name] = raw === null ? field.defaultValue : String(raw);
    }
  }

  return values;
}

/** Props stored on a section row, filled in with defaults for anything missing. */
export function parseSectionProps(schema: SectionSchema, stored: unknown): Record<string, unknown> {
  const parsed = schema.safeParse(stored ?? {});
  if (parsed.success) return parsed.data;
  // A section whose stored props no longer match its schema still renders,
  // using defaults, rather than taking the whole page down.
  return schema.parse({});
}
