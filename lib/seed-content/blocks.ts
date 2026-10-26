import type { RichBlock, RichText } from '../schemas/rich-text';

/**
 * A tiny authoring format for seed articles. Writing ProseMirror JSON by hand
 * is unreadable, so the copy is authored as tuples and converted here into the
 * exact shape the Tiptap editor and the renderer both expect.
 */
export type Block =
  | ['h2', string]
  | ['h3', string]
  | ['p', string]
  | ['ul', ...string[]]
  | ['ol', ...string[]]
  | ['quote', string]
  | ['hr'];

const text = (value: string) => [{ type: 'text' as const, text: value }];

const listItem = (value: string): RichBlock => ({
  type: 'listItem',
  content: [{ type: 'paragraph', content: text(value) }],
});

export function toDoc(blocks: Block[]): RichText {
  const content: RichBlock[] = blocks.map(([kind, ...rest]) => {
    switch (kind) {
      case 'h2':
        return { type: 'heading', attrs: { level: 2 }, content: text(rest[0] ?? '') };
      case 'h3':
        return { type: 'heading', attrs: { level: 3 }, content: text(rest[0] ?? '') };
      case 'p':
        return { type: 'paragraph', content: text(rest[0] ?? '') };
      case 'ul':
        return { type: 'bulletList', content: (rest as string[]).map(listItem) };
      case 'ol':
        return { type: 'orderedList', content: (rest as string[]).map(listItem) };
      case 'quote':
        return {
          type: 'blockquote',
          content: [{ type: 'paragraph', content: text(rest[0] ?? '') }],
        };
      case 'hr':
        return { type: 'horizontalRule' };
    }
  });

  return { type: 'doc', content };
}

export type ArticleBody = { slug: string; en: Block[]; gu: Block[] };
