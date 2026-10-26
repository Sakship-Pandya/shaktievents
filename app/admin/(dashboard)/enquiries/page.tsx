import type { Metadata } from 'next';
import { Download, FileText, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/brand/icons';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/contact-links';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Enquiries' };
export const dynamic = 'force-dynamic';

const COLUMNS = [
  { status: 'NEW', label: 'New' },
  { status: 'CONTACTED', label: 'Contacted' },
  { status: 'SITE_VISIT', label: 'Site visit' },
  { status: 'QUOTED', label: 'Quoted' },
  { status: 'BOOKED', label: 'Booked' },
  { status: 'LOST', label: 'Lost' },
] as const;

function since(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / 3_600_000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default async function EnquiriesPage() {
  const enquiries = await db.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
    select: {
      id: true,
      name: true,
      phone: true,
      town: true,
      eventType: true,
      guests: true,
      status: true,
      createdAt: true,
      _count: { select: { notes: true } },
    },
  });

  const byStatus = new Map<string, typeof enquiries>();
  for (const enquiry of enquiries) {
    const list = byStatus.get(enquiry.status) ?? [];
    list.push(enquiry);
    byStatus.set(enquiry.status, list);
  }

  const hasEnquiries = enquiries.length > 0;

  return (
    <div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-display-md font-medium text-ink">Enquiries</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every enquiry from the quote wizard and the contact form. Drag is not needed — open one
            to move it along.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {hasEnquiries ? (
            <>
              <a
                href="/api/admin/enquiries/export"
                download
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-ink transition-colors hover:bg-sand"
              >
                <Download className="size-4" />
                Export CSV
              </a>
              <a
                href="/api/admin/enquiries/export-pdf"
                download
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-ink transition-colors hover:bg-sand"
              >
                <FileText className="size-4" />
                Export PDF
              </a>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                title="No enquiries to export"
                className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-ink/40 opacity-50"
              >
                <Download className="size-4" />
                Export CSV
              </button>
              <button
                type="button"
                disabled
                title="No enquiries to export"
                className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-ink/40 opacity-50"
              >
                <FileText className="size-4" />
                Export PDF
              </button>
            </>
          )}
        </div>
      </div>

      {enquiries.length === 0 ? (
        <p className="rounded-xl border border-border bg-card px-5 py-14 text-center text-sm text-muted-foreground">
          No enquiries yet. They arrive here the moment someone finishes the quote form.
        </p>
      ) : (
        <div className="grid gap-4 overflow-x-auto md:grid-cols-2 xl:grid-cols-3">
          {COLUMNS.map((column) => {
            const items = byStatus.get(column.status) ?? [];
            return (
              <section key={column.status} className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-3 flex items-center justify-between text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {column.label}
                  <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] tabular">
                    {items.length}
                  </span>
                </h2>

                {items.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">—</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((enquiry) => {
                      const tel = buildTelUrl(enquiry.phone);
                      const wa = buildWhatsAppUrl(enquiry.phone);
                      return (
                        <li
                          key={enquiry.id}
                          className="rounded-lg border border-border bg-ivory p-3"
                        >
                          <Link
                            href={`/admin/enquiries/${enquiry.id}`}
                            className="block hover:text-maroon"
                          >
                            <span className="block truncate text-sm font-medium text-ink">
                              {enquiry.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {[
                                enquiry.town,
                                enquiry.eventType,
                                enquiry.guests
                                  ? `${enquiry.guests.toLocaleString('en-IN')} guests`
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(' · ') || enquiry.phone}
                            </span>
                          </Link>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[0.65rem] text-muted-foreground">
                              {since(enquiry.createdAt)}
                              {enquiry._count.notes > 0 ? ` · ${enquiry._count.notes} notes` : ''}
                            </span>
                            <span className="flex gap-1">
                              {tel ? (
                                <a
                                  href={tel}
                                  title="Call"
                                  aria-label={`Call ${enquiry.name}`}
                                  className="grid size-7 place-items-center rounded border border-border text-ink hover:bg-sand"
                                >
                                  <PhoneIcon className="size-3.5" />
                                </a>
                              ) : null}
                              {wa ? (
                                <a
                                  href={wa}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp"
                                  aria-label={`WhatsApp ${enquiry.name}`}
                                  className="grid size-7 place-items-center rounded border border-border text-emerald hover:bg-sand"
                                >
                                  <WhatsAppIcon className="size-3.5" />
                                </a>
                              ) : null}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
