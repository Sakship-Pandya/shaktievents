import { describe, expect, it } from 'vitest';
import {
  EMPTY_DOC,
  headingId,
  readingMinutes,
  richTextSchema,
  tableOfContents,
  toPlainText,
  type RichText,
} from '@/lib/schemas/rich-text';

const doc: RichText = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'What it costs' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Five things move the number.' }] },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Size' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Season' }] }],
        },
      ],
    },
    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Season' }] },
    {
      type: 'heading',
      attrs: { level: 4 },
      content: [{ type: 'text', text: 'Too deep for the TOC' }],
    },
  ],
};

describe('toPlainText', () => {
  it('flattens headings, paragraphs and nested list items', () => {
    expect(toPlainText(doc)).toBe(
      'What it costs Five things move the number. Size Season Season Too deep for the TOC',
    );
  });

  it('returns an empty string for an empty document', () => {
    expect(toPlainText(EMPTY_DOC)).toBe('');
  });
});

describe('readingMinutes', () => {
  it('never returns zero for a short post', () => {
    expect(readingMinutes(doc)).toBe(1);
  });

  it('rounds up', () => {
    const long: RichText = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'word '.repeat(250) }] }],
    };
    expect(readingMinutes(long)).toBe(2);
  });
});

describe('tableOfContents', () => {
  it('includes h2 and h3 but not h4', () => {
    expect(tableOfContents(doc).map((e) => e.text)).toEqual(['What it costs', 'Season']);
  });

  it('carries the level through for indenting', () => {
    expect(tableOfContents(doc).map((e) => e.level)).toEqual([2, 3]);
  });

  it('gives every entry an id the renderer will match', () => {
    const entries = tableOfContents(doc);
    expect(entries[0]?.id).toBe('what-it-costs-0');
    expect(entries[1]?.id).toBe('season-3');
  });
});

describe('headingId', () => {
  it('slugs punctuation away but keeps the index unique', () => {
    expect(headingId('How much does it cost?', 2)).toBe('how-much-does-it-cost-2');
  });

  it('keeps Gujarati characters rather than dropping the whole heading', () => {
    expect(headingId('ખર્ચ કેટલો', 1)).toBe('ખર્ચ-કેટલો-1');
  });

  it('falls back when a heading has no usable characters', () => {
    expect(headingId('!!!', 4)).toBe('section-4');
  });
});

describe('richTextSchema', () => {
  it('accepts a valid document', () => {
    expect(richTextSchema.safeParse(doc).success).toBe(true);
  });

  it('rejects a node type the renderer cannot draw', () => {
    // An unknown node would render as nothing; better to catch it on save.
    expect(
      richTextSchema.safeParse({ type: 'doc', content: [{ type: 'image', attrs: {} }] }).success,
    ).toBe(false);
  });

  it('rejects an h1 — the page title is the only h1', () => {
    expect(
      richTextSchema.safeParse({
        type: 'doc',
        content: [{ type: 'heading', attrs: { level: 1 }, content: [] }],
      }).success,
    ).toBe(false);
  });
});
