'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { locales } from '@/i18n/routing';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { readRows } from '@/lib/form-rows';
import { projectBriefSchema, projectWorkSchema } from '@/lib/schemas/project-content';
import { localizedPath } from '@/lib/seo';
import type { Prisma } from '@/lib/generated/prisma/client';

export type ProjectState = { ok: boolean; message: string | null };

const blankToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? null : t;
};

const optionalInt = (max: number) =>
  z.preprocess(
    (v) => (blankToNull(v) === null ? null : Number(v)),
    z.number().int().min(0).max(max).nullable(),
  );

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only');

const projectSchema = z.object({
  slug: slugSchema,
  titleEn: z.string().trim().min(3).max(160),
  titleGu: z.string().trim().min(3).max(160),
  venue: z.preprocess(blankToNull, z.string().max(160).nullable()),
  panoramaUrl: z.preprocess(blankToNull, z.url().max(500).nullable()),
  clientName: z.preprocess(blankToNull, z.string().max(120).nullable()),
  clientQuoteEn: z.preprocess(blankToNull, z.string().max(600).nullable()),
  clientQuoteGu: z.preprocess(blankToNull, z.string().max(600).nullable()),
  eventDate: z.preprocess(blankToNull, z.string().max(20).nullable()),
  guests: optionalInt(1_000_000),
  days: optionalInt(365),
  areaSqft: optionalInt(10_000_000),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean(),
  order: z.coerce.number().int().min(0).max(999),
  eventTypeId: z.preprocess(blankToNull, z.string().nullable()),
  coverId: z.preprocess(blankToNull, z.string().nullable()),
  beforeId: z.preprocess(blankToNull, z.string().nullable()),
  afterId: z.preprocess(blankToNull, z.string().nullable()),
});

/**
 * A project change can affect the hub, its own page, the service pages that
 * list it and the home page. Cheaper to clear the tree than to work out which.
 */
function refresh(slug: string) {
  revalidatePath('/admin/portfolio');
  revalidatePath('/admin/projects');
  after(() => {
    revalidateTag('projects');
    for (const locale of locales) {
      revalidatePath(localizedPath(locale, `/portfolio/${slug}`));
    }
    // revalidatePath('/', 'layout') removed to avoid full app cache purge
  });
}

function parseForm(formData: FormData) {
  return projectSchema.safeParse({
    slug: formData.get('slug'),
    titleEn: formData.get('titleEn'),
    titleGu: formData.get('titleGu'),
    venue: formData.get('venue'),
    panoramaUrl: formData.get('panoramaUrl'),
    clientName: formData.get('clientName'),
    clientQuoteEn: formData.get('clientQuoteEn'),
    clientQuoteGu: formData.get('clientQuoteGu'),
    eventDate: formData.get('eventDate'),
    guests: formData.get('guests'),
    days: formData.get('days'),
    areaSqft: formData.get('areaSqft'),
    status: formData.get('status'),
    featured: formData.get('featured') !== null,
    order: formData.get('order'),
    eventTypeId: formData.get('eventTypeId'),
    coverId: formData.get('coverId'),
    beforeId: formData.get('beforeId'),
    afterId: formData.get('afterId'),
  });
}

function buildContent(formData: FormData) {
  const brief = (suffix: 'En' | 'Gu') =>
    projectBriefSchema.safeParse({
      paragraphs: readRows(formData, `brief${suffix}`, ['text']).map((r) => r.text ?? ''),
    });

  const work = (suffix: 'En' | 'Gu') =>
    projectWorkSchema.safeParse({
      did: readRows(formData, `did${suffix}`, ['text']).map((r) => r.text ?? ''),
      challenges: readRows(formData, `challenges${suffix}`, ['problem', 'solution']).map((r) => ({
        problem: r.problem ?? '',
        solution: r.solution ?? '',
      })),
    });

  return { briefEn: brief('En'), briefGu: brief('Gu'), workEn: work('En'), workGu: work('Gu') };
}

async function writeMediaLinks(
  projectId: string,
  galleryIds: string[],
  beforeId: string | null,
  afterId: string | null,
) {
  await db.projectMedia.deleteMany({ where: { projectId } });

  const rows: Prisma.ProjectMediaCreateManyInput[] = galleryIds.map((mediaId, order) => ({
    projectId,
    mediaId,
    role: 'GALLERY',
    order,
  }));
  if (beforeId) rows.push({ projectId, mediaId: beforeId, role: 'BEFORE', order: 0 });
  if (afterId) rows.push({ projectId, mediaId: afterId, role: 'AFTER', order: 0 });

  if (rows.length > 0) await db.projectMedia.createMany({ data: rows });
}

