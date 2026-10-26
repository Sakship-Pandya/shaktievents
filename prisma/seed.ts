/**
 * Idempotent seed. Every write is an upsert keyed on a natural unique field,
 * so `pnpm db:seed` can be re-run safely against an existing database.
 *
 * Scope note: this seeds the *structure* — rows, relations and default page
 * sections. Long-form service copy lands in step 4, blog bodies in step 8;
 * those rows are created here as DRAFT with their slugs and SEO fixed so the
 * URLs never change once indexed.
 */
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Prisma } from '../lib/generated/prisma/client';
import { areas } from '../lib/areas';
import { eventTypes } from '../lib/event-types';
import { services } from '../lib/services';
import { faqs } from '../lib/seed-content/faqs';
import { areaSeeds } from '../lib/seed-content/areas-content';
import { eventSeeds } from '../lib/seed-content/events-content';
import { serviceSeeds } from '../lib/seed-content/services';
import { blogPosts, blogCategories } from '../lib/seed-content/blog';
import { blogBodies } from '../lib/seed-content/blog-bodies';
import { toDoc } from '../lib/seed-content/blocks';
import { readingMinutes } from '../lib/schemas/rich-text';
import {
  placeholderMedia,
  placeholderPath,
  placeholderPublicId,
  sampleProjects,
} from '../lib/seed-content/projects';
import { pages } from '../lib/seed-content/pages';
import { allWorkPhotos, workPhoto } from '../lib/work-photos';

