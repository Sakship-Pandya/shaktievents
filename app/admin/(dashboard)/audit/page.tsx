import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Audit log' };
export const dynamic = 'force-dynamic';

const PER_PAGE = 50;

const when = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
});

/** Plain words for what each action was, so the log reads without a glossary. */
const ACTIONS: Record<string, string> = {
  login: 'signed in',
  create: 'added',
  update: 'changed',
  delete: 'deleted',
  publish: 'published',
  unpublish: 'unpublished',
  activate: 'switched on',
  deactivate: 'switched off',
  role: 'changed the role of',
  'reset-password': 'reset the password for',
};

const TONE: Record<string, string> = {
  login: 'bg-sand/60 text-muted-foreground',
  delete: 'bg-error/10 text-error',
  deactivate: 'bg-error/10 text-error',
  create: 'bg-success/10 text-success',
  publish: 'bg-success/10 text-success',
};

type Props = { searchParams: Promise<{ entity?: string; page?: string }> };

export default async function AuditPage({ searchParams }: Props) {
  await requireAdmin();

  const { entity, page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const where = entity ? { entity } : {};

  const [rows, total, entities] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { at: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        meta: true,
        at: true,
        user: { select: { name: true, email: true } },
      },
    }),
    db.auditLog.count({ where }),
    db.auditLog.findMany({
      distinct: ['entity'],
      select: { entity: true },
      orderBy: { entity: 'asc' },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const href = (params: Record<string, string | number | undefined>) => {
    const search = new URLSearchParams();
    if (params.entity) search.set('entity', String(params.entity));
    if (params.page && Number(params.page) > 1) search.set('page', String(params.page));
    const query = search.toString();
    return query ? `/admin/audit?${query}` : '/admin/audit';
  };

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Audit log</h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
        Every change anybody has made through this panel, newest first. It is written automatically
        and cannot be edited — which is what makes it worth having when something on the site is not
        what you expected.
      </p>

      <nav aria-label="Filter" className="mb-6 flex flex-wrap gap-2">
        <Link
          href={href({})}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
            entity
              ? 'border-border text-muted-foreground hover:bg-sand'
              : 'border-maroon bg-maroon text-ivory'
          }`}
        >
          Everything
        </Link>
        {entities.map((row) => (
          <Link
            key={row.entity}
            href={href({ entity: row.entity })}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              entity === row.entity
                ? 'border-maroon bg-maroon text-ivory'
                : 'border-border text-muted-foreground hover:bg-sand'
            }`}
          >
            {row.entity}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          Nothing recorded yet.
        </p>
      ) : (
        <ol className="grid gap-2">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-lg border border-border bg-card px-4 py-3 text-sm"
            >
              <span className="font-semibold text-ink">
                {row.user?.name ?? row.user?.email ?? 'Someone since removed'}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[0.7rem] font-semibold ${
                  TONE[row.action] ?? 'bg-sand text-muted-foreground'
                }`}
              >
                {ACTIONS[row.action] ?? row.action}
              </span>
              <span className="text-muted-foreground">{row.entity}</span>
              {row.meta ? (
                <span className="text-xs text-muted-foreground/80">
                  {Object.entries(row.meta as Record<string, unknown>)
                    .map(([key, value]) => `${key}: ${String(value)}`)
                    .join(' · ')
                    .slice(0, 120)}
                </span>
              ) : null}
              <time
                dateTime={row.at.toISOString()}
                className="ml-auto shrink-0 text-xs text-muted-foreground tabular"
              >
                {when.format(row.at)}
              </time>
            </li>
          ))}
        </ol>
      )}

      {pages > 1 ? (
        <nav className="mt-8 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link
              href={href({ entity, page: page - 1 })}
              className="font-semibold text-maroon hover:underline"
            >
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground tabular">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={href({ entity, page: page + 1 })}
              className="font-semibold text-maroon hover:underline"
            >
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
