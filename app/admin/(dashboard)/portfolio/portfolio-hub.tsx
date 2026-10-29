'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ExternalLink,
  Eye,
  EyeOff,
  FolderOpen,
  ImageOff,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import { toggleProjectStatus } from '@/app/admin/(dashboard)/projects/actions';

export type PortfolioProject = {
  id: string;
  slug: string;
  titleEn: string;
  titleGu: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  eventDate: string | null;
  guests: number | null;
  venue: string | null;
  cover: { url: string; altEn: string | null; isPlaceholder: boolean } | null;
  eventType: { nameEn: string; nameGu?: string; slug: string } | null;
  mediaCount: number;
};

type Props = {
  projects: PortfolioProject[];
  eventTypes: { id: string; slug: string; nameEn: string }[];
};

type VisibilityFilter = 'ALL' | 'VISIBLE' | 'NOT_VISIBLE';

export function PortfolioHub({ projects, eventTypes }: Props) {
  // Local state for optimistic updates
  const [items, setItems] = useState<PortfolioProject[]>(projects);
  const [search, setSearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');

  // Track pending IDs for loading state
  const [pendingStatusIds, setPendingStatusIds] = useState<Set<string>>(new Set());

  // Keep local state in sync when server props refresh
  useEffect(() => {
    setItems(projects);
  }, [projects]);

  // Handle visibility toggle with optimistic UI
  const handleToggleVisibility = async (project: PortfolioProject) => {
    const isCurrentlyVisible = project.status === 'PUBLISHED';
    const nextStatus: 'PUBLISHED' | 'DRAFT' = isCurrentlyVisible ? 'DRAFT' : 'PUBLISHED';

    // Optimistically update
    setItems((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p))
    );
    setPendingStatusIds((prev) => new Set(prev).add(project.id));

    try {
      await toggleProjectStatus(project.id, nextStatus);
    } catch {
      // Rollback on network failure
      setItems((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: project.status } : p))
      );
    } finally {
      setPendingStatusIds((prev) => {
        const next = new Set(prev);
        next.delete(project.id);
        return next;
      });
    }
  };

  // Filter projects based on search, visibility, and event type
  const filteredProjects = useMemo(() => {
    return items.filter((project) => {
      // Visibility attribute filter
      if (visibilityFilter === 'VISIBLE' && project.status !== 'PUBLISHED') return false;
      if (visibilityFilter === 'NOT_VISIBLE' && project.status === 'PUBLISHED') return false;

      // Event type filter
      if (eventTypeFilter !== 'ALL' && project.eventType?.slug !== eventTypeFilter) return false;

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesTitle =
          project.titleEn.toLowerCase().includes(query) ||
          project.titleGu.toLowerCase().includes(query);
        const matchesVenue = project.venue?.toLowerCase().includes(query);
        const matchesEventType = project.eventType?.nameEn.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVenue && !matchesEventType) return false;
      }

      return true;
    });
  }, [items, visibilityFilter, eventTypeFilter, search]);

  const visibleCount = useMemo(
    () => items.filter((p) => p.status === 'PUBLISHED').length,
    [items]
  );
  const notVisibleCount = useMemo(
    () => items.filter((p) => p.status !== 'PUBLISHED').length,
    [items]
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <FolderOpen className="size-5 text-maroon" />
          <h2 className="font-display text-lg font-medium text-ink">Projects &amp; Case Studies</h2>
          <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {items.length}
          </span>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, venue, event type..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pr-9 pl-9 text-sm text-ink placeholder:text-muted-foreground/60 focus:border-maroon focus:outline-none"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-ink"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Event Type Filter */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-ink focus:border-maroon focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            {eventTypes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.nameEn}
              </option>
            ))}
          </select>

          {/* Visibility Attribute Filter Pills */}
          <div className="inline-flex rounded-xl border border-border bg-card p-1 text-xs">
            <button
              type="button"
              onClick={() => setVisibilityFilter('ALL')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                visibilityFilter === 'ALL'
                  ? 'bg-maroon text-ivory'
                  : 'text-muted-foreground hover:text-ink'
              }`}
            >
              All ({items.length})
            </button>

            <button
              type="button"
              onClick={() => setVisibilityFilter('VISIBLE')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                visibilityFilter === 'VISIBLE'
                  ? 'bg-emerald-600 text-ivory'
                  : 'text-muted-foreground hover:text-ink'
              }`}
            >
              Visible ({visibleCount})
            </button>

            <button
              type="button"
              onClick={() => setVisibilityFilter('NOT_VISIBLE')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                visibilityFilter === 'NOT_VISIBLE'
                  ? 'bg-muted-foreground text-ivory'
                  : 'text-muted-foreground hover:text-ink'
              }`}
            >
              Not Visible ({notVisibleCount})
            </button>
          </div>
        </div>
      </div>

      {/* Project List */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-5 py-14 text-center">
          <p className="text-sm font-medium text-ink">No matching portfolio projects found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search query or filters.
          </p>
        </div>
      ) : (
        <ul className="grid gap-2.5">
          {filteredProjects.map((project) => {
            const isVisible = project.status === 'PUBLISHED';
            const isPendingStatus = pendingStatusIds.has(project.id);

            return (
              <li
                key={project.id}
                className="flex flex-wrap items-center gap-3.5 rounded-xl border border-border bg-card p-3 transition-colors hover:border-maroon/30"
              >
                {/* Thumbnail */}
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-sand border border-border/60">
                  {project.cover?.url ? (
                    <Image
                      src={project.cover.url}
                      alt={project.cover.altEn ?? project.titleEn}
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

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="truncate font-medium text-ink hover:text-maroon"
                    >
                      {project.titleEn}
                    </Link>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    {project.eventType?.nameEn ? (
                      <span className="rounded bg-sand px-1.5 py-0.5 text-[0.7rem] font-medium text-ink">
                        {project.eventType.nameEn}
                      </span>
                    ) : null}
                    {project.eventDate ? <span>{project.eventDate}</span> : null}
                    {project.guests ? (
                      <span>· {project.guests.toLocaleString('en-IN')} guests</span>
                    ) : null}
                    {project.venue ? <span>· {project.venue}</span> : null}
                    <span>· {project.mediaCount} photos</span>
                  </div>
                </div>

                {/* Visibility Badge (Visible or Not Visible attribute) */}
                {isVisible ? (
                  <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Visible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-border bg-sand px-2.5 py-0.5 text-[0.7rem] font-semibold text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                    Not Visible
                  </span>
                )}

                {/* Quick Action: Visible or Not Visible Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(project)}
                  disabled={isPendingStatus}
                  title={
                    isVisible
                      ? 'Currently Visible on website · Click to make Not Visible'
                      : 'Currently Not Visible · Click to make Visible on website'
                  }
                  aria-label={isVisible ? 'Make project not visible' : 'Make project visible'}
                  className={`relative grid size-9 place-items-center rounded-lg border transition-all ${
                    isVisible
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                      : 'border-border bg-card text-muted-foreground hover:bg-sand hover:text-ink'
                  } ${isPendingStatus ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isPendingStatus ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : isVisible ? (
                    <Eye className="size-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <EyeOff className="size-4 text-muted-foreground" />
                  )}
                </button>

                {/* Actions: Live link & Edit button */}
                <div className="flex items-center gap-2">
                  {isVisible ? (
                    <a
                      href={`/portfolio/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View published story on public site"
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-maroon/30 hover:text-maroon"
                    >
                      <ExternalLink className="size-3" />
                      <span className="hidden sm:inline">Live</span>
                    </a>
                  ) : null}

                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="inline-flex items-center rounded-lg bg-sand px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-sand/80 hover:text-maroon"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
