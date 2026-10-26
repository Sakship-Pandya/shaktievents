'use server';

import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { buildWhatsAppUrl, normalizeIndianPhone } from '@/lib/contact-links';
import { db } from '@/lib/db';
import { sendEnquiryEmail } from '@/lib/email';
import { estimate, formatRange } from '@/lib/estimator';
import { enquirySchema, utmSchema } from '@/lib/schemas/enquiry';
import { EMPTY_RULES, estimatorRulesSchema } from '@/lib/schemas/estimator';
import { parseOr } from '@/lib/schemas/service-content';
import { absoluteUrl } from '@/lib/seo';
import { getSiteConfig } from '@/lib/settings';
import { verifyTurnstile } from '@/lib/turnstile';
import type { Prisma } from '@/lib/generated/prisma/client';

export type QuoteSummary = {
  reference: string;
  name: string;
  estimate: { min: number; max: number; formatted: string; isPeakSeason: boolean } | null;
  whatsappUrl: string | null;
  services: string[];
};

export type QuoteState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors: Record<string, string[] | undefined> }
  | { status: 'done'; summary: QuoteSummary };

const MAX_PER_IP_PER_WINDOW = 5;
const WINDOW_MINUTES = 10;

/** Behind a proxy the first X-Forwarded-For entry is the visitor. */
async function clientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null;
  return h.get('x-real-ip');
}

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const t = await getTranslations('Quote');

  const parsed = enquirySchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    town: formData.get('town'),
    eventType: formData.get('eventType'),
    eventDate: formData.get('eventDate'),
    guests: formData.get('guests'),
    serviceSlugs: formData.getAll('serviceSlugs').map(String).filter(Boolean),
    message: formData.get('message'),
    sourcePath: formData.get('sourcePath'),
    website: formData.get('website') ?? '',
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: t('errorFields'),
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const input = parsed.data;
  const ip = await clientIp();

  // Rate limit before anything expensive. Failing silently would leave a
  // family retrying with no idea why, so this says plainly what happened.
  if (ip) {
    const since = new Date(Date.now() - WINDOW_MINUTES * 60_000);
    const recent = await db.enquiry.count({ where: { ip, createdAt: { gte: since } } });
    if (recent >= MAX_PER_IP_PER_WINDOW) {
      return { status: 'error', message: t('errorTooMany'), fieldErrors: {} };
    }
  }

  const turnstile = await verifyTurnstile(
    formData.get('cf-turnstile-response')?.toString() ?? null,
    ip,
  );
  if (!turnstile.ok) {
    return { status: 'error', message: t('errorVerification'), fieldErrors: {} };
  }

  const [config, settings, services] = await Promise.all([
    getSiteConfig(),
    db.siteSettings.findUnique({
      where: { id: 'singleton' },
      select: { estimatorRules: true, enquiryToEmails: true },
    }),
    db.service.findMany({
      where: { slug: { in: input.serviceSlugs } },
      select: { slug: true, nameEn: true },
    }),
  ]);

  const rules = parseOr(estimatorRulesSchema, settings?.estimatorRules, EMPTY_RULES);
  const result = estimate(rules, {
    serviceSlugs: input.serviceSlugs,
    guests: input.guests,
    eventDate: input.eventDate,
    distanceKm: null,
  });

  const estimateBlock =
    result.kind === 'range'
      ? {
          min: result.min,
          max: result.max,
          formatted: formatRange(result.min, result.max),
          isPeakSeason: result.isPeakSeason,
        }
      : null;

  const utm = utmSchema.safeParse(
    Object.fromEntries(
      [...formData.entries()]
        .filter(([key]) => key.startsWith('utm_'))
        .map(([key, value]) => [key, String(value)]),
    ),
  );

  const normalizedPhone = normalizeIndianPhone(input.phone) ?? input.phone;

  // Duplicate detection: the same number within a day is one enquiry that got
  // submitted twice, not two leads.
  const since = new Date(Date.now() - 24 * 60 * 60_000);
  const existing = await db.enquiry.findFirst({
    where: { phone: normalizedPhone, createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  const data = {
    name: input.name,
    phone: normalizedPhone,
    email: input.email,
    town: input.town,
    eventType: input.eventType,
    eventDate: input.eventDate ? new Date(input.eventDate) : null,
    guests: input.guests,
    message: input.message,
    estimator: {
      serviceSlugs: input.serviceSlugs,
      guests: input.guests,
      eventDate: input.eventDate,
      result: estimateBlock,
    } as unknown as Prisma.InputJsonObject,
    sourcePath: input.sourcePath,
    utm: (utm.success ? utm.data : {}) as unknown as Prisma.InputJsonObject,
    ip,
  };

  const enquiry = existing
    ? await db.enquiry.update({ where: { id: existing.id }, data })
    : await db.enquiry.create({ data });

  // The enquiry is safe in the database from here on. Nothing below may throw.
  const serviceNames = services.map((s) => s.nameEn);

  const email = await sendEnquiryEmail(settings?.enquiryToEmails ?? [], {
    name: input.name,
    phone: normalizedPhone,
    email: input.email,
    town: input.town,
    eventType: input.eventType,
    eventDate: input.eventDate,
    guests: input.guests,
    services: serviceNames,
    message: input.message,
    estimate: estimateBlock?.formatted ?? null,
    sourcePath: input.sourcePath,
    adminUrl: absoluteUrl(`/admin/enquiries/${enquiry.id}`),
  });

  if (!email.sent) {
    console.warn(`[enquiry ${enquiry.id}] email not sent: ${email.reason}`, email.detail ?? '');
  }

  const whatsappMessage = [
    t('waIntro'),
    `${t('waName')}: ${input.name}`,
    input.eventType ? `${t('waEvent')}: ${input.eventType}` : null,
    input.eventDate ? `${t('waDate')}: ${input.eventDate}` : null,
    input.guests ? `${t('waGuests')}: ${input.guests}` : null,
    input.town ? `${t('waTown')}: ${input.town}` : null,
    serviceNames.length ? `${t('waServices')}: ${serviceNames.join(', ')}` : null,
    estimateBlock ? `${t('waEstimate')}: ${estimateBlock.formatted}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    status: 'done',
    summary: {
      reference: enquiry.id.slice(-6).toUpperCase(),
      name: input.name,
      estimate: estimateBlock,
      whatsappUrl: config.whatsappNumber
        ? buildWhatsAppUrl(config.whatsappNumber, whatsappMessage)
        : null,
      services: serviceNames,
    },
  };
}
