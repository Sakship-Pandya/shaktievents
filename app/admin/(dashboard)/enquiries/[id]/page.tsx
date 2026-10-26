import type { Metadata } from 'next';
import { ArrowLeft, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WhatsAppIcon } from '@/components/brand/icons';
import { assignEnquiry, setEnquiryStatus } from '../actions';
import { NoteForm } from './note-form';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/contact-links';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Enquiry' };
export const dynamic = 'force-dynamic';

const STATUSES = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'SITE_VISIT', label: 'Site visit' },
  { value: 'QUOTED', label: 'Quoted' },
  { value: 'BOOKED', label: 'Booked' },
  { value: 'LOST', label: 'Lost' },
] as const;

type EstimatorPayload = {
  serviceSlugs?: string[];
  result?: { formatted?: string; isPeakSeason?: boolean } | null;
};

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [enquiry, users] = await Promise.all([
    db.enquiry.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { name: true, email: true } } },
        },
      },
    }),
    db.user.findMany({ where: { isActive: true }, select: { id: true, name: true, email: true } }),
  ]);

  if (!enquiry) notFound();

  const tel = buildTelUrl(enquiry.phone);
  const wa = buildWhatsAppUrl(enquiry.phone);
  const estimator = (enquiry.estimator ?? {}) as EstimatorPayload;
  const utm = (enquiry.utm ?? {}) as Record<string, string>;

  const facts = [
    ['Phone', enquiry.phone],
    ['Email', enquiry.email],
    ['Town', enquiry.town],
    ['Event', enquiry.eventType],
    ['Date', enquiry.eventDate ? enquiry.eventDate.toISOString().slice(0, 10) : null],
    ['Guests', enquiry.guests ? enquiry.guests.toLocaleString('en-IN') : null],
    ['Services asked for', estimator.serviceSlugs?.join(', ') || null],
    ['Estimate shown', estimator.result?.formatted ?? 'None — quoted after a site visit'],
    ['Came from', enquiry.sourcePath],
    ['Campaign', Object.values(utm).filter(Boolean).join(' / ') || null],
    ['Received', enquiry.createdAt.toISOString().replace('T', ' ').slice(0, 16)],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-maroon"
      >
        <ArrowLeft className="size-4" />
        All enquiries
      </Link>

      <div className="mt-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-display-md font-medium text-ink">{enquiry.name}</h1>
        <div className="flex gap-2">
          {tel ? (
            <a
              href={tel}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-ink transition-colors hover:bg-sand"
            >
              <PhoneIcon className="size-4" />
              Call
            </a>
          ) : null}
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald px-4 text-sm font-semibold text-ivory transition-colors hover:opacity-90"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <form key={status.value} action={setEnquiryStatus.bind(null, id, status.value)}>
              <button
                type="submit"
                aria-current={enquiry.status === status.value ? 'true' : undefined}
                className={`rounded-full px-4 py-2 text-[0.8rem] font-semibold transition-colors ${
                  enquiry.status === status.value
                    ? 'bg-maroon text-ivory'
                    : 'border border-border text-ink hover:bg-sand'
                }`}
              >
                {status.label}
              </button>
            </form>
          ))}
        </div>

        <form action={assignEnquiry.bind(null, id)} className="mt-5 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Assigned to
            </span>
            <select
              name="userId"
              defaultValue={enquiry.assigneeId ?? ''}
              className="h-9 min-w-52 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Nobody</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? user.email}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="h-9 rounded-full border border-border px-4 text-[0.8rem] font-semibold text-ink transition-colors hover:bg-sand"
          >
            Assign
          </button>
        </form>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Details</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="mt-0.5 text-sm break-words text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        {enquiry.message ? (
          <p className="mt-5 rounded-lg bg-sand p-4 text-sm leading-relaxed whitespace-pre-wrap text-ink">
            {enquiry.message}
          </p>
        ) : null}
      </section>

      <section className="mt-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-display-sm font-medium text-ink">Notes</h2>
        <NoteForm enquiryId={id} />

        {enquiry.notes.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {enquiry.notes.map((note) => (
              <li key={note.id} className="rounded-lg border border-border p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">{note.body}</p>
                <p className="mt-2 text-[0.7rem] text-muted-foreground">
                  {note.author?.name ?? note.author?.email ?? 'Someone'} ·{' '}
                  {note.createdAt.toISOString().replace('T', ' ').slice(0, 16)}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
