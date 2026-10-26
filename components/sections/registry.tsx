import type { ReactNode } from 'react';
import { ClosingCta } from './closing-cta';
import { EventMarquee } from './event-marquee';
import { InstagramFeed } from '@/components/features/instagram-feed';
import { MuhuratCountdown } from '@/components/features/muhurat-countdown';
import { Hero } from './hero';
import { ServicesGrid } from './services-grid';
import { WorkShowcase } from './work-showcase';
import { isSectionKey, sectionDefinitions, type SectionKey } from './definitions';
import { parseSectionProps } from '@/lib/section-schema';

/**
 * Maps a stored `component` string to the real component. The `satisfies`
 * check means adding a section to definitions.ts without wiring a component
 * here is a compile error, not a blank band on the live site.
 */
const sectionComponents = {
  Hero,
  WorkShowcase,
  EventMarquee,
  ServicesGrid,
  MuhuratCountdown,
  InstagramFeed,
  ClosingCta,
} satisfies Record<SectionKey, unknown>;

/**
 * Props come out of a Json column, so they are only known at runtime — the
 * schema validates them and this cast hands them to a typed component. It is
 * the one unavoidable cast in the page builder.
 */
type SectionRenderer = (props: Record<string, unknown>) => ReactNode;

export type SectionRow = {
  id: string;
  component: string;
  props: unknown;
};

export function RenderSections({ sections }: { sections: SectionRow[] }) {
  return sections.map((row) => {
    // A row can name a component that has since been removed from the code.
    // Skipping it keeps the rest of the page up.
    if (!isSectionKey(row.component)) return null;

    const definition = sectionDefinitions[row.component];
    const props = parseSectionProps(definition.schema, row.props);
    const Component = sectionComponents[row.component] as unknown as SectionRenderer;

    return <Component key={row.id} {...props} />;
  });
}
