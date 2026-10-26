import { z } from 'zod';

/**
 * A narrow subset of the ProseMirror/Tiptap document shape — only the nodes
 * the blog actually uses. Validating on the way in means a malformed document
 * cannot reach the renderer, and the renderer can then be exhaustive rather
 * than defensive about node types it has never seen.
 */
export const markSchema = z.object({
  type: z.enum(['bold', 'italic', 'code', 'link']),
  attrs: z
    .object({ href: z.string().max(500).optional() })
    .partial()
    .optional(),
});

export const textNodeSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(markSchema).optional(),
});

export type TextNode = z.infer<typeof textNodeSchema>;

/** Block nodes. Lists nest one level, which is all long-form copy needs. */
export type RichBlock =
  | { type: 'paragraph'; content?: TextNode[] }
  | { type: 'heading'; attrs: { level: number }; content?: TextNode[] }
  | { type: 'blockquote'; content?: RichBlock[] }
  | { type: 'bulletList'; content?: RichBlock[] }
  | { type: 'orderedList'; content?: RichBlock[] }
  | { type: 'listItem'; content?: RichBlock[] }
  | { type: 'horizontalRule' };

export const richBlockSchema: z.ZodType<RichBlock> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({ type: z.literal('paragraph'), content: z.array(textNodeSchema).optional() }),
    z.object({
      type: z.literal('heading'),
      attrs: z.object({ level: z.number().int().min(2).max(4) }),
      content: z.array(textNodeSchema).optional(),
    }),
    z.object({ type: z.literal('blockquote'), content: z.array(richBlockSchema).optional() }),
    z.object({ type: z.literal('bulletList'), content: z.array(richBlockSchema).optional() }),
    z.object({ type: z.literal('orderedList'), content: z.array(richBlockSchema).optional() }),
    z.object({ type: z.literal('listItem'), content: z.array(richBlockSchema).optional() }),
    z.object({ type: z.literal('horizontalRule') }),
  ]),
);

export const richTextSchema = z.object({
  type: z.literal('doc'),
  content: z.array(richBlockSchema).max(300).default([]),
});

export type RichText = z.infer<typeof richTextSchema>;

export const EMPTY_DOC: RichText = { type: 'doc', content: [] };

/** Plain text of a document — used for reading time and meta descriptions. */
export function toPlainText(doc: RichText): string {
  const walk = (blocks: RichBlock[]): string[] =>
    blocks.flatMap((block) => {
      if (block.type === 'horizontalRule') return [];
      if (block.type === 'paragraph' || block.type === 'heading') {
        return (block.content ?? []).map((node) => node.text);
      }
      return walk(block.content ?? []);
    });

  return walk(doc.content).join(' ').replace(/\s+/g, ' ').trim();
}

/** Average adult reading speed, rounded up so a 30-second read never says 0. */
export function readingMinutes(doc: RichText): number {
  const words = toPlainText(doc).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export type TocEntry = { id: string; text: string; level: number };

/**
 * Stable, readable heading ids — the same function runs in the renderer.
 *
 * Composed (NFC), not decomposed: NFKD splits Gujarati vowel signs off as
 * combining marks, which the character class below would then strip, turning
 * "ખર્ચ કેટલો" into "ખરચ કટલ". Marks are kept for the same reason.
 */
export function headingId(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{Letter}\p{Mark}\p{Number}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
  return base ? `${base}-${index}` : `section-${index}`;
}

export function tableOfContents(doc: RichText): TocEntry[] {
  const entries: TocEntry[] = [];
  doc.content.forEach((block, index) => {
    if (block.type !== 'heading' || block.attrs.level > 3) return;
    const text = (block.content ?? []).map((n) => n.text).join('');
    if (!text) return;
    entries.push({ id: headingId(text, index), text, level: block.attrs.level });
  });
  return entries;
}