export async function saveProject(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  const user = await requireUser();

  const id = String(formData.get('id') ?? '');
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the fields.' };
  }

  const content = buildContent(formData);
  for (const [label, result] of Object.entries(content)) {
    if (!result.success) {
      return { ok: false, message: `${label}: ${result.error.issues[0]?.message}` };
    }
  }

  const serviceIds = formData.getAll('serviceIds').map(String).filter(Boolean);
  const galleryIds = formData.getAll('galleryIds').map(String).filter(Boolean);
  const videoUrls = readRows(formData, 'videos', ['url'])
    .map((r) => r.url ?? '')
    .filter(Boolean);

  const { slug, coverId, beforeId, afterId, eventDate, ...rest } = parsed.data;

  const clash = await db.project.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, message: 'Another project already uses that URL slug.' };

  const data = {
    ...rest,
    slug,
    eventDate: eventDate ? new Date(eventDate) : null,
    coverId,
    videoUrls,
    briefEn: content.briefEn.data as unknown as Prisma.InputJsonObject,
    briefGu: content.briefGu.data as unknown as Prisma.InputJsonObject,
    workEn: content.workEn.data as unknown as Prisma.InputJsonObject,
    workGu: content.workGu.data as unknown as Prisma.InputJsonObject,
  };

  const project = id
    ? await db.project.update({
        where: { id },
        data: { ...data, services: { set: serviceIds.map((sid) => ({ id: sid })) } },
      })
    : await db.project.create({
        data: { ...data, services: { connect: serviceIds.map((sid) => ({ id: sid })) } },
      });

  await writeMediaLinks(project.id, galleryIds, beforeId, afterId);
  recordAudit({
    userId: user.id,
    action: id ? 'update' : 'create',
    entity: 'Project',
    entityId: project.id,
  });

  refresh(slug);

  // A newly created project has no id in the form yet; send the editor to its
  // own URL so the next save updates rather than creating a duplicate.
  if (!id) redirect(`/admin/projects/${project.id}`);

  return { ok: true, message: 'Project saved.' };
}

export async function toggleProjectStatus(
  id: string,
  targetStatus?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | FormData,
): Promise<{ ok: boolean; status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' }> {
  const user = await requireUser();

  let nextStatus: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  let projectSlug: string;

  if (typeof targetStatus === 'string') {
    nextStatus = targetStatus;
    const updated = await db.project.update({
      where: { id },
      data: { status: nextStatus },
      select: { slug: true },
    });
    projectSlug = updated.slug;
  } else {
    const project = await db.project.findUnique({
      where: { id },
      select: { slug: true, status: true },
    });
    if (!project) return { ok: false };
    nextStatus = project.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await db.project.update({ where: { id }, data: { status: nextStatus } });
    projectSlug = project.slug;
  }

  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'Project',
    entityId: id,
    meta: { status: nextStatus },
  });
  refresh(projectSlug);
  return { ok: true, status: nextStatus };
}

export async function toggleProjectFeatured(
  id: string,
  targetFeatured?: boolean | FormData,
): Promise<{ ok: boolean; featured?: boolean }> {
  const user = await requireUser();

  let nextFeatured: boolean;
  let projectSlug: string;

  if (typeof targetFeatured === 'boolean') {
    nextFeatured = targetFeatured;
    const updated = await db.project.update({
      where: { id },
      data: { featured: nextFeatured },
      select: { slug: true },
    });
    projectSlug = updated.slug;
  } else {
    const project = await db.project.findUnique({
      where: { id },
      select: { slug: true, featured: true },
    });
    if (!project) return { ok: false };
    nextFeatured = !project.featured;
    await db.project.update({ where: { id }, data: { featured: nextFeatured } });
    projectSlug = project.slug;
  }

  recordAudit({
    userId: user.id,
    action: 'update',
    entity: 'Project',
    entityId: id,
    meta: { featured: nextFeatured },
  });
  refresh(projectSlug);
  return { ok: true, featured: nextFeatured };
}

export async function deleteProject(id: string) {
  const user = await requireUser();
  const project = await db.project.delete({ where: { id }, select: { slug: true } });
  recordAudit({
    userId: user.id,
    action: 'delete',
    entity: 'Project',
    entityId: id,
  });
  refresh(project.slug);
  redirect('/admin/projects');
}
