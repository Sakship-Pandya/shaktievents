import type { Metadata } from 'next';
import { Eye, EyeOff, ImageOff, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toggleProjectStatus } from './actions';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Projects' };
export const dynamic = 'force-dynamic';

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED: 'bg-success/15 text-success',
  DRAFT: 'border border-border text-muted-foreground',
  ARCHIVED: 'border border-border text-muted-foreground line-through',
};

export default async function ProjectsAdminPage() {
  const projects = await db.project.findMany({
    orderBy: [{ status: 'asc' }, { eventDate: 'desc' }],
    select: {
      id: true,
      slug: true,
      titleEn: true,
      status: true,
      featured: true,
      guests: true,
      eventDate: true,
      cover: { select: { url: true, altEn: true, isPlaceholder: true } },
      eventType: { select: { nameEn: true } },
      area: { select: { nameEn: true } },
      _count: { select: { media: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl">

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display-md font-medium text-ink">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Events shown in the portfolio and on the service pages. Only published ones are public.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/portfolio"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-ink transition-colors hover:border-maroon/40 hover:bg-sand"
          >
            Portfolio Hub →
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-maroon px-6 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600"
          >
            <Plus className="size-4" />
            Add a project
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-xl border border-border bg-card px-5 py-14 text-center text-sm text-muted-foreground">
          No projects yet.
        </p>
      ) : (
        <ul className="grid gap-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-3"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                {project.cover ? (
                  <Image
                    src={project.cover.url}
                    alt={project.cover.altEn ?? ''}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center text-muted-foreground">
                    <ImageOff className="size-5" aria-hidden />
                  </span>
                )}
              </div>

              <Link
                href={`/admin/projects/${project.id}`}
                className="min-w-0 flex-1 hover:text-maroon"
              >
                <span className="block truncate font-medium text-ink">{project.titleEn}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {[
                    project.eventType?.nameEn,
                    project.area?.nameEn,
                    project.guests ? `${project.guests.toLocaleString('en-IN')} guests` : null,
                    `${project._count.media} photo${project._count.media === 1 ? '' : 's'}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </Link>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide ${STATUS_STYLE[project.status] ?? ''}`}
              >
                {project.status === 'PUBLISHED' ? 'Visible' : 'Not Visible'}
              </span>

              <form action={toggleProjectStatus.bind(null, project.id)}>
                <button
                  type="submit"
                  title={project.status === 'PUBLISHED' ? 'Make Not Visible' : 'Make Visible'}
                  aria-label={project.status === 'PUBLISHED' ? 'Make Not Visible' : 'Make Visible'}
                  className="grid size-8 place-items-center rounded-lg border border-border text-ink transition-colors hover:bg-sand"
                >
                  {project.status === 'PUBLISHED' ? (
                    <Eye className="size-4 text-emerald-600" />
                  ) : (
                    <EyeOff className="size-4 text-muted-foreground" />
                  )}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