if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile('.env.local');
  } catch {
    // fall through to the explicit error below
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set.');

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function seedSettings() {
  await db.siteSettings.upsert({
    where: { id: 'singleton' },
    // Only ever create. An existing row holds the client's real details and
    // must never be reset by a re-run.
    update: {},
    create: {
      id: 'singleton',
      businessName: 'Shree Shakti Sound Service & Mandap Contractor',
      shortName: 'Shree Shakti',
      phonePrimary: '9375253235',
      phoneSecondary: '9825231482',
      whatsappNumber: '9375253235',
      email: 'info@shaktieventsdecor.com',
      addressLine: 'Near Old Powerhouse, Sonapuri Road, Handloom Chowk',
      area: 'Handloom Chowk',
      googleMapsUrl: 'https://share.google/9z4NabpDNmTG0oINK',
      eventsCompleted: 250,
      teamSize: 40,
      townsServed: 25,
      whatsappDefaultMessage:
        'Namaste Shree Shakti! I would like a quote for my event. Date: ___  Town: ___  Guests: ___',
      featureFlags: {
        instagram: false,
        panorama: false,
        styleExplorer: false,
        countdown: false,
        popup: false,
      },
      estimatorRules: {
        baseByService: {},
        guestBands: [],
        seasonMultipliers: {},
        distancePerKm: null,
      },
      enquiryToEmails: [],
    },
  });
  console.log('  settings   singleton');
}

async function seedAnnouncement() {
  // Preserves the strip the site shipped with, now editable at
  // /admin/announcements instead of being hardcoded in the messages files.
  const textEn = 'Now booking for Lagan Season 2026-27';
  const existing = await db.announcement.findFirst({ where: { textEn } });
  if (existing) {
    console.log('  announce  already present');
    return;
  }

  await db.announcement.create({
    data: {
      textEn,
      textGu: 'લગ્નની સિઝન 2026-27 માટે બુકિંગ ચાલુ છે',
      isActive: true,
    },
  });
  console.log('  announce  1');
}

async function seedCatalogue() {
  for (const [i, s] of services.entries()) {
    await db.service.upsert({
      where: { slug: s.slug },
      update: {
        nameEn: s.name.en,
        nameGu: s.name.gu,
        shortEn: s.short.en,
        shortGu: s.short.gu,
        summaryEn: s.summary.en,
        summaryGu: s.summary.gu,
        icon: s.icon,
        order: i,
        featured: s.featured,
        isActive: s.isActive,
      },
      create: {
        slug: s.slug,
        nameEn: s.name.en,
        nameGu: s.name.gu,
        shortEn: s.short.en,
        shortGu: s.short.gu,
        summaryEn: s.summary.en,
        summaryGu: s.summary.gu,
        icon: s.icon,
        order: i,
        featured: s.featured,
        isActive: s.isActive,
      },
    });
  }
  console.log(`  services   ${services.length}`);

  for (const [i, e] of eventTypes.entries()) {
    await db.eventType.upsert({
      where: { slug: e.slug },
      update: {
        nameEn: e.name.en,
        nameGu: e.name.gu,
        blurbEn: e.blurb.en,
        blurbGu: e.blurb.gu,
        icon: e.icon,
        order: i,
        isActive: e.isActive,
      },
      create: {
        slug: e.slug,
        nameEn: e.name.en,
        nameGu: e.name.gu,
        blurbEn: e.blurb.en,
        blurbGu: e.blurb.gu,
        icon: e.icon,
        order: i,
        isActive: e.isActive,
      },
    });
  }
  console.log(`  eventTypes ${eventTypes.length}`);

  for (const [i, a] of areas.entries()) {
    await db.area.upsert({
      where: { slug: a.slug },
      update: {
        nameEn: a.name.en,
        nameGu: a.name.gu,
        order: i,
        primary: a.primary,
        isActive: a.isActive,
      },
      create: {
        slug: a.slug,
        nameEn: a.name.en,
        nameGu: a.name.gu,
        lat: a.lat,
        lng: a.lng,
        order: i,
        primary: a.primary,
        isActive: a.isActive,
      },
    });
  }
  console.log(`  areas      ${areas.length}`);
}

/**
 * Detail-page copy for the services that have it written. Content columns are
 * overwritten on every run so re-seeding picks up edits to the seed files,
 * but the row itself (and anything the client changed in admin outside these
 * columns) is left alone.
 */
async function seedServiceContent() {
  let withContent = 0;

  for (const seed of serviceSeeds) {
    const service = await db.service.findUnique({
      where: { slug: seed.slug },
      select: { id: true },
    });
    if (!service) {
      console.warn(`  ! no service row for ${seed.slug}`);
      continue;
    }

    await db.service.update({
      where: { id: service.id },
      data: {
        contentEn: seed.content.en as unknown as Prisma.InputJsonObject,
        contentGu: seed.content.gu as unknown as Prisma.InputJsonObject,
        inclusions: seed.inclusions as unknown as Prisma.InputJsonArray,
        options: seed.options as unknown as Prisma.InputJsonArray,
        specs: seed.specs as unknown as Prisma.InputJsonArray,
        pricing: { fromInr: null, ...seed.pricing } as unknown as Prisma.InputJsonObject,
      },
    });

    for (const [i, faq] of seed.faqs.entries()) {
      const existing = await db.faq.findFirst({ where: { questionEn: faq.question.en } });
      const data = {
        scope: 'SERVICE' as const,
        questionEn: faq.question.en,
        questionGu: faq.question.gu,
        answerEn: faq.answer.en,
        answerGu: faq.answer.gu,
        order: i,
        serviceId: service.id,
      };
      if (existing) await db.faq.update({ where: { id: existing.id }, data });
      else await db.faq.create({ data });
    }

    withContent++;
  }

  const faqCount = serviceSeeds.reduce((n, s) => n + s.faqs.length, 0);
  console.log(`  content    ${withContent}/${services.length} services, ${faqCount} service FAQs`);
}

/** Local copy for the town pages and the audience landing pages. */
async function seedAreaAndEventContent() {
  for (const seed of areaSeeds) {
    const area = await db.area.findUnique({ where: { slug: seed.slug }, select: { id: true } });
    if (!area) continue;

    await db.area.update({
      where: { id: area.id },
      data: {
        introEn: {
          promise: seed.promise.en,
          paragraphs: seed.paragraphs.en,
          notes: seed.notes.en,
        } as unknown as Prisma.InputJsonObject,
        introGu: {
          promise: seed.promise.gu,
          paragraphs: seed.paragraphs.gu,
          notes: seed.notes.gu,
        } as unknown as Prisma.InputJsonObject,
      },
    });
  }

  for (const seed of eventSeeds) {
    const eventType = await db.eventType.findUnique({
      where: { slug: seed.slug },
      select: { id: true },
    });
    if (!eventType) continue;

    await db.eventType.update({
      where: { id: eventType.id },
      data: {
        introEn: {
          promise: seed.promise.en,
          paragraphs: seed.paragraphs.en,
          needs: seed.needs.en,
        } as unknown as Prisma.InputJsonObject,
        introGu: {
          promise: seed.promise.gu,
          paragraphs: seed.paragraphs.gu,
          needs: seed.needs.gu,
        } as unknown as Prisma.InputJsonObject,
      },
    });
  }

  console.log(`  local      ${areaSeeds.length} areas, ${eventSeeds.length} event types`);
}

async function seedFaqs() {
  for (const [i, f] of faqs.entries()) {
    // FAQs have no natural unique key, so match on the English question.
    const existing = await db.faq.findFirst({ where: { questionEn: f.question.en } });
    const data = {
      scope: f.scope,
      questionEn: f.question.en,
      questionGu: f.question.gu,
      answerEn: f.answer.en,
      answerGu: f.answer.gu,
      order: i,
      serviceId: null,
    };
    if (existing) await db.faq.update({ where: { id: existing.id }, data });
    else await db.faq.create({ data });
  }
  console.log(`  faqs       ${faqs.length}`);
}

async function seedBlog() {
  for (const [i, c] of blogCategories.entries()) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.name.en, nameGu: c.name.gu, order: i },
      create: { slug: c.slug, nameEn: c.name.en, nameGu: c.name.gu, order: i },
    });
  }

  const bodies = new Map(blogBodies.map((b) => [b.slug, b]));
  let published = 0;

  for (const post of blogPosts) {
    const category = await db.category.findUnique({
      where: { slug: post.categorySlug },
      select: { id: true },
    });

    const body = bodies.get(post.slug);
    const docEn = body ? toDoc(body.en) : null;
    const docGu = body ? toDoc(body.gu) : null;

    // A post is only published once it has a body: an empty article page is
    // worse for the site than one fewer article.
    const content = docEn
      ? {
          bodyEn: docEn as unknown as Prisma.InputJsonObject,
          bodyGu: docGu as unknown as Prisma.InputJsonObject,
          readMinutes: readingMinutes(docEn),
          status: 'PUBLISHED' as const,
        }
      : {};

    const shared = {
      titleEn: post.title.en,
      titleGu: post.title.gu,
      excerptEn: post.excerpt.en,
      excerptGu: post.excerpt.gu,
      categoryId: category?.id ?? null,
      ...content,
    };

    const existing = await db.blogPost.findUnique({
      where: { slug: post.slug },
      select: { publishedAt: true },
    });

    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: shared,
      create: { slug: post.slug, ...shared, status: docEn ? 'PUBLISHED' : 'DRAFT' },
    });

    // Set the publish date once and leave it: re-seeding must not make every
    // article look brand new.
    if (docEn && !existing?.publishedAt) {
      await db.blogPost.update({ where: { slug: post.slug }, data: { publishedAt: new Date() } });
    }
    if (docEn) published++;
  }

  console.log(
    `  blog       ${blogCategories.length} categories, ${published}/${blogPosts.length} posts with bodies`,
  );
}

