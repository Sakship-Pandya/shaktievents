import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSessionUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
      message: true,
    },
  });

  if (enquiries.length === 0) {
    return new Response('No enquiries exist to export.', { status: 404 });
  }

  // Create landscape document for wide table layout
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

  // Header / Branding
  doc.setFontSize(18);
  doc.setTextColor(122, 31, 45); // Maroon
  doc.text('Shree Shakti Events — Enquiries Report', 40, 45);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const nowStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  doc.text(`Generated on: ${nowStr}  |  Total records: ${enquiries.length}`, 40, 65);

  const tableRows = enquiries.map((e) => [
    e.createdAt.toLocaleDateString('en-IN'),
    e.status,
    e.name,
    e.phone,
    e.town || '—',
    e.eventType || '—',
    e.eventDate ? e.eventDate.toISOString().slice(0, 10) : '—',
    e.guests ? String(e.guests) : '—',
    (e.message || '—').replace(/[\r\n]+/g, ' ').slice(0, 80),
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Date', 'Status', 'Name', 'Phone', 'Town', 'Event Type', 'Event Date', 'Guests', 'Message']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [122, 31, 45], // Maroon
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
    },
    alternateRowStyles: {
      fillColor: [248, 246, 240], // Light ivory / sand
    },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 55 },
      2: { cellWidth: 80 },
      3: { cellWidth: 70 },
      4: { cellWidth: 55 },
      5: { cellWidth: 75 },
      6: { cellWidth: 55 },
      7: { cellWidth: 40 },
      8: { cellWidth: 'auto' },
    },
    margin: { left: 40, right: 40 },
  });

  const arrayBuffer = doc.output('arraybuffer');
  const buffer = Buffer.from(arrayBuffer);
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="enquiries-${stamp}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
