import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { readRows } from '@/lib/form-rows';
import { describeSection, parseSectionProps, readSectionForm } from '@/lib/section-schema';
import { sectionDefinitions, sectionKeys, isSectionKey } from '@/components/sections/definitions';

const schema = z.object({
  showStats: z.boolean().default(true).describe('Show the stats strip'),
  limit: z.number().int().min(3).max(14).default(6).describe('How many cards'),
  heading: z.string().max(120).default('').describe('Heading override'),
  tone: z.enum(['dark', 'light']).default('dark').describe('Section tone'),
});

describe('describeSection', () => {
  const fields = describeSection(schema);
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]));

  it('keeps the declared field order', () => {
    expect(fields.map((f) => f.name)).toEqual(['showStats', 'limit', 'heading', 'tone']);
  });

  it('uses .describe() as the form label', () => {
    expect(byName.showStats?.label).toBe('Show the stats strip');
  });

  it('reads defaults through the .default() wrapper', () => {
    expect(byName.showStats).toMatchObject({ kind: 'boolean', defaultValue: true });
    expect(byName.limit).toMatchObject({ kind: 'number', defaultValue: 6 });
    expect(byName.heading).toMatchObject({ kind: 'text', defaultValue: '' });
  });

  it('carries number bounds through to the input', () => {
    expect(byName.limit).toMatchObject({ min: 3, max: 14 });
  });

  it('turns an enum into a select with its options', () => {
    expect(byName.tone).toMatchObject({
      kind: 'select',
      options: ['dark', 'light'],
      defaultValue: 'dark',
    });
  });

  it('falls back to the field name when there is no description', () => {
    const [field] = describeSection(z.object({ bare: z.boolean().default(false) }));
    expect(field?.label).toBe('bare');
  });
});

describe('readSectionForm', () => {
  const fields = describeSection(schema);

  it('treats an absent checkbox as false', () => {
    // Unchecked boxes are simply missing from FormData.
    const form = new FormData();
    form.set('props.limit', '9');
    expect(readSectionForm(fields, form).showStats).toBe(false);
  });

  it('treats a present checkbox as true', () => {
    const form = new FormData();
    form.set('props.showStats', 'on');
    expect(readSectionForm(fields, form).showStats).toBe(true);
  });

  it('coerces numbers and keeps text', () => {
    const form = new FormData();
    form.set('props.limit', '9');
    form.set('props.heading', 'Our work');
    const values = readSectionForm(fields, form);
    expect(values.limit).toBe(9);
    expect(values.heading).toBe('Our work');
  });

  it('falls back to the default when a number field is left blank', () => {
    const form = new FormData();
    form.set('props.limit', '');
    expect(readSectionForm(fields, form).limit).toBe(6);
  });
});

describe('parseSectionProps', () => {
  it('fills in every missing prop from the schema defaults', () => {
    expect(parseSectionProps(schema, {})).toEqual({
      showStats: true,
      limit: 6,
      heading: '',
      tone: 'dark',
    });
  });

  it('keeps valid stored values', () => {
    expect(parseSectionProps(schema, { limit: 12 })).toMatchObject({ limit: 12 });
  });

  it('falls back to defaults rather than throwing on stale props', () => {
    // A section edited before a schema change must still render.
    expect(parseSectionProps(schema, { limit: 999, tone: 'neon' })).toMatchObject({
      limit: 6,
      tone: 'dark',
    });
  });
});

describe('section definitions', () => {
  it('every registered section parses with no stored props', () => {
    for (const key of sectionKeys) {
      expect(() => sectionDefinitions[key].schema.parse({})).not.toThrow();
    }
  });

  it('every field has a label and a supported kind', () => {
    for (const key of sectionKeys) {
      for (const field of describeSection(sectionDefinitions[key].schema)) {
        expect(field.label).not.toBe('');
        expect(['boolean', 'number', 'text', 'select']).toContain(field.kind);
      }
    }
  });

  it('recognises only registered keys', () => {
    expect(isSectionKey('Hero')).toBe(true);
    expect(isSectionKey('NotASection')).toBe(false);
  });
});

describe('readRows', () => {
  const fields = ['en', 'gu'];

  function form(entries: [string, string][]) {
    const fd = new FormData();
    for (const [k, v] of entries) fd.set(k, v);
    return fd;
  }

  it('groups inputs by index and keeps their order', () => {
    const rows = readRows(
      form([
        ['inclusions.1.en', 'Second'],
        ['inclusions.1.gu', 'બીજું'],
        ['inclusions.0.en', 'First'],
        ['inclusions.0.gu', 'પહેલું'],
      ]),
      'inclusions',
      fields,
    );
    expect(rows).toEqual([
      { en: 'First', gu: 'પહેલું' },
      { en: 'Second', gu: 'બીજું' },
    ]);
  });

  it('closes the gap left by a removed row', () => {
    // The editor deletes row 1, so indices jump 0 → 2.
    const rows = readRows(
      form([
        ['inclusions.0.en', 'First'],
        ['inclusions.2.en', 'Third'],
      ]),
      'inclusions',
      fields,
    );
    expect(rows).toEqual([{ en: 'First' }, { en: 'Third' }]);
  });

  it('drops rows where every field is blank', () => {
    const rows = readRows(
      form([
        ['inclusions.0.en', 'Kept'],
        ['inclusions.1.en', '   '],
        ['inclusions.1.gu', ''],
      ]),
      'inclusions',
      fields,
    );
    expect(rows).toEqual([{ en: 'Kept' }]);
  });

  it('ignores other lists and unknown fields', () => {
    const rows = readRows(
      form([
        ['inclusions.0.en', 'Mine'],
        ['specs.0.en', 'Not mine'],
        ['inclusions.0.bogus', 'ignored'],
      ]),
      'inclusions',
      fields,
    );
    expect(rows).toEqual([{ en: 'Mine' }]);
  });
});