async function seedMedia() {
  for (const item of placeholderMedia) {
    await db.media.upsert({
      where: { publicId: placeholderPublicId(item.n) },
      update: { altEn: item.alt },
      create: {
        publicId: placeholderPublicId(item.n),
        url: placeholderPath(item.n),
        altEn: item.alt,
        width: 1600,
        height: 1067,
        format: 'jpg',
        folder: 'placeholders',
        isPlaceholder: true,
      },
    });
  }
  console.log(`  media      ${placeholderMedia.length} placeholders`);
}

/**
 * The client's own photographs from public/work, registered in the media
 * library so they can be picked as project covers and galleries in the admin.
 * Served from the site itself rather than Cloudinary, so `url` is a path.
 */
async function seedWorkPhotos() {
  const photos = allWorkPhotos('en');
  for (const photo of photos) {
    const data = {
      altEn: photo.alt,
      altGu: workPhoto(photo.slug, 'gu').alt,
      width: photo.width,
      height: photo.height,
      tags: photo.tags,
    };
    await db.media.upsert({
      where: { publicId: `work/${photo.slug}` },
      update: data,
      create: {
        ...data,
        publicId: `work/${photo.slug}`,
        url: photo.src,
        format: 'jpg',
        folder: 'work',
        isPlaceholder: false,
      },
    });
  }
  console.log(`  media      ${photos.length} work photographs`);
}

