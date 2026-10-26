import type { Metadata } from 'next';
import {
  NewTestimonialForm,
  TestimonialCard,
  type Option,
  type TestimonialValues,
} from './testimonial-form';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Testimonials' };
export const dynamic = 'force-dynamic';

export default async function TestimonialsAdminPage() {
  const [rows, services, eventTypes] = await Promise.all([
    db.testimonial.findMany({
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
      include: { services: { select: { id: true } } },
    }),
    db.service.findMany({ orderBy: { order: 'asc' }, select: { id: true, shortEn: true } }),
    db.eventType.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
  ]);

  const serviceOptions: Option[] = services.map((s) => ({ id: s.id, label: s.shortEn }));
  const eventOptions: Option[] = eventTypes.map((e) => ({ id: e.id, label: e.nameEn }));

  const values: TestimonialValues[] = rows.map((row) => ({
    id: row.id,
    authorName: row.authorName,
    authorRole: row.authorRole ?? '',
    town: row.town ?? '',
    quoteEn: row.quoteEn ?? '',
    quoteGu: row.quoteGu ?? '',
    rating: row.rating == null ? '' : String(row.rating),
    kind: row.kind,
    videoUrl: row.videoUrl ?? '',
    sourceUrl: row.sourceUrl ?? '',
    status: row.status,
    featured: row.featured,
    order: String(row.order),
    serviceIds: row.services.map((s) => s.id),
    eventTypeId: row.eventTypeId ?? '',
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-display-md font-medium text-ink">Testimonials</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Reviews shown on the testimonials page and, where tagged, on the matching service pages.
        Only published ones are public.
      </p>

      {values.length > 0 ? (
        <ul className="mb-6 grid gap-4">
          {values.map((row) => (
            <TestimonialCard
              key={row.id}
              values={row}
              services={serviceOptions}
              eventTypes={eventOptions}
            />
          ))}
        </ul>
      ) : null}

      <NewTestimonialForm services={serviceOptions} eventTypes={eventOptions} />
    </div>
  );
}
