import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { EMPTY_EVENT_INTRO, eventIntroSchema } from '@/lib/schemas/page-content';
import { parseOr } from '@/lib/schemas/service-content';

export const metadata: Metadata = { title: 'Event types' };
export const dynamic = 'force-dynamic';

export default async function EventTypesAdminPage() {
  const rows = await db.eventType.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Event types</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        One landing page per kind of function, and the filters used across the portfolio.
      </p>

      <ul className="grid gap-2">
        {rows.map((row) => {
          const intro = parseOr(eventIntroSchema, row.introEn, EMPTY_EVENT_INTRO);
          return (
            <li key={row.id}>
              <Link
                href={`/admin/event-types/${row.slug}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-maroon/40 hover:bg-sand"
              >
                <Sparkles className="size-5 shrink-0 text-gold" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink">{row.nameEn}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {intro.paragraphs.length > 0 ? 'Copy written' : 'No copy yet'} ·{' '}
                    {intro.needs.length} point{intro.needs.length === 1 ? '' : 's'}
                  </span>
                </span>
                {!row.isActive ? (
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide uppercase">
                    Hidden
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
