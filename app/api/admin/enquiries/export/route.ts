import { getSessionUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

const COLUMNS = [
  'created',
  'status',
  'name',
  'phone',
  'email',
  'town',
  'eventType',
  'eventDate',
  'guests',
  'source',
  'message',
] as const;

/** RFC 4180: quote everything, double any embedded quotes. */
function cell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  return `"${String(value).replace(/"/g, '""')}"`;
}

/**
 * CSV of every enquiry, for the client's own records. Signed-in users only —
 * this is the customer list.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response('Not signed in', { status: 401 });

  const enquiries = await db.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      createdAt: true,
      status: true,
      name: true,
      phone: true,
      email: true,
      town: true,
      eventType: true,
      eventDate: true,
      guests: true,
      sourcePath: true,
      message: true,
    },
  });

  if (enquiries.length === 0) {
    return new Response('No enquiries exist to export.', { status: 404 });
  }

  const rows = enquiries.map((e) =>
    [
      e.createdAt.toISOString(),
      e.status,
      e.name,
      e.phone,
      e.email,
      e.town,
      e.eventType,
      e.eventDate ? e.eventDate.toISOString().slice(0, 10) : null,
      e.guests,
      e.sourcePath,
      e.message,
    ]
      .map(cell)
      .join(','),
  );

  // BOM so Excel opens Gujarati text correctly.
  const csv = `﻿${COLUMNS.map(cell).join(',')}\n${rows.join('\n')}\n`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="enquiries-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
