import type { Metadata } from 'next';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { deleteRedirect } from './actions';
import { NewRedirectForm } from './redirect-form';
import { DeleteButton } from '@/components/admin/form-bits';
import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = { title: 'SEO' };
export const dynamic = 'force-dynamic';

export default async function SeoAdminPage() {
  const [redirects, counts] = await Promise.all([
    db.redirect.findMany({ orderBy: { createdAt: 'desc' } }),
    Promise.all([
      db.service.count({ where: { isActive: true } }),
      db.area.count({ where: { isActive: true } }),
      db.eventType.count({ where: { isActive: true } }),
      db.project.count({ where: { status: 'PUBLISHED' } }),
      db.blogPost.count({ where: { status: 'PUBLISHED' } }),
    ]),
  ]);

  const [services, areas, eventTypes, projects, posts] = counts;
  const indexable = 13 + services + areas + eventTypes + projects + posts;

  const files = [
    {
      label: 'Sitemap',
      href: '/sitemap.xml',
      note: 'Every page, in both languages, with hreflang.',
    },
    {
      label: 'Image sitemap',
      href: '/image-sitemap.xml',
      note: 'Project photographs with captions. Placeholders are left out.',
    },
    {
      label: 'robots.txt',
      href: '/robots.txt',
      note: 'What crawlers may read, and where the sitemaps are.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-display-md font-medium text-ink">SEO</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Per-page titles and descriptions are edited on each item — a service, a town, a post. This
        page covers the site-wide files and the redirects.
      </p>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Files</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Roughly {indexable} pages per language are listed for indexing. Open each file to check it
          looks right before submitting it to Search Console.
        </p>
        <ul className="mt-5 grid gap-2">
          {files.map((file) => (
            <li key={file.href}>
              <a
                href={file.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-sand"
              >
                <ExternalLink className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  <span className="block font-medium text-ink">{file.label}</span>
                  <span className="block text-xs text-muted-foreground">{file.note}</span>
                  <span className="block text-xs text-muted-foreground">
                    {absoluteUrl(file.href)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-4 font-display text-display-sm font-medium text-ink">Redirects</h2>

        {redirects.length > 0 ? (
          <ul className="mb-6 grid gap-2">
            {redirects.map((rule) => (
              <li
                key={rule.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <code className="rounded bg-sand px-2 py-1 text-xs">{rule.source}</code>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                <code className="rounded bg-sand px-2 py-1 text-xs">{rule.destination}</code>
                <span className="rounded-full border border-border px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide uppercase">
                  {rule.permanent ? '301' : '302'}
                </span>
                <span className="ml-auto">
                  <DeleteButton
                    action={deleteRedirect.bind(null, rule.id)}
                    confirmText="Remove this redirect? The old URL will start returning 404."
                  />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-6 rounded-xl border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
            No redirects yet. You will want one the first time a page is renamed.
          </p>
        )}

        <NewRedirectForm />
      </section>
    </div>
  );
}
