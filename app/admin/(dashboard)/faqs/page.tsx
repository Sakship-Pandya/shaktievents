import type { Metadata } from 'next';
import { FaqCard, NewFaqForm, type FaqValues, type Option } from './faq-form';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'FAQs' };
export const dynamic = 'force-dynamic';

export default async function FaqsAdminPage() {
  const [rows, services] = await Promise.all([
    db.faq.findMany({ orderBy: [{ scope: 'asc' }, { order: 'asc' }] }),
    db.service.findMany({ orderBy: { order: 'asc' }, select: { id: true, shortEn: true } }),
  ]);

  const serviceOptions: Option[] = services.map((s) => ({ id: s.id, label: s.shortEn }));

  const values: FaqValues[] = rows.map((row) => ({
    id: row.id,
    questionEn: row.questionEn,
    questionGu: row.questionGu,
    answerEn: row.answerEn,
    answerGu: row.answerGu,
    scope: row.scope,
    serviceId: row.serviceId ?? '',
    order: String(row.order),
    isActive: row.isActive,
  }));

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">FAQs</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        {values.length} questions across the FAQ page and the service pages.
      </p>

      {values.length > 0 ? (
        <ul className="mb-6 grid gap-3">
          {values.map((row) => (
            <FaqCard key={row.id} values={row} services={serviceOptions} />
          ))}
        </ul>
      ) : null}

      <NewFaqForm services={serviceOptions} />
    </div>
  );
}
