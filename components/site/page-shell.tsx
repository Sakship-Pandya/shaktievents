import type { ReactNode } from 'react';
import { Texture } from '@/components/brand/texture';
import { Reveal } from '@/components/motion/reveal';
import { Breadcrumbs, type Crumb } from '@/components/site/breadcrumbs';
import { PhotoBackdrop } from '@/components/site/work-image';
import type { WorkPhoto } from '@/lib/work-photos';

/**
 * The dark hero every content page opens with. Extracted because seven pages
 * were repeating the same gradient, texture and breadcrumb markup, and they
 * have to stay identical for the pages to read as one site.
 *
 * With a `photo`, one of our own event photographs sits behind the headline
 * and the band gets taller so the photograph has room to be seen.
 */
export function PageHero({
  trail,
  title,
  intro,
  photo,
  children,
}: {
  trail: Crumb[];
  title: string;
  intro?: string;
  photo?: WorkPhoto;
  children?: ReactNode;
}) {
  return (
    <section
      className={`relative hero-under-header overflow-hidden pt-14 md:pt-20 ${photo ? 'pb-16 md:pb-28 lg:min-h-[34rem]' : 'pb-14 md:pb-16'}`}
    >
      {photo ? <PhotoBackdrop photo={photo} priority /> : null}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-20%,color-mix(in_oklab,var(--color-maroon)_70%,transparent)_0%,transparent_65%)]"
      />
      <Texture opacity={0.06} />
      <div className="relative container-site">
        <Breadcrumbs trail={trail} />
        <h1 className="mt-7 max-w-3xl font-display text-display-lg font-medium text-ivory">
          {title}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-muted md:text-lg">
            {intro}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** A titled band. `light` alternates to the ivory palette for rhythm. */
export function ContentBlock({
  title,
  note,
  tone = 'dark',
  children,
}: {
  title: string;
  note?: string;
  tone?: 'dark' | 'light';
  children: ReactNode;
}) {
  const isLight = tone === 'light';
  return (
    <section className={isLight ? 'theme-light section-pad' : 'bg-ink section-pad'}>
      <div className="container-site">
        <Reveal>
          <h2
            className={`font-display text-display-md font-medium ${isLight ? 'text-ink' : 'text-ivory'}`}
          >
            {title}
          </h2>
          {note ? (
            <p className={`mt-3 text-sm ${isLight ? 'text-muted-foreground' : 'text-ivory-muted'}`}>
              {note}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

/** Shared empty state so "nothing here yet" reads the same everywhere. */
export function EmptyNote({
  children,
  tone = 'dark',
}: {
  children: ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <p
      className={`rounded-2xl border border-dashed px-6 py-12 text-center text-sm leading-relaxed ${
        tone === 'light'
          ? 'border-gold/50 bg-card text-muted-foreground'
          : 'border-gold/40 text-ivory-muted'
      }`}
    >
      {children}
    </p>
  );
}

/** Accessible disclosure list used by both the FAQ page and the service pages. */
export function FaqList({
  items,
  tone = 'light',
}: {
  items: { question: string; answer: string }[];
  tone?: 'dark' | 'light';
}) {
  const isLight = tone === 'light';
  return (
    <div className="max-w-3xl">
      {items.map((faq) => (
        <details key={faq.question} className="group border-b border-gold/30">
          <summary
            className={`flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-display text-lg marker:hidden ${
              isLight ? 'text-ink' : 'text-ivory'
            }`}
          >
            {faq.question}
            <span
              aria-hidden
              className={`mt-2 grid size-5 shrink-0 place-items-center transition-transform duration-300 group-open:rotate-45 ${
                isLight ? 'text-maroon' : 'text-marigold'
              }`}
            >
              +
            </span>
          </summary>
          <p
            className={`pb-6 text-[0.95rem] leading-relaxed ${
              isLight ? 'text-muted-foreground' : 'text-ivory-muted'
            }`}
          >
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
