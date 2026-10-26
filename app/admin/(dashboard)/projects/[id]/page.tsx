import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectForm, type Option, type ProjectFormValues } from '../project-form';
import type { PickableMedia } from '../media-picker';
import { db } from '@/lib/db';
import {
  EMPTY_BRIEF,
  EMPTY_WORK,
  projectBriefSchema,
  projectWorkSchema,
} from '@/lib/schemas/project-content';
import { parseOr } from '@/lib/schemas/service-content';

export const metadata: Metadata = { title: 'Edit project' };
export const dynamic = 'force-dynamic';

/** `/admin/projects/new` opens an empty editor rather than a separate route. */
const NEW = 'new';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === NEW;

  const [project, media, eventTypes, services] = await Promise.all([
    isNew
      ? null
      : db.project.findUnique({
          where: { id },
          include: {
            services: { select: { id: true } },
            media: { orderBy: { order: 'asc' }, select: { mediaId: true, role: true } },
          },
        }),
    db.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, url: true, altEn: true, isPlaceholder: true },
    }),
    db.eventType.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    db.service.findMany({ orderBy: { order: 'asc' }, select: { id: true, shortEn: true } }),
  ]);

  if (!isNew && !project) notFound();

  const briefEn = project ? parseOr(projectBriefSchema, project.briefEn, EMPTY_BRIEF) : EMPTY_BRIEF;
  const briefGu = project ? parseOr(projectBriefSchema, project.briefGu, EMPTY_BRIEF) : EMPTY_BRIEF;
  const workEn = project ? parseOr(projectWorkSchema, project.workEn, EMPTY_WORK) : EMPTY_WORK;
  const workGu = project ? parseOr(projectWorkSchema, project.workGu, EMPTY_WORK) : EMPTY_WORK;

  const pickable: PickableMedia[] = media.map((m) => ({
    id: m.id,
    url: m.url,
    alt: m.altEn ?? '',
    isPlaceholder: m.isPlaceholder,
  }));

  const toOptions = (rows: { id: string; nameEn?: string; shortEn?: string }[]): Option[] =>
    rows.map((r) => ({ id: r.id, label: r.nameEn ?? r.shortEn ?? r.id }));

  const values: ProjectFormValues = {
    id: project?.id ?? null,
    status: project?.status ?? 'DRAFT',
    flags: { featured: project?.featured ?? false },
    serviceIds: project?.services.map((s) => s.id) ?? [],
    scalars: {
      slug: project?.slug ?? '',
      titleEn: project?.titleEn ?? '',
      titleGu: project?.titleGu ?? '',
      venue: project?.venue ?? '',
      panoramaUrl: project?.panoramaUrl ?? '',
      clientName: project?.clientName ?? '',
      clientQuoteEn: project?.clientQuoteEn ?? '',
      clientQuoteGu: project?.clientQuoteGu ?? '',
      eventDate: project?.eventDate ? project.eventDate.toISOString().slice(0, 10) : '',
      guests: project?.guests == null ? '' : String(project.guests),
      days: project?.days == null ? '' : String(project.days),
      areaSqft: project?.areaSqft == null ? '' : String(project.areaSqft),
      order: String(project?.order ?? 0),
      eventTypeId: project?.eventTypeId ?? '',
    },
    media: {
      all: pickable,
      coverId: project?.coverId ?? null,
      galleryIds: project?.media.filter((m) => m.role === 'GALLERY').map((m) => m.mediaId) ?? [],
      beforeId: project?.media.find((m) => m.role === 'BEFORE')?.mediaId ?? null,
      afterId: project?.media.find((m) => m.role === 'AFTER')?.mediaId ?? null,
    },
    rows: {
      briefEn: briefEn.paragraphs.map((text) => ({ text })),
      briefGu: briefGu.paragraphs.map((text) => ({ text })),
      didEn: workEn.did.map((text) => ({ text })),
      didGu: workGu.did.map((text) => ({ text })),
      challengesEn: workEn.challenges.map((c) => ({ problem: c.problem, solution: c.solution })),
      challengesGu: workGu.challenges.map((c) => ({ problem: c.problem, solution: c.solution })),
      videos: (project?.videoUrls ?? []).map((url) => ({ url })),
    },
    options: {
      eventTypes: toOptions(eventTypes),
      services: toOptions(services),
    },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-maroon"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-display-md font-medium text-ink">
          {project ? project.titleEn : 'New project'}
        </h1>
        {project?.status === 'PUBLISHED' ? (
          <a
            href={`/portfolio/${project.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-maroon"
          >
            View page ↗
          </a>
        ) : null}
      </div>

      <ProjectForm values={values} />
    </div>
  );
}
