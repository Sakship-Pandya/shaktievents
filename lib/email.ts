import { Resend } from 'resend';

/**
 * Enquiry notifications. Email must never be able to fail a submission — the
 * enquiry is already in the database by the time this runs, and a family who
 * filled in the form should see a confirmation whether or not Resend is
 * configured or reachable. Every path returns a result rather than throwing.
 */
export type EmailResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: 'not-configured' | 'no-recipients' | 'failed'; detail?: string };

export type EnquiryEmailData = {
  name: string;
  phone: string;
  email: string | null;
  town: string | null;
  eventType: string | null;
  eventDate: string | null;
  guests: number | null;
  services: string[];
  message: string | null;
  estimate: string | null;
  sourcePath: string | null;
  adminUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string | null): string {
  if (!value) return '';
  return `<tr>
    <td style="padding:8px 16px 8px 0;color:#8a7a63;font:600 12px/1.4 Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#14100d;font:400 15px/1.5 Helvetica,Arial,sans-serif">${escapeHtml(value)}</td>
  </tr>`;
}

function renderHtml(data: EnquiryEmailData): string {
  return `<!doctype html>
<html><body style="margin:0;background:#fbf6ee;padding:24px">
  <table role="presentation" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e7d3a3;border-radius:12px">
    <tr><td style="padding:24px 28px;background:#7a1f2b;border-radius:11px 11px 0 0">
      <p style="margin:0;color:#f5b32b;font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase">New enquiry</p>
      <p style="margin:6px 0 0;color:#fbf6ee;font:400 22px/1.3 Georgia,serif">${escapeHtml(data.name)}</p>
    </td></tr>
    <tr><td style="padding:24px 28px">
      <table role="presentation" style="width:100%;border-collapse:collapse">
        ${row('Phone', data.phone)}
        ${row('Email', data.email)}
        ${row('Town', data.town)}
        ${row('Event', data.eventType)}
        ${row('Date', data.eventDate)}
        ${row('Guests', data.guests ? data.guests.toLocaleString('en-IN') : null)}
        ${row('Services', data.services.join(', ') || null)}
        ${row('Estimate shown', data.estimate)}
        ${row('From page', data.sourcePath)}
      </table>
      ${
        data.message
          ? `<p style="margin:20px 0 0;padding:16px;background:#efe3cb;border-radius:8px;color:#14100d;font:400 15px/1.6 Helvetica,Arial,sans-serif;white-space:pre-wrap">${escapeHtml(data.message)}</p>`
          : ''
      }
      <p style="margin:24px 0 0">
        <a href="${escapeHtml(data.adminUrl)}" style="display:inline-block;padding:12px 22px;background:#f5b32b;color:#14100d;border-radius:999px;font:600 14px Helvetica,Arial,sans-serif;text-decoration:none">Open in the admin</a>
      </p>
    </td></tr>
  </table>
</body></html>`;
}

function renderText(data: EnquiryEmailData): string {
  const lines = [
    `New enquiry from ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : null,
    data.town ? `Town: ${data.town}` : null,
    data.eventType ? `Event: ${data.eventType}` : null,
    data.eventDate ? `Date: ${data.eventDate}` : null,
    data.guests ? `Guests: ${data.guests}` : null,
    data.services.length ? `Services: ${data.services.join(', ')}` : null,
    data.estimate ? `Estimate shown: ${data.estimate}` : null,
    data.message ? `\n${data.message}` : null,
    `\n${data.adminUrl}`,
  ];
  return lines.filter(Boolean).join('\n');
}

export async function sendEnquiryEmail(
  recipients: string[],
  data: EnquiryEmailData,
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: 'not-configured' };

  const to = recipients.filter(Boolean);
  if (to.length === 0) return { sent: false, reason: 'no-recipients' };

  try {
    const resend = new Resend(apiKey);
    const { data: result, error } = await resend.emails.send({
      // Overridable so the client can use their own verified domain.
      from: process.env.ENQUIRY_FROM_EMAIL ?? 'Shree Shakti <onboarding@resend.dev>',
      to,
      ...(data.email ? { replyTo: data.email } : {}),
      subject: `New enquiry — ${data.name}${data.town ? `, ${data.town}` : ''}`,
      html: renderHtml(data),
      text: renderText(data),
    });

    if (error) return { sent: false, reason: 'failed', detail: error.message };
    return { sent: true, id: result?.id ?? null };
  } catch (error) {
    return { sent: false, reason: 'failed', detail: String(error) };
  }
}
