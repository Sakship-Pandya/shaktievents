import type { Metadata } from 'next';
import { CalendarDays, FolderOpen, Image as ImageIcon, Inbox } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

function startOfWeek(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return d;
}

export default async function AdminDashboard() {
  const weekStart = startOfWeek();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    enquiriesThisWeek,
    openEnquiries,
    upcomingBookings,
    publishedProjects,
    draftProjects,
    mediaCount,
    recentEnquiries,
  ] = await Promise.all([
    db.enquiry.count({ where: { createdAt: { gte: weekStart } } }),
    db.enquiry.count({ where: { status: { in: ['NEW', 'CONTACTED', 'SITE_VISIT', 'QUOTED'] } } }),
    db.booking.count({ where: { date: { gte: today } } }),
    db.project.count({ where: { status: 'PUBLISHED' } }),
    db.project.count({ where: { status: 'DRAFT' } }),
    db.media.count(),
    db.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, phone: true, town: true, status: true, createdAt: true },
    }),
  ]);

  const cards = [
    {
      label: 'Enquiries this week',
      value: enquiriesThisWeek,
      icon: Inbox,
      hint: `${openEnquiries} still open`,
    },
    { label: 'Dates marked busy', value: upcomingBookings, icon: CalendarDays, hint: 'Upcoming' },
    {
      label: 'Published projects',
      value: publishedProjects,
      icon: FolderOpen,
      hint: `${draftProjects} in draft`,
    },
    { label: 'Media files', value: mediaCount, icon: ImageIcon, hint: 'In the library' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-display-md font-medium text-ink">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A snapshot of enquiries, bookings and content.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.8rem] leading-snug text-muted-foreground">{card.label}</p>
                <Icon className="size-4 shrink-0 text-gold" />
              </div>
              <p className="mt-3 font-display text-4xl font-medium text-ink tabular">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-display-sm font-medium text-ink">Latest enquiries</h2>
        <div className="mt-4 rounded-xl border border-border bg-card">
          {recentEnquiries.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No enquiries yet. They will appear here as soon as the quote form goes live in step 6.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{e.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.phone}
                      {e.town ? ` · ${e.town}` : ''}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase">
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-display-sm font-medium text-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/settings"
            className="inline-flex h-11 items-center rounded-full bg-maroon px-6 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-600"
          >
            Fill in business details
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold text-ink transition-colors hover:bg-sand"
          >
            Media library
          </Link>
        </div>
      </section>
    </div>
  );
}
