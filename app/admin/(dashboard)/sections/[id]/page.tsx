import type { Metadata } from 'next';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { addSection } from '../actions';
import { SectionCard, type SectionCardData } from '../section-card';
import { isSectionKey, sectionDefinitions, sectionKeys } from '@/components/sections/definitions';
import { db } from '@/lib/db';
import { describeSection } from '@/lib/section-schema';

export const metadata: Metadata = { title: 'Edit sections' };
export const dynamic = 'force-dynamic';

export default async function PageSectionsEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const page = await db.page.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      titleEn: true,
      sections: {
        orderBy: { order: 'asc' },
        select: { id: true, component: true, props: true, isVisible: true },
      },
    },
  });

  if (!page) notFound();

  const cards: SectionCardData[] = page.sections
    // A row can name a component that has been removed from the code; it is
    // skipped here for the same reason the renderer skips it.
    .filter((section) => isSectionKey(section.component))
    .map((section, index, all) => {
      const key = section.component as keyof typeof sectionDefinitions;
      const definition = sectionDefinitions[key];

      return {
        id: section.id,
        component: section.component,
        label: definition.label,
        description: definition.description,
        isVisible: section.isVisible,
        isFirst: index === 0,
        isLast: index === all.length - 1,
        fields: describeSection(definition.schema),
        values: (section.props ?? {}) as Record<string, unknown>,
      };
    });

  const addSectionToPage = addSection.bind(null, page.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/sections"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-maroon"
      >
        <ArrowLeft className="size-4" />
        All pages
      </Link>

      <h1 className="mt-4 font-display text-display-md font-medium text-ink">{page.titleEn}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sections render top to bottom in this order on{' '}
        <code className="rounded bg-sand px-1.5 py-0.5 text-xs">{page.slug}</code>.
      </p>

      {cards.length === 0 ? (
        <p className="mt-8 rounded-xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
          This page has no sections yet. Its content still comes from the page template — add
          sections here as they become available.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {cards.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </ul>
      )}

      <form
        action={addSectionToPage}
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border bg-card p-5"
      >
        <div className="min-w-52 flex-1">
          <label
            htmlFor="component"
            className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            Add a section
          </label>
          <select
            id="component"
            name="component"
            defaultValue={sectionKeys[0]}
            className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            {sectionKeys.map((key) => (
              <option key={key} value={key}>
                {sectionDefinitions[key].label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-maroon/40 px-5 text-sm font-semibold text-maroon transition-colors hover:bg-maroon hover:text-ivory"
        >
          <Plus className="size-4" />
          Add to page
        </button>
      </form>
    </div>
  );
}
