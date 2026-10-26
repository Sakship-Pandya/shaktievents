import { ChevronRight } from 'lucide-react';
import { NavLink } from '@/components/site/nav-link';

export type Crumb = { name: string; path: string };

/** Visible trail. The matching BreadcrumbList JSON-LD is emitted by the page. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-ivory-muted">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-gold-soft">
                  {crumb.name}
                </span>
              ) : (
                <NavLink href={crumb.path} className="transition-colors hover:text-marigold">
                  {crumb.name}
                </NavLink>
              )}
              {!isLast ? <ChevronRight aria-hidden className="size-3.5 text-gold/50" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
