import type { Metadata } from 'next';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Blog' };
export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const posts = await db.blogPost.findMany({
    orderBy: [{ status: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: { select: { nameEn: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl">

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display-md font-medium text-ink">Blog</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Guides that bring people to the site from search. A post cannot be published without a
            body.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-6 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600"
        >
          <Plus className="size-4" />
          Write a post
        </Link>
      </div>

      <ul className="grid gap-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/admin/blog/${post.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-maroon/40 hover:bg-sand"
            >
              <FileText className="size-5 shrink-0 text-gold" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink">{post.titleEn}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {[
                    post.category?.nameEn,
                    post.readMinutes ? `${post.readMinutes} min read` : null,
                    post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide uppercase ${
                  post.status === 'PUBLISHED'
                    ? 'bg-success/15 text-success'
                    : 'border border-border text-muted-foreground'
                }`}
              >
                {post.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
