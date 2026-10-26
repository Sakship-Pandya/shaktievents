'use client';

import { LoaderCircle, Save, Trash2 } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { deletePost, savePost, type RowState } from './actions';
import { Check, Field, Select } from '@/components/admin/form-bits';
import { RichTextEditor } from '@/components/admin/rich-text-editor';

const initial: RowState = { ok: false, message: null };

export type PostValues = {
  id: string | null;
  scalars: Record<string, string>;
  status: string;
  noindex: boolean;
  bodyEn: string;
  bodyGu: string;
  categories: { value: string; label: string }[];
};

const STATUS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function SaveBar({ id }: { id: string | null }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-end gap-3 border-t border-border bg-ivory/95 px-5 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
      <p className="mr-auto text-xs text-muted-foreground">
        Reading time is worked out from the article, so it can never contradict its length.
      </p>
      {id ? (
        <button
          type="submit"
          formAction={deletePost.bind(null, id)}
          onClick={(e) => {
            if (!confirm('Delete this post permanently? Its URL goes with it.')) e.preventDefault();
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-error/40 px-5 text-sm font-semibold text-error transition-colors hover:bg-error/10"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-7 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600 disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
        {pending ? 'Saving…' : 'Save post'}
      </button>
    </div>
  );
}

export function PostForm({ values }: { values: PostValues }) {
  const [state, action] = useActionState(savePost, initial);
  const v = (key: string) => values.scalars[key] ?? '';

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-6">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Post</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field name="titleEn" label="Title (English)" value={v('titleEn')} required />
          <Field name="titleGu" label="Title (Gujarati)" value={v('titleGu')} required />
          <Field
            name="slug"
            label="URL slug"
            value={v('slug')}
            required
            wide
            hint="Changing this breaks any link already shared."
          />
          <Field name="excerptEn" label="Excerpt (English)" value={v('excerptEn')} multiline wide />
          <Field
            name="excerptGu"
            label="Excerpt (Gujarati)"
            value={v('excerptGu')}
            multiline
            wide
          />
          <Select
            name="categoryId"
            label="Category"
            value={v('categoryId')}
            options={values.categories}
            placeholder="—"
          />
          <Select name="status" label="Status" value={values.status} options={STATUS} />
          <Field name="coverUrl" label="Cover image URL" value={v('coverUrl')} wide />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-5 font-display text-display-sm font-medium text-ink">Article</h2>
        <div className="space-y-6">
          <RichTextEditor name="bodyEn" initialJson={values.bodyEn} label="English" />
          <RichTextEditor name="bodyGu" initialJson={values.bodyGu} label="Gujarati" />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Search listing</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field name="seoTitleEn" label="Title (English)" value={v('seoTitleEn')} />
          <Field name="seoTitleGu" label="Title (Gujarati)" value={v('seoTitleGu')} />
          <Field
            name="seoDescriptionEn"
            label="Description (English)"
            value={v('seoDescriptionEn')}
            multiline
            rows={2}
          />
          <Field
            name="seoDescriptionGu"
            label="Description (Gujarati)"
            value={v('seoDescriptionGu')}
            multiline
            rows={2}
          />
          <div className="flex items-end pb-2">
            <Check name="noindex" label="Keep out of search results" checked={values.noindex} />
          </div>
        </div>
      </section>

      <SaveBar id={values.id} />
    </form>
  );
}
