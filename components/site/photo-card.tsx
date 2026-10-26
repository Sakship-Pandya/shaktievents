import type { ReactNode } from 'react';
import { WorkImage } from '@/components/site/work-image';
import { Link } from '@/i18n/navigation';
import type { WorkPhoto } from '@/lib/work-photos';

/**
 * The light-band card with a photograph on top: services, event types and blog
 * posts all use it, so a grid of any of them reads as the same object.
 *
 * The icon medallion sits half over the photograph's bottom edge — the one
 * overlap in the card, and the detail that stops it looking like a template.
 */
export function PhotoCard({
  href,
  photo,
  title,
  titleAs: Title = 'h3',
  icon,
  eyebrow,
  body,
  footer,
  badge,
}: {
  href: string;
  photo: WorkPhoto;
  title: string;
  titleAs?: 'h2' | 'h3';
  icon?: ReactNode;
  eyebrow?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/40 bg-card transition-all duration-500 ease-[var(--ease-expo)] hover:-translate-y-1 hover:border-maroon/40 hover:shadow-[0_28px_60px_-32px_rgba(20,16,13,0.55)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-700">
        <WorkImage
          photo={photo}
          decorative
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
        />
        {badge ? <span className="absolute top-3 right-3">{badge}</span> : null}
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-7 md:px-7">
        {icon ? (
          <span className="relative -mt-6 grid size-12 place-items-center rounded-full border border-gold/50 bg-card text-maroon shadow-[0_10px_24px_-12px_rgba(20,16,13,0.5)] transition-colors duration-500 group-hover:border-maroon/40 group-hover:bg-maroon group-hover:text-marigold">
            {icon}
          </span>
        ) : (
          <span className="pt-6" />
        )}
        {eyebrow ? <span className={icon ? 'mt-5' : undefined}>{eyebrow}</span> : null}
        <Title
          className={`${icon || eyebrow ? 'mt-3' : ''} font-display text-display-sm leading-snug font-medium text-ink transition-colors group-hover:text-maroon`}
        >
          {title}
        </Title>
        {body ? (
          <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted-foreground">{body}</p>
        ) : (
          <span className="flex-1" />
        )}
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </Link>
  );
}
