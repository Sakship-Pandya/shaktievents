'use client';

import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tiptap, restricted to the nodes lib/schemas/rich-text.ts accepts. Anything
 * the editor cannot produce is anything the renderer will never meet — the
 * toolbar is the schema, made clickable.
 *
 * The document is mirrored into a hidden input so the form posts as a normal
 * server action rather than needing its own fetch.
 */
export function RichTextEditor({
  name,
  initialJson,
  label,
}: {
  name: string;
  initialJson: string;
  label: string;
}) {
  const [json, setJson] = useState(initialJson);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        // Not in the render schema, so not offered here.
        codeBlock: false,
      }),
      Link.configure({ openOnClick: false, autolink: false }),
    ],
    content: initialJson ? (JSON.parse(initialJson) as object) : '',
    onUpdate: ({ editor: instance }) => setJson(JSON.stringify(instance.getJSON())),
    editorProps: {
      attributes: {
        class:
          'prose-editor min-h-72 rounded-b-lg border border-t-0 border-input bg-background px-4 py-3 text-sm leading-relaxed text-ink outline-none',
      },
    },
  });

  if (!editor) {
    return <div className="h-80 animate-pulse rounded-lg border border-border bg-sand/50" />;
  }

  const Button = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cn(
        'grid size-8 place-items-center rounded transition-colors',
        active ? 'bg-maroon text-ivory' : 'text-ink hover:bg-sand',
      )}
    >
      {children}
    </button>
  );

  return (
    <div>
      <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
      <input type="hidden" name={name} value={json} />

      <div className="flex flex-wrap gap-1 rounded-t-lg border border-input bg-card p-1.5">
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Section heading"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Sub-heading"
        >
          <Heading3 className="size-4" />
        </Button>
        <span aria-hidden className="mx-1 my-1 w-px bg-border" />
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="size-4" />
        </Button>
        <span aria-hidden className="mx-1 my-1 w-px bg-border" />
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bulleted list"
        >
          <List className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="size-4" />
        </Button>
        <Button onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus className="size-4" />
        </Button>
        <span aria-hidden className="mx-1 my-1 w-px bg-border" />
        <Button
          onClick={() => {
            const previous = editor.getAttributes('link').href as string | undefined;
            const href = window.prompt('Link URL', previous ?? 'https://');
            if (href === null) return;
            if (href === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
          }}
          active={editor.isActive('link')}
          title="Add link"
        >
          <Link2 className="size-4" />
        </Button>
        <Button onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
          <Link2Off className="size-4" />
        </Button>
        <span aria-hidden className="mx-1 my-1 w-px bg-border" />
        <Button onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo2 className="size-4" />
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo2 className="size-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