async function seedProjects() {
  const mediaBySlot = new Map<number, string>();
  for (const item of placeholderMedia) {
    const row = await db.media.findUnique({
      where: { publicId: placeholderPublicId(item.n) },
      select: { id: true },
    });
    if (row) mediaBySlot.set(item.n, row.id);
  }

  for (const [i, p] of sampleProjects.entries()) {
    const [eventType, area] = await Promise.all([
      db.eventType.findUnique({ where: { slug: p.eventTypeSlug }, select: { id: true } }),
      db.area.findUnique({ where: { slug: p.areaSlug }, select: { id: true } }),
    ]);
    const serviceRows = await db.service.findMany({
      where: { slug: { in: p.serviceSlugs } },
      select: { id: true },
    });

    const project = await db.project.upsert({
      where: { slug: p.slug },
      // Content is refreshed on every run so seed edits land, but status is
      // only set on create — a sample the client published stays published.
      update: {
        titleEn: p.title.en,
        titleGu: p.title.gu,
        briefEn: { paragraphs: [p.brief.en] } as unknown as Prisma.InputJsonObject,
        briefGu: { paragraphs: [p.brief.gu] } as unknown as Prisma.InputJsonObject,
        workEn: { did: p.did.en, challenges: [] } as unknown as Prisma.InputJsonObject,
        workGu: { did: p.did.gu, challenges: [] } as unknown as Prisma.InputJsonObject,
        eventTypeId: eventType?.id ?? null,
        areaId: area?.id ?? null,
        services: { set: serviceRows.map((s) => ({ id: s.id })) },
        guests: p.guests,
        days: p.days,
        areaSqft: p.areaSqft,
        venue: p.venue,
        eventDate: new Date(p.eventDate),
        coverId: mediaBySlot.get(p.cover) ?? null,
        order: i,
      },
      create: {
        slug: p.slug,
        titleEn: p.title.en,
        titleGu: p.title.gu,
        briefEn: { paragraphs: [p.brief.en] } as unknown as Prisma.InputJsonObject,
        briefGu: { paragraphs: [p.brief.gu] } as unknown as Prisma.InputJsonObject,
        workEn: { did: p.did.en, challenges: [] } as unknown as Prisma.InputJsonObject,
        workGu: { did: p.did.gu, challenges: [] } as unknown as Prisma.InputJsonObject,
        eventTypeId: eventType?.id ?? null,
        areaId: area?.id ?? null,
        services: { connect: serviceRows.map((s) => ({ id: s.id })) },
        guests: p.guests,
        days: p.days,
        areaSqft: p.areaSqft,
        venue: p.venue,
        eventDate: new Date(p.eventDate),
        coverId: mediaBySlot.get(p.cover) ?? null,
        status: 'DRAFT',
        order: i,
      },
    });

    // Rebuild the gallery links so the seed stays the source of truth for samples.
    await db.projectMedia.deleteMany({ where: { projectId: project.id } });

    const links: { mediaId: string; role: 'GALLERY' | 'BEFORE' | 'AFTER'; order: number }[] = [];
    for (const [order, slot] of p.gallery.entries()) {
      const mediaId = mediaBySlot.get(slot);
      if (mediaId) links.push({ mediaId, role: 'GALLERY', order });
    }
    if (p.beforeAfter) {
      const [before, after] = p.beforeAfter;
      const beforeId = mediaBySlot.get(before);
      const afterId = mediaBySlot.get(after);
      if (beforeId) links.push({ mediaId: beforeId, role: 'BEFORE', order: 0 });
      if (afterId) links.push({ mediaId: afterId, role: 'AFTER', order: 0 });
    }

    for (const link of links) {
      await db.projectMedia.create({ data: { projectId: project.id, ...link } });
    }
  }

  console.log(`  projects   ${sampleProjects.length} samples (DRAFT)`);
}

async function seedPages() {
  for (const page of pages) {
    const row = await db.page.upsert({
      where: { slug: page.slug },
      update: { titleEn: page.title.en, titleGu: page.title.gu, isSystem: page.isSystem },
      create: {
        slug: page.slug,
        titleEn: page.title.en,
        titleGu: page.title.gu,
        isSystem: page.isSystem,
      },
    });

    for (const [i, section] of page.sections.entries()) {
      // Matched on the component alone, not on its order: keying the check on
      // order means inserting a section into this list creates duplicates of
      // everything after it, and re-seeding would undo any reordering the
      // client has done in the page builder.
      const existing = await db.pageSection.findFirst({
        where: { pageId: row.id, component: section.component },
      });
      if (!existing) {
        await db.pageSection.create({
          data: {
            pageId: row.id,
            component: section.component,
            // Section props are validated by each section's zod schema at render
            // time; Prisma just needs the Json input shape here.
            props: (section.props ?? {}) as Prisma.InputJsonObject,
            order: i,
          },
        });
      }
    }
  }
  const sectionCount = pages.reduce((n, p) => n + p.sections.length, 0);
  console.log(`  pages      ${pages.length} pages, ${sectionCount} sections`);
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  if (!email) {
    console.log('  admin      skipped (set SEED_ADMIN_EMAIL to create one)');
    return;
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`  admin      ${email} already exists — password unchanged`);
    return;
  }

  // Never bake a default password into the repo: use the supplied one or mint
  // a random one and print it exactly once.
  const generated = process.env.SEED_ADMIN_PASSWORD ?? randomBytes(12).toString('base64url');
  await db.user.create({
    data: {
      email,
      name: process.env.SEED_ADMIN_NAME ?? 'Administrator',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash(generated, 12),
    },
  });

  console.log(`  admin      created ${email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(
      `\n  ⚠  Generated password (shown once): ${generated}\n     Change it after first login.\n`,
    );
  }
}

async function main() {
  console.log('Seeding shaktimandap…\n');
  await seedSettings();
  await seedAnnouncement();
  await seedCatalogue();
  await seedServiceContent();
  await seedAreaAndEventContent();
  await seedFaqs();
  await seedBlog();
  await seedMedia();
  await seedWorkPhotos();
  await seedProjects();
  await seedPages();
  await seedAdmin();
  console.log('\nDone.');
  console.log(
    '\nNote: unstable_cache entries persist in .next/cache, and a seed changes\n' +
      'the database out of band. Run `rm -rf .next` before rebuilding, or the\n' +
      'build will reuse stale content. Admin edits revalidate properly.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
