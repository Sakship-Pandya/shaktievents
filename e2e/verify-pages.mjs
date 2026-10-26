/**
 * The step-7 public pages and their admin editors:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:pages
 *
 * Assertions strip <script> blocks first — next-intl serialises the whole
 * message catalogue into the RSC payload, so a translated string appears in
 * the HTML whether or not the block that uses it rendered.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

let failed = 0;
const step = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const markup = async (path) => {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  return { status: res.status, html: (await res.text()).replace(/<script[\s\S]*?<\/script>/g, '') };
};

const waitFor = async (path, predicate, label, timeoutMs = 25000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate((await markup(path)).html)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`        (timed out waiting for: ${label})`);
  return false;
};

// --- every public route resolves, in both locales ---
const ROUTES = [
  '/about',
  '/areas',
  '/areas/wadhwan',
  '/events',
  '/events/weddings',
  '/packages',
  '/testimonials',
  '/faq',
  '/videos',
  '/contact',
  '/get-quote',
  '/services',
  '/portfolio',
];

let allOk = true;
for (const route of ROUTES) {
  for (const prefix of ['', '/gu']) {
    const { status, html } = await markup(`${prefix}${route}`);
    const oneH1 = (html.match(/<h1/g) ?? []).length === 1;
    if (status !== 200 || !oneH1) {
      allOk = false;
      console.log(`        ${prefix}${route} → ${status}, ${(html.match(/<h1/g) ?? []).length} h1`);
    }
  }
}
step(`all ${ROUTES.length} routes return 200 with one h1 in both locales`, allOk);

// --- content actually rendered, not just a shell ---
const area = (await markup('/areas/chotila')).html;
step('town page carries its own local copy', area.includes('Chamunda Mata'));
step('town page shows the venue empty state', area.includes('Venue list to follow'));

const areaGu = (await markup('/gu/areas/chotila')).html;
step('gujarati town page is in gujarati', areaGu.includes('ચામુંડા'));
step('gujarati town page has no english headings', !areaGu.includes('Working here'));

const event = (await markup('/events/religious-katha')).html;
step('event page lists what the function needs', event.includes('Shade over everyone'));

const packages = (await markup('/packages')).html;
step(
  'packages page shows all four tiers',
  ['Shubh', 'Shakti', 'Rajwadi', 'Custom'].every((n) => packages.includes(n)),
);
step('packages show no invented price', packages.includes('Priced after a site visit'));
step('comparison table renders', packages.includes('Compare'));

const faq = (await markup('/faq')).html;
step('faq page groups questions', faq.includes('General'));
const faqRaw = await (await fetch(`${BASE}/faq`, { cache: 'no-store' })).text();
step('faq page emits FAQPage schema', faqRaw.includes('"@type":"FAQPage"'));

const testimonials = (await markup('/testimonials')).html;
step(
  'testimonials show an honest empty state',
  testimonials.includes('Reviews are being collected'),
);
step(
  'no aggregateRating is invented',
  !faqRaw.includes('aggregateRating') && !testimonials.includes('aggregateRating'),
);

const videos = (await markup('/videos')).html;
step('videos page shows an empty state', videos.includes('Videos are being added'));

const about = (await markup('/about')).html;
step('about page marks the founder story as pending', about.includes('waiting on the founder'));
step('about page hides the stats row while unset', !about.includes('Events completed'));

// --- admin editors ---
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
  page.click('button[type="submit"]'),
]);

for (const [label, path, heading] of [
  ['areas', '/admin/areas', 'Areas'],
  ['event types', '/admin/event-types', 'Event types'],
  ['packages', '/admin/packages', 'Packages'],
  ['testimonials', '/admin/testimonials', 'Testimonials'],
  ['FAQs', '/admin/faqs', 'FAQs'],
  ['videos', '/admin/videos', 'Videos'],
  ['trusted by', '/admin/clients', 'Trusted by'],
]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
  step(`${label} admin renders`, await page.locator(`h1:has-text("${heading}")`).isVisible());
}

// --- a real edit reaches the public page ---
await page.goto(`${BASE}/admin/areas/chuda`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('button:has-text("Save town")');
step(
  'town editor loads its copy',
  (await page.locator('textarea[name^="paragraphsEn."]').count()) >= 2,
);

await page.fill('input[name="venues.0.nameEn"]', 'Community Hall');
await page.fill('input[name="venues.0.nameGu"]', 'સમાજ વાડી');
await page.click('button:has-text("Save town")');
await page.waitForSelector('text=Town saved.', { timeout: 20000 });
step(
  'a venue added in the admin reaches the town page',
  await waitFor('/areas/chuda', (h) => h.includes('Community Hall'), 'venue on page'),
);

// --- a published review reaches the testimonials page ---
await page.goto(`${BASE}/admin/testimonials`, { waitUntil: 'domcontentloaded' });
await page.fill('form:has-text("Add a review") input[name="authorName"]', 'Verification Family');
await page.fill(
  'form:has-text("Add a review") textarea[name="quoteEn"]',
  'They set up the mandap exactly as agreed and stayed through the vidhi.',
);
await page.selectOption('form:has-text("Add a review") select[name="status"]', 'PUBLISHED');
await page.click('form:has-text("Add a review") button:has-text("Add")');
await page.waitForSelector('text=Review added.', { timeout: 20000 });
step(
  'a published review reaches the testimonials page',
  await waitFor('/testimonials', (h) => h.includes('Verification Family'), 'review on page'),
);

// --- and is removed again, so the suite leaves no invented review behind ---
page.on('dialog', (d) => d.accept());
await page.goto(`${BASE}/admin/testimonials`, { waitUntil: 'domcontentloaded' });
for (const card of await page
  .locator('li:has(input[value="Verification Family"]) button[aria-label="Delete"]')
  .all()) {
  await card.click();
  await page.waitForTimeout(500);
}
step(
  'the verification review is removed from the public page again',
  await waitFor('/testimonials', (h) => !h.includes('Verification Family'), 'review gone'),
);

// --- validation: a published review must say something ---
await page.reload({ waitUntil: 'domcontentloaded' });
await page.fill('form:has-text("Add a review") input[name="authorName"]', 'Empty Review');
await page.selectOption('form:has-text("Add a review") select[name="status"]', 'PUBLISHED');
await page.click('form:has-text("Add a review") button:has-text("Add")');
step(
  'an empty published review is rejected',
  Boolean(
    await page.waitForSelector('text=Add the review text', { timeout: 20000 }).catch(() => null),
  ),
);

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
