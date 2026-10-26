import type { Metadata } from 'next';
import { ClientCard, NewClientForm, type ClientValues } from './client-form';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Trusted by' };
export const dynamic = 'force-dynamic';

export default async function ClientsAdminPage() {
  const rows = await db.client.findMany({ orderBy: { order: 'asc' } });

  const values: ClientValues[] = rows.map((row) => ({
    id: row.id,
    nameEn: row.nameEn,
    nameGu: row.nameGu,
    logoUrl: row.logoUrl ?? '',
    website: row.website ?? '',
    order: String(row.order),
    isActive: row.isActive,
  }));

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="font-display text-display-md font-medium text-ink">Trusted by</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Organisations you have worked for. Nothing here is seeded — these are real names or the list
        stays empty.
      </p>

      {values.length > 0 ? (
        <ul className="mb-6 grid gap-3">
          {values.map((row) => (
            <ClientCard key={row.id} values={row} />
          ))}
        </ul>
      ) : null}

      <NewClientForm />
    </div>
  );
}
