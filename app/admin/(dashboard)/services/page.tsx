import type { Metadata } from 'next';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toggleServiceFlag } from './actions';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Services' };
export const dynamic = 'force-dynamic';

function FlagButton({
  slug,
  flag,
  on,
  onTitle,
  offTitle,
  children,
}: {
  slug: string;
  flag: 'featured' | 'isActive';
  on: boolean;
  onTitle: string;
  offTitle: string;
  children: React.ReactNode;
}) {
  return (
    <form action={toggleServiceFlag.bind(null, slug, flag)}>
      <button
        type="submit"
        title={on ? offTitle : onTitle}
        aria-label={on ? offTitle : onTitle}
        className={`grid size-8 place-items-center rounded-lg border transition-colors ${
          on
            ? 'border-maroon/40 bg-maroon/10 text-maroon'
            : 'border-border text-muted-foreground hover:bg-sand'
        }`}
      >
        {children}
      </button>
    </form>
  );
}

export default async function ServicesAdminPage() {
  const services = await db.service.findMany({
    orderBy: { order: 'asc' },
    select: {
      slug: true,
      nameEn: true,
      order: true,
      featured: true,
      isActive: true,
      contentEn: true,
      _count: { select: { faqs: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="font-display text-display-md font-medium text-ink">Services</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        The fourteen service pages. Turning one off hides its card and sets its page to noindex —
        the URL keeps working, so an indexed page is never left as a dead link.
      </p>

      <ul className="grid gap-2">
        {services.map((service) => (
          <li
            key={service.slug}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="w-6 shrink-0 text-center text-sm text-muted-foreground tabular">
              {service.order + 1}
            </span>

            <Link
              href={`/admin/services/${service.slug}`}
              className="min-w-0 flex-1 hover:text-maroon"
            >
              <span className="block truncate font-medium text-ink">{service.nameEn}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {service.contentEn ? 'Copy written' : 'No copy yet'} · {service._count.faqs} FAQ
                {service._count.faqs === 1 ? '' : 's'}
              </span>
            </Link>

            <FlagButton
              slug={service.slug}
              flag="isActive"
              on={service.isActive}
              onTitle="Show on the site"
              offTitle="Hide from the site"
            >
              {service.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </FlagButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
