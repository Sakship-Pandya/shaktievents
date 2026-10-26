import { cn } from '@/lib/utils';

type LogoMarkProps = { className?: string };

/** Mandap pavilion mark: canopy arch, two pillars, a marigold lamp at the peak. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn('size-8', className)}>
      <path
        d="M4 27V15C4 8.5 9.5 4.5 16 4.5S28 8.5 28 15v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 27V17.5M23 27V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M2 27h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M9 17.5c2.2-2.6 4.6-3.9 7-3.9s4.8 1.3 7 3.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="9.5" r="1.9" fill="var(--color-marigold)" />
    </svg>
  );
}

type LogoProps = {
  name: string;
  tagline?: string;
  className?: string;
  compact?: boolean;
};

export function Logo({ name, tagline, className, compact = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-gold', className)}>
      <LogoMark className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-medium tracking-tight text-ivory">
          {name}
        </span>
        {!compact && tagline ? (
          <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.16em] text-gold-soft/80 uppercase">
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
