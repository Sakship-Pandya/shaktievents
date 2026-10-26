import { Fragment, type ReactNode } from 'react';
import { headingId, type RichBlock, type RichText, type TextNode } from '@/lib/schemas/rich-text';

/**
 * Renders the validated document subset from lib/schemas/rich-text.ts. The
 * schema guarantees the node types, so this can be exhaustive rather than
 * defensive — anything it cannot draw was rejected on save.
 *
 * Headings start at h2: the page title is the only h1.
 */
function renderText(nodes: TextNode[] | undefined): ReactNode {
  if (!nodes) return null;

  return nodes.map((node, i) => {
    let element: ReactNode = node.text;

    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold')
        element = <strong className="font-semibold text-ink">{element}</strong>;
      else if (mark.type === 'italic') element = <em>{element}</em>;
      else if (mark.type === 'code') {
        element = <code className="rounded bg-sand px-1.5 py-0.5 text-[0.85em]">{element}</code>;
      } else if (mark.type === 'link' && mark.attrs?.href) {
        const href = mark.attrs.href;
        const external = /^https?:\/\//.test(href);
        element = (
          <a
            href={href}
            className="text-maroon underline underline-offset-4 hover:text-maroon-600"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {element}
          </a>
        );
      }
    }

    return <Fragment key={i}>{element}</Fragment>;
  });
}

function renderBlock(block: RichBlock, index: number): ReactNode {
  switch (block.type) {
    case 'heading': {
      const text = (block.content ?? []).map((n) => n.text).join('');
      const id = headingId(text, index);
      const Tag = (['h2', 'h3', 'h4'] as const)[block.attrs.level - 2] ?? 'h3';
      return (
        <Tag
          key={index}
          id={id}
          className={
            block.attrs.level === 2
              ? 'mt-14 scroll-mt-28 font-display text-display-sm font-medium text-ink first:mt-0'
              : 'mt-9 scroll-mt-28 font-display text-xl font-medium text-ink'
          }
        >
          {renderText(block.content)}
        </Tag>
      );
    }

    case 'paragraph':
      return (
        <p key={index} className="mt-5 text-base leading-relaxed text-muted-foreground">
          {renderText(block.content)}
        </p>
      );

    case 'bulletList':
      return (
        <ul key={index} className="mt-5 space-y-2.5">
          {(block.content ?? []).map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-maroon" />
              <span>{childrenOf(item).map((child, j) => renderInline(child, j))}</span>
            </li>
          ))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={index} className="mt-5 space-y-2.5">
          {(block.content ?? []).map((item, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
              <span aria-hidden className="mt-0.5 font-display text-maroon tabular">
                {i + 1}.
              </span>
              <span>{childrenOf(item).map((child, j) => renderInline(child, j))}</span>
            </li>
          ))}
        </ol>
      );

    case 'blockquote':
      return (
        <blockquote
          key={index}
          className="mt-8 border-l-2 border-maroon/40 pl-6 font-display text-lg leading-relaxed text-ink"
        >
          {childrenOf(block).map((child, i) => renderInline(child, i))}
        </blockquote>
      );

    case 'horizontalRule':
      return <hr key={index} className="my-12 hairline" />;

    case 'listItem':
      // Only reached through a list, which unwraps it above.
      return null;
  }
}

/** List and quote children are paragraphs; render them without the top margin. */
function renderInline(block: RichBlock, index: number): ReactNode {
  if (block.type === 'paragraph') {
    return <Fragment key={index}>{renderText(block.content)}</Fragment>;
  }
  return renderBlock(block, index);
}

/** Children of a list item or quote. `horizontalRule` has no content at all. */
function childrenOf(block: RichBlock): RichBlock[] {
  return 'content' in block && Array.isArray(block.content) ? (block.content as RichBlock[]) : [];
}

export function RichTextBody({ doc }: { doc: RichText }) {
  return <div>{doc.content.map((block, index) => renderBlock(block, index))}</div>;
}
