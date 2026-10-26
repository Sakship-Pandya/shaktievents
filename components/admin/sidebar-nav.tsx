'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNav } from './nav-items';
import { cn } from '@/lib/utils';

/** Shared by the desktop rail and the mobile sheet. */
export function SidebarNav({
  role,
  onNavigate,
}: {
  role: 'ADMIN' | 'EDITOR';
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const allHrefs = adminNav.flatMap((g) => g.items.map((i) => i.href));

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {adminNav.map((group) => {
        // Admin-only modules are hidden rather than shown and then refused —
        // a link that bounces you back is worse than no link.
        const items = group.items.filter((item) => !item.adminOnly || role === 'ADMIN');
        if (items.length === 0) return null;

        return (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isPrefixMatch =
                  pathname === item.href || pathname.startsWith(item.href + '/');
                const hasMoreSpecificMatch = allHrefs.some(
                  (href) =>
                    href !== item.href &&
                    href.length > item.href.length &&
                    (pathname === href || pathname.startsWith(href + '/')),
                );
                const isActive = isPrefixMatch && !hasMoreSpecificMatch;

                if (item.comingInStep) {
                  return (
                    <li key={item.href}>
                      <span
                        aria-disabled
                        title={`Ships in step ${item.comingInStep}`}
                        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/55"
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        <span className="rounded-full border border-border px-1.5 py-0.5 text-[0.6rem] font-semibold">
                          {item.comingInStep}
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      onClick={onNavigate}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-maroon text-ivory'
                          : 'text-ink/80 hover:bg-sand hover:text-ink',
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
