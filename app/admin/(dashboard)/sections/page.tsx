import type { Metadata } from 'next';
import { LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Pages & sections' };
export const dynamic = 'force-dynamic';

export default async function SectionsIndexPage() {
  const pages = await db.page.findMany({
    orderBy: { slug: 'asc' },
    select: {
      id: true,
      slug: true,
      titleEn: true,
      _count: { select: { sections: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Pages &amp; sections</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Add, reorder, hide and configure the blocks that make up each public page. Changes go live
        without a redeploy.
      </p>

      <ul className="grid gap-3">
        {pages.map((page) => (
          <li key={page.id}>
            <Link
              href={`/admin/sections/${page.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-maroon/40 hover:bg-sand"
            >
              <LayoutTemplate className="size-5 shrink-0 text-gold" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">{page.titleEn}</span>
                <span className="block truncate text-xs text-muted-foreground">{page.slug}</span>
              </span>
              <span className="shrink-0 text-sm text-muted-foreground">
                {page._count.sections === 0
                  ? 'No sections'
                  : `${page._count.sections} section${page._count.sections === 1 ? '' : 's'}`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
