'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { locales } from '@/i18n/routing';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { EMPTY_DOC, readingMinutes, richTextSchema } from '@/lib/schemas/rich-text';
import { seoSchema } from '@/lib/schemas/service-content';
import { localizedPath } from '@/lib/seo';
import type { Prisma } from '@/lib/generated/prisma/client';

export type RowState = { ok: boolean; message: string | null };

const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? null : t;
};

const postSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only'),
  titleEn: z.string().trim().min(5).max(180),
  titleGu: z.string().trim().min(5).max(180),
  excerptEn: z.preprocess(blankToNull, z.string().max(400).nullable()),
  excerptGu: z.preprocess(blankToNull, z.string().max(400).nullable()),
  coverUrl: z.preprocess(blankToNull, z.string().max(500).nullable()),
  categoryId: z.preprocess(blankToNull, z.string().nullable()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  seoTitleEn: z.preprocess(blankToNull, z.string().max(70).nullable()),
  seoTitleGu: z.preprocess(blankToNull, z.string().max(70).nullable()),
  seoDescriptionEn: z.preprocess(blankToNull, z.string().max(180).nullable()),
  seoDescriptionGu: z.preprocess(blankToNull, z.string().max(180).nullable()),
  noindex: z.boolean(),
});

function refresh(slug: string) {
  revalidatePath('/admin/blog');
  after(() => {
    revalidateTag('blog');
    for (const locale of locales) {
      revalidatePath(localizedPath(locale, `/blog/${slug}`));
      revalidatePath(localizedPath(locale, '/blog'));
    }
  });
}

/** The editor posts a ProseMirror document as a JSON string. */
function parseBody(raw: FormDataEntryValue | null) {
  if (typeof raw !== 'string' || raw.trim() === '') return { ok: true as const, doc: EMPTY_DOC };
  try {
    const parsed = richTextSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return {
        ok: false as const,
        message: parsed.error.issues[0]?.message ?? 'Unsupported formatting.',
      };
    }
    return { ok: true as const, doc: parsed.data };
  } catch {
    return { ok: false as const, message: 'The editor content could not be read.' };
  }
}

export async function savePost(_prev: RowState, formData: FormData): Promise<RowState> {
  const user = await requireUser();
  const id = String(formData.get('id') ?? '');

  const parsed = postSchema.safeParse({
    slug: formData.get('slug'),
    titleEn: formData.get('titleEn'),
    titleGu: formData.get('titleGu'),
    excerptEn: formData.get('excerptEn'),
    excerptGu: formData.get('excerptGu'),
    coverUrl: formData.get('coverUrl'),
    categoryId: formData.get('categoryId'),
    status: formData.get('status') || 'DRAFT',
    seoTitleEn: formData.get('seoTitleEn'),
    seoTitleGu: formData.get('seoTitleGu'),
    seoDescriptionEn: formData.get('seoDescriptionEn'),
    seoDescriptionGu: formData.get('seoDescriptionGu'),
    noindex: formData.get('noindex') !== null,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  const bodyEn = parseBody(formData.get('bodyEn'));
  const bodyGu = parseBody(formData.get('bodyGu'));
  if (!bodyEn.ok) return { ok: false, message: `English body: ${bodyEn.message}` };
  if (!bodyGu.ok) return { ok: false, message: `Gujarati body: ${bodyGu.message}` };

  // An empty article page is worse for the site than one fewer article.
  if (parsed.data.status === 'PUBLISHED' && bodyEn.doc.content.length === 0) {
    return { ok: false, message: 'Write the article before publishing it.' };
  }

  const {
    slug,
    status,
    seoTitleEn,
    seoTitleGu,
    seoDescriptionEn,
    seoDescriptionGu,
    noindex,
    ...rest
  } = parsed.data;

  const clash = await db.blogPost.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, message: 'Another post already uses that URL slug.' };

  const existing = id
    ? await db.blogPost.findUnique({ where: { id }, select: { publishedAt: true } })
    : null;

  const seo = seoSchema.parse({
    titleEn: seoTitleEn,
    titleGu: seoTitleGu,
    descriptionEn: seoDescriptionEn,
    descriptionGu: seoDescriptionGu,
    ogImage: null,
    noindex,
  });

  const data = {
    ...rest,
    slug,
    status,
    bodyEn: bodyEn.doc as unknown as Prisma.InputJsonObject,
    bodyGu: bodyGu.doc as unknown as Prisma.InputJsonObject,
    readMinutes: readingMinutes(bodyEn.doc),
    seo: seo as unknown as Prisma.InputJsonObject,
    // Stamped the first time it goes live and never rewritten, so editing an
    // old article does not push it back to the top of the list.
    publishedAt:
      status === 'PUBLISHED'
        ? (existing?.publishedAt ?? new Date())
        : (existing?.publishedAt ?? null),
    authorId: user.id,
  };

  const post = id
    ? await db.blogPost.update({ where: { id }, data })
    : await db.blogPost.create({ data });

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: id ? 'update' : 'create',
      entity: 'BlogPost',
      entityId: post.id,
    },
  });

  refresh(slug);
  if (!id) redirect(`/admin/blog/${post.id}`);
  return { ok: true, message: 'Post saved.' };
}

export async function deletePost(id: string) {
  const user = await requireUser();
  const post = await db.blogPost.delete({ where: { id }, select: { slug: true } });
  await db.auditLog.create({
    data: { userId: user.id, action: 'delete', entity: 'BlogPost', entityId: id },
  });
  refresh(post.slug);
  redirect('/admin/blog');
}
