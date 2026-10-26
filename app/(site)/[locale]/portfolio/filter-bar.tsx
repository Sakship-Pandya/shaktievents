'use client';

import { X } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import type { FilterOptions } from '@/lib/projects-data';

type Labels = {
  eventType: string;
  service: string;
  year: string;
  any: string;
  sort: string;
  sortLatest: string;
  sortOldest: string;
  clear: string;
};

/**
 * Filters live in the URL rather than component state, so a filtered view can
 * be shared, bookmarked and reached with the back button. Changing a select
 * resets to page 1 — leaving someone on page 4 of a different result set is a
 * classic way to show an empty page.
 */
export function FilterBar({
  options,
  labels,
  active,
}: {
  options: FilterOptions;
  labels: Labels;
  active: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const select = (key: string, label: string, items: { slug: string; name: string }[]) => {
    if (items.length === 0) return null;
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-gold-soft uppercase">
          {label}
        </span>
        <select
          value={params.get(key) ?? ''}
          onChange={(e) => update(key, e.target.value)}
          className="h-10 min-w-40 rounded-full border border-gold/35 bg-ink-800 px-4 text-sm text-ivory outline-none focus-visible:border-gold"
        >
          <option value="">{labels.any}</option>
          {items.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
    );
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      {select('eventType', labels.eventType, options.eventTypes)}
      {select('service', labels.service, options.services)}
      {select(
        'year',
        labels.year,
        options.years.map((y) => ({ slug: String(y), name: String(y) })),
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-gold-soft uppercase">
          {labels.sort}
        </span>
        <select
          value={params.get('sort') === 'oldest' ? 'oldest' : 'latest'}
          onChange={(e) => update('sort', e.target.value === 'latest' ? '' : e.target.value)}
          className="h-10 min-w-40 rounded-full border border-gold/35 bg-ink-800 px-4 text-sm text-ivory outline-none focus-visible:border-gold"
        >
          <option value="latest">{labels.sortLatest}</option>
          <option value="oldest">{labels.sortOldest}</option>
        </select>
      </label>

      {active ? (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-gold/35 px-4 text-sm text-ivory-muted transition-colors hover:border-gold hover:text-marigold"
        >
          <X className="size-3.5" />
          {labels.clear}
        </button>
      ) : null}
    </div>
  );
}
