/**
 * Publishes a sample project through the admin, checks it all the way out to
 * the public portfolio, then puts it back to draft:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:portfolio
 *
 * Sample projects ship as DRAFT so nothing invented reaches the live site;
 * this is what exercises the published path.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const SLUG = 'sample-wedding-mandap-wadhwan';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

let failed = 0;
const step = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const raw = async (path) => (await fetch(`${BASE}${path}`, { cache: 'no-store' })).text();
const markup = async (path) => (await raw(path)).replace(/<script[\s\S]*?<\/script>/g, '');

const waitFor = async (path, predicate, label, timeoutMs = 25000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate(await markup(path))) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`        (timed out waiting for: ${label})`);
  return false;
};

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

// --- sign in ---
await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
  page.click('button[type="submit"]'),
]);

await page.goto(`${BASE}/admin/projects`, { waitUntil: 'domcontentloaded' });
step('admin lists the sample projects', (await page.locator('li:has(form)').count()) >= 6);

// --- the editor loads everything ---
await page.goto(`${BASE}/admin/projects`, { waitUntil: 'domcontentloaded' });
await Promise.all([
  // The list page has its own <h1>, so waiting on that races the navigation.
  page.waitForURL(/\/admin\/projects\/[a-z0-9]+$/, { timeout: 20000 }),
  page.click('a[href^="/admin/projects/"]:has-text("Sample — wedding mandap")'),
]);
// coverId is a hidden input, so wait on something visible instead.
await page.waitForSelector('button:has-text("Save project")', { timeout: 20000 });
step(
  'editor loads the media picker',
  (await page.locator('input[name="galleryIds"]').count()) >= 3,
);
step(
  'editor preselects the services',
  (await page.locator('input[name="serviceIds"]:checked').count()) >= 3,
);
step(
  'editor loads the repeatable copy rows',
  (await page.locator('textarea[name^="briefEn."]').count()) >= 1,
);

// --- publish ---
await page.goto(`${BASE}/admin/projects`, { waitUntil: 'domcontentloaded' });
const row = page.locator('li', { has: page.locator('a:has-text("Sample — wedding mandap")') });
await row.locator('button[title="Publish"]').click();
await page.waitForSelector(
  'li:has(a:has-text("Sample — wedding mandap")) button[title="Unpublish"]',
  {
    timeout: 20000,
  },
);
step(
  'publishing puts it on the portfolio hub',
  await waitFor('/portfolio', (h) => h.includes('Sample — wedding mandap'), 'card on hub'),
);

// --- the detail page ---
const detail = await markup(`/portfolio/${SLUG}`);
for (const [label, needle] of [
  ['the event', 'The event'],
  ['scale strip', 'Days on site'],
  ['what we did', 'What we did'],
  ['before / after', 'Before and after'],
  ['gallery', 'Photographs'],
  ['services used', 'Services on this job'],
  ['placeholder notice', 'These are placeholder images'],
]) {
  step(`detail page renders ${label}`, detail.includes(needle));
}
step('detail page has exactly one h1', (detail.match(/<h1/g) ?? []).length === 1);

const detailRaw = await raw(`/portfolio/${SLUG}`);
const types = [...detailRaw.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
  (m) => JSON.parse(m[1])['@type'],
);
step(
  'detail page emits Event, ImageGallery and BreadcrumbList',
  ['Event', 'ImageGallery', 'BreadcrumbList'].every((t) => types.includes(t)),
  types.join(','),
);

// --- filters ---
step(
  'matching filter shows it',
  (await markup('/portfolio?eventType=weddings')).includes('Sample — wedding mandap'),
);
step(
  'non-matching filter hides it',
  !(await markup('/portfolio?eventType=navratri-garba')).includes('Sample — wedding mandap'),
);
step(
  'service page gallery picks it up',
  (await markup('/services/wedding-mandap-decoration-surendranagar')).includes(
    'Sample — wedding mandap',
  ),
);

// --- interactive pieces ---
// networkidle never settles here: Next keeps prefetching linked routes.
await page.goto(`${BASE}/portfolio/${SLUG}`, { waitUntil: 'domcontentloaded' });

const slider = page.locator('figure', { has: page.locator('text=Before') }).first();
await slider.waitFor({ timeout: 15000 });
step('before/after slider shows both images', (await slider.locator('img').count()) >= 2);

const thumbs = page.locator('ul li button:has(img)');
await thumbs.first().waitFor({ timeout: 15000 });
await thumbs.first().click();
step(
  'lightbox opens on a gallery thumbnail',
  Boolean(await page.waitForSelector('.yarl__container', { timeout: 15000 }).catch(() => null)),
);
await page.keyboard.press('Escape');

// --- put it back to draft ---
await page.goto(`${BASE}/admin/projects`, { waitUntil: 'domcontentloaded' });
await page
  .locator('li', { has: page.locator('a:has-text("Sample — wedding mandap")') })
  .locator('button[title="Unpublish"]')
  .click();
await page.waitForSelector(
  'li:has(a:has-text("Sample — wedding mandap")) button[title="Publish"]',
  {
    timeout: 20000,
  },
);
step(
  'unpublishing takes it off the hub again',
  await waitFor('/portfolio', (h) => !h.includes('Sample — wedding mandap'), 'card gone from hub'),
);

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
