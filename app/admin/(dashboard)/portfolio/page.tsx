import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { db } from '@/lib/db';
import { PortfolioHub, type PortfolioProject } from './portfolio-hub';

export const metadata: Metadata = { title: 'Portfolio Management' };
export const dynamic = 'force-dynamic';

const whenDate = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: 'short',
});

export default async function PortfolioAdminPage() {
  const [
    projects,
    eventTypes,
    publishedCount,
    draftCount,
  ] = await Promise.all([
    db.project.findMany({
      orderBy: [{ status: 'asc' }, { eventDate: 'desc' }],
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleGu: true,
        status: true,
        eventDate: true,
        guests: true,
        venue: true,
        cover: { select: { url: true, altEn: true, isPlaceholder: true } },
        eventType: { select: { nameEn: true, nameGu: true, slug: true } },
        _count: { select: { media: true } },
      },
    }),
    db.eventType.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        nameEn: true,
      },
    }),
    db.project.count({ where: { status: 'PUBLISHED' } }),
    db.project.count({ where: { status: 'DRAFT' } }),
  ]);

  const projectsData: PortfolioProject[] = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleEn: p.titleEn,
    titleGu: p.titleGu,
    status: p.status,
    eventDate: p.eventDate ? whenDate.format(p.eventDate) : null,
    guests: p.guests,
    venue: p.venue,
    cover: p.cover
      ? { url: p.cover.url, altEn: p.cover.altEn, isPlaceholder: p.cover.isPlaceholder }
      : null,
    eventType: p.eventType
      ? { nameEn: p.eventType.nameEn, nameGu: p.eventType.nameGu, slug: p.eventType.slug }
      : null,
    mediaCount: p._count.media,
  }));

  const eventTypesData = eventTypes.map((e) => ({
    id: e.id,
    slug: e.slug,
    nameEn: e.nameEn,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-display-md font-medium text-ink">Portfolio</h1>
            <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              Projects &amp; Case Studies
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your portfolio projects and case studies and their visibility status on the live site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-ink transition-colors hover:border-maroon/40 hover:bg-sand"
          >
            <ExternalLink className="size-3.5 text-muted-foreground" />
            <span>View Public Portfolio</span>
          </a>

          <Link
            href="/admin/projects/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-maroon px-4 text-xs font-semibold text-ivory transition-colors hover:bg-maroon-600"
          >
            <Plus className="size-3.5" />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row: Total Projects, Visible, Not Visible */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Projects</span>
            <FolderOpen className="size-3.5 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium text-ink">{projects.length}</p>
          <p className="text-[0.7rem] text-muted-foreground">Case studies in portfolio</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Visible</span>
            <Eye className="size-3.5 text-emerald-600" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium text-ink">{publishedCount}</p>
          <p className="text-[0.7rem] text-emerald-600 dark:text-emerald-400">Live on website</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Not Visible</span>
            <EyeOff className="size-3.5 text-muted-foreground" />
          </div>
          <p className="mt-2 font-display text-2xl font-medium text-ink">{draftCount}</p>
          <p className="text-[0.7rem] text-muted-foreground">Hidden from website</p>
        </div>
      </div>

      {/* Projects & Case Studies List with Filters and Working Visibility Toggles */}
      <PortfolioHub
        projects={projectsData}
        eventTypes={eventTypesData}
      />
    </div>
  );
}
