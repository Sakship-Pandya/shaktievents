import { unstable_cache } from 'next/cache';
import { db } from './db';
import { site, type ContactInfo, type SiteStats } from './site';

/**
 * The business facts every public page reads. Values come from the
 * SiteSettings row the client edits at /admin/settings, falling back to the
 * static defaults in lib/site.ts for anything not yet filled in.
 *
 * Cached under the `settings` tag, which the settings action revalidates —
 * so a save is reflected on the public site without a redeploy.
 */
export type SiteConfig = {
  name: string;
  shortName: string;
  city: string;
  district: string;
  state: string;
  pin: string;
  phonePrimary: string | null;
  phoneSecondary: string | null;
  phoneTertiary: string | null;
  whatsappNumber: string | null;
  email: string | null;
  addressLine: string | null;
  area: string | null;
  googleMapsUrl: string | null;
  googleBusinessProfileUrl: string | null;
  establishedYear: number | null;
  ownerName: string | null;
  gstNo: string | null;
  logoUrl: string | null;
  socials: { instagram: string | null; facebook: string | null; youtube: string | null };
  stats: SiteStats;
  whatsappDefaultMessage: string;
};

const fallback: SiteConfig = {
  name: site.name,
  shortName: site.shortName,
  city: site.city,
  district: site.district,
  state: site.state,
  pin: site.pin,
  phonePrimary: site.phonePrimary,
  phoneSecondary: site.phoneSecondary,
  phoneTertiary: site.phoneTertiary,
  whatsappNumber: site.whatsappNumber,
  email: site.email,
  addressLine: site.addressLine,
  area: site.area,
  googleMapsUrl: site.googleMapsUrl,
  googleBusinessProfileUrl: site.googleBusinessProfileUrl,
  establishedYear: site.establishedYear,
  ownerName: site.ownerName,
  gstNo: site.gstNo,
  logoUrl: null,
  socials: site.socials,
  stats: site.stats,
  whatsappDefaultMessage: site.whatsappDefaultMessage,
};

async function loadSiteConfig(): Promise<SiteConfig> {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (!row) return fallback;

    return {
      name: row.businessName || fallback.name,
      shortName: row.shortName || fallback.shortName,
      city: row.city,
      district: row.district,
      state: row.state,
      pin: row.pin,
      phonePrimary: row.phonePrimary,
      phoneSecondary: row.phoneSecondary,
      phoneTertiary: null,
      whatsappNumber: row.whatsappNumber,
      email: row.email ?? fallback.email,
      addressLine: row.addressLine ?? fallback.addressLine,
      area: row.area ?? fallback.area,
      googleMapsUrl: row.googleMapsUrl ?? fallback.googleMapsUrl,
      googleBusinessProfileUrl: row.googleBusinessProfileUrl,
      establishedYear: row.establishedYear,
      ownerName: row.ownerName,
      gstNo: row.gstNo,
      logoUrl: row.logoUrl,
      socials: {
        instagram: row.instagram,
        facebook: row.facebook,
        youtube: row.youtube,
      },
      stats: {
        eventsCompleted: row.eventsCompleted ?? fallback.stats.eventsCompleted,
        years: row.establishedYear
          ? new Date().getFullYear() - row.establishedYear
          : fallback.stats.years,
        townsServed: row.townsServed ?? fallback.stats.townsServed,
        teamSize: row.teamSize ?? fallback.stats.teamSize,
      },
      whatsappDefaultMessage: row.whatsappDefaultMessage || fallback.whatsappDefaultMessage,
    };
  } catch (error) {
    // A settings read must never take the public site down; [TBD] markers are
    // a visible failure mode, a 500 on every page is not.
    console.error('[settings] falling back to static defaults:', error);
    return fallback;
  }
}

export const getSiteConfig = unstable_cache(loadSiteConfig, ['site-config'], {
  tags: ['settings'],
  revalidate: 3600,
});

export type { ContactInfo };

export function toContactInfo(config: SiteConfig): ContactInfo {
  return {
    phone: config.phonePrimary,
    whatsapp: config.whatsappNumber,
    whatsappMessage: config.whatsappDefaultMessage,
  };
}
