'use server';

import { after } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isSectionKey, sectionDefinitions } from '@/components/sections/definitions';
import { recordAudit } from '@/lib/audit';
import { requireUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { describeSection, readSectionForm } from '@/lib/section-schema';
import { localizedPath } from '@/lib/seo';
import { locales } from '@/i18n/routing';
import type { Prisma } from '@/lib/generated/prisma/client';

export type SectionActionState = { ok: boolean; message: string | null };

/**
 * Rewrites every `order` on the page to 0..n-1. Doing it after each mutation
 * means orders can never collide or leave gaps, which is what makes the
 * up/down swap reliable.
 */
async function normaliseOrder(pageId: string) {
  const sections = await db.pageSection.findMany({
    where: { pageId },
    orderBy: { order: 'asc' },
    select: { id: true },
  });

  await db.$transaction(
    sections.map((section, index) =>
      db.pageSection.update({ where: { id: section.id }, data: { order: index } }),
    ),
  );
}

function audit(
  userId: string,
  action: string,
  entityId: string,
  meta?: Prisma.InputJsonObject,
) {
  recordAudit({ userId, action, entity: 'PageSection', entityId, meta });
}

/**
 * Public page revalidation runs in the background via after() so the admin UI
 * does not block for multiple seconds waiting on public ISR updates.
 */
function refresh(pageId: string, slug: string) {
  revalidatePath(`/admin/sections/${pageId}`);
  after(() => {
    revalidateTag('sections');
    for (const locale of locales) {
      revalidatePath(localizedPath(locale, slug));
    }
  });
}

export async function addSection(pageId: string, formData: FormData) {
  const user = await requireUser();
  const component = String(formData.get('component') ?? '');
  if (!isSectionKey(component)) return;

  const page = await db.page.findUnique({ where: { id: pageId }, select: { slug: true } });
  if (!page) return;

  const last = await db.pageSection.findFirst({
    where: { pageId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const created = await db.pageSection.create({
    data: {
      pageId,
      component,
      props: sectionDefinitions[component].schema.parse({}) as Prisma.InputJsonObject,
      order: (last?.order ?? -1) + 1,
    },
  });

  await audit(user.id, 'create', created.id, { component });
  refresh(pageId, page.slug);
}

export async function deleteSection(sectionId: string) {
  const user = await requireUser();
  const section = await db.pageSection.delete({
    where: { id: sectionId },
    include: { page: { select: { slug: true } } },
  });
  await audit(user.id, 'delete', sectionId, { component: section.component });
  await normaliseOrder(section.pageId);
  refresh(section.pageId, section.page.slug);
}

export async function toggleSection(sectionId: string) {
  const user = await requireUser();
  const current = await db.pageSection.findUnique({
    where: { id: sectionId },
    select: { isVisible: true, pageId: true, page: { select: { slug: true } } },
  });
  if (!current) return;

  await db.pageSection.update({
    where: { id: sectionId },
    data: { isVisible: !current.isVisible },
  });

  await audit(user.id, 'update', sectionId, { isVisible: !current.isVisible });
  refresh(current.pageId, current.page.slug);
}

export async function moveSection(sectionId: string, direction: 'up' | 'down') {
  const user = await requireUser();
  const section = await db.pageSection.findUnique({
    where: { id: sectionId },
    select: { pageId: true, page: { select: { slug: true } } },
  });
  if (!section) return;

  const ordered = await db.pageSection.findMany({
    where: { pageId: section.pageId },
    orderBy: { order: 'asc' },
    select: { id: true },
  });

  const index = ordered.findIndex((s) => s.id === sectionId);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= ordered.length) return;

  const reordered = [...ordered];
  const [moved] = reordered.splice(index, 1);
  if (moved) reordered.splice(target, 0, moved);

  await db.$transaction(
    reordered.map((s, i) => db.pageSection.update({ where: { id: s.id }, data: { order: i } })),
  );

  await audit(user.id, 'update', sectionId, { movedTo: target });
  refresh(section.pageId, section.page.slug);
}

export async function updateSectionProps(
  _prev: SectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  const user = await requireUser();

  const sectionId = String(formData.get('sectionId') ?? '');
  const section = await db.pageSection.findUnique({
    where: { id: sectionId },
    select: { id: true, pageId: true, component: true, page: { select: { slug: true } } },
  });
  if (!section || !isSectionKey(section.component)) {
    return { ok: false, message: 'That section no longer exists.' };
  }

  const { schema } = sectionDefinitions[section.component];
  const values = readSectionForm(describeSection(schema), formData);
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    // Each section has its own schema, so the error types form a union that
    // z.flattenError cannot narrow. The raw issue list is available on all of
    // them and is all this form needs.
    const message = parsed.error.issues[0]?.message ?? 'Those settings are not valid.';
    return { ok: false, message };
  }

  await db.pageSection.update({
    where: { id: section.id },
    data: { props: parsed.data as Prisma.InputJsonObject },
  });

  await audit(user.id, 'update', section.id, { props: JSON.stringify(parsed.data) });
  refresh(section.pageId, section.page.slug);

  return { ok: true, message: 'Section updated.' };
}
