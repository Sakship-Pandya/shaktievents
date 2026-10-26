import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostForm, type PostValues } from '../post-form';
import { db } from '@/lib/db';
import { EMPTY_DOC, richTextSchema } from '@/lib/schemas/rich-text';
import { EMPTY_SEO, parseOr, seoSchema } from '@/lib/schemas/service-content';

export const metadata: Metadata = { title: 'Edit post' };
export const dynamic = 'force-dynamic';

const NEW = 'new';

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: id } = await params;
  const isNew = id === NEW;

  const [post, categories] = await Promise.all([
    isNew ? null : db.blogPost.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
  ]);

  if (!isNew && !post) notFound();

  const seo = post ? parseOr(seoSchema, post.seo, EMPTY_SEO) : EMPTY_SEO;
  const bodyEn = post ? parseOr(richTextSchema, post.bodyEn, EMPTY_DOC) : EMPTY_DOC;
  const bodyGu = post ? parseOr(richTextSchema, post.bodyGu, EMPTY_DOC) : EMPTY_DOC;

  const values: PostValues = {
    id: post?.id ?? null,
    status: post?.status ?? 'DRAFT',
    noindex: seo.noindex,
    bodyEn: JSON.stringify(bodyEn),
    bodyGu: JSON.stringify(bodyGu),
    categories: categories.map((c) => ({ value: c.id, label: c.nameEn })),
    scalars: {
      slug: post?.slug ?? '',
      titleEn: post?.titleEn ?? '',
      titleGu: post?.titleGu ?? '',
      excerptEn: post?.excerptEn ?? '',
      excerptGu: post?.excerptGu ?? '',
      coverUrl: post?.coverUrl ?? '',
      categoryId: post?.categoryId ?? '',
      seoTitleEn: seo.titleEn ?? '',
      seoTitleGu: seo.titleGu ?? '',
      seoDescriptionEn: seo.descriptionEn ?? '',
      seoDescriptionGu: seo.descriptionGu ?? '',
    },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-maroon"
      >
        <ArrowLeft className="size-4" />
        All posts
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-display-md font-medium text-ink">
          {post ? post.titleEn : 'New post'}
        </h1>
        {post?.status === 'PUBLISHED' ? (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-maroon"
          >
            View page ↗
          </a>
        ) : null}
      </div>

      <PostForm values={values} />
    </div>
  );
}
