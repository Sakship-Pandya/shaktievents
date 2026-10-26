'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { adminGuide, guideIntro, guideTitle } from '@/lib/admin-guide';
import { cn } from '@/lib/utils';

type Lang = 'en' | 'gu';

/**
 * The guide, with a language switch.
 *
 * Both languages are in the markup rather than fetched, so switching is
 * instant and the page works with no network — which matters when the person
 * reading it is standing on a site with one bar of signal.
 */
export function HelpGuide() {
  const [lang, setLang] = useState<Lang>('en');
  const pick = (value: { en: string; gu: string }) => value[lang];

  return (
    <div className="mx-auto max-w-3xl">

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display-md font-medium text-ink">{pick(guideTitle)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {pick(guideIntro)}
          </p>
        </div>
        <div
          role="group"
          aria-label="Language"
          className="flex shrink-0 rounded-full border border-border p-1"
        >
          {(
            [
              ['en', 'English'],
              ['gu', 'ગુજરાતી'],
            ] as const
          ).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={cn(
                'rounded-full px-4 py-1.5 text-[0.8rem] font-semibold transition-colors',
                lang === code ? 'bg-maroon text-ivory' : 'text-muted-foreground hover:text-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <nav aria-label="Contents" className="mt-10 rounded-xl border border-border bg-card p-5">
        <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {adminGuide.map((section, index) => (
            <li key={section.id} className="text-sm">
              <a href={`#${section.id}`} className="text-muted-foreground hover:text-maroon">
                <span className="text-muted-foreground/60 tabular">{index + 1}.</span>{' '}
                {pick(section.title)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {adminGuide.map((section) => (
        <section key={section.id} id={section.id} className="mt-12 scroll-mt-24">
          <h2 className="font-display text-display-sm font-medium text-ink">
            {pick(section.title)}
          </h2>
          {section.href ? (
            <Link
              href={section.href}
              className="mt-2 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-maroon hover:underline"
            >
              {section.href}
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}

          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            {pick(section.intro)}
          </p>

          {section.steps ? (
            <ol className="mt-6 space-y-4">
              {section.steps.map((stepText, index) => (
                <li key={stepText.en} className="flex gap-4">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-maroon/10 text-[0.75rem] font-semibold text-maroon tabular">
                    {index + 1}
                  </span>
                  <p className="text-[0.95rem] leading-relaxed text-ink">{pick(stepText)}</p>
                </li>
              ))}
            </ol>
          ) : null}

          {section.notes?.map((note) => (
            <p
              key={note.en}
              className="mt-5 rounded-lg border-l-2 border-gold bg-sand/60 px-5 py-3.5 text-[0.9rem] leading-relaxed text-ink"
            >
              {pick(note)}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
