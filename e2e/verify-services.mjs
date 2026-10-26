/**
 * Round-trips a service edit through the admin and out to the public page:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:services
 *
 * Assertions strip <script> blocks first — next-intl serialises the whole
 * message catalogue into the RSC payload, so translated strings appear in the
 * raw HTML whether or not the block that uses them rendered.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const SLUG = 'themed-decoration-surendranagar';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

let failed = 0;
const step = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const fetchPage = async (path) => {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  return (await res.text()).replace(/<script[\s\S]*?<\/script>/g, '');
};

const waitFor = async (path, predicate, label, timeoutMs = 20000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate(await fetchPage(path))) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log(`        (timed out waiting for: ${label})`);
  return false;
};

// --- public pages render before we touch anything ---
const hub = await fetchPage('/services');
step('hub lists all 14 services', (hub.match(/\/services\/[a-z-]+"/g) ?? []).length >= 14);

const detail = await fetchPage(`/services/${SLUG}`);
for (const [label, needle] of [
  ['included block', 'What’s included'],
  ['options block', 'Options'],
  ['specs table', 'Sizes and specifications'],
  ['pricing block', 'What it costs'],
  ['process block', 'How it runs'],
  ['related block', 'Often booked'],
  ['faq block', 'Common questions'],
]) {
  step(`detail page renders the ${label}`, detail.includes(needle));
}
step('detail page has exactly one h1', (detail.match(/<h1/g) ?? []).length === 1);

const gu = await fetchPage(`/gu/services/${SLUG}`);
step('gujarati page heads with the localised city', gu.includes('સુરેન્દ્રનગરમાં'));
step('gujarati page carries no English section headings', !gu.includes('Sizes and specifications'));

// --- edit through the admin and check it reaches the page ---
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
  page.click('button[type="submit"]'),
]);

await page.goto(`${BASE}/admin/services/${SLUG}`, { waitUntil: 'networkidle' });
step('editor loads the existing copy', (await page.inputValue('input[name="nameEn"]')).length > 0);
step(
  'repeatable lists are populated',
  (await page.locator('input[name^="inclusions."]').count()) >= 4,
);

const MARKER = 'Verified by the smoke test';
const original = await page.inputValue('textarea[name="summaryEn"]');
await page.fill('textarea[name="summaryEn"]', `${MARKER} — themed decoration for your venue.`);
await page.click('button:has-text("Save service")');
await page.waitForSelector('text=Service saved.', { timeout: 20000 });
step(
  'a summary edit reaches the public hub',
  await waitFor('/services', (h) => h.includes(MARKER), 'marker on hub'),
);

// --- validation rejects copy that is too short ---
await page.fill('textarea[name="summaryEn"]', 'too short');
await page.click('button:has-text("Save service")');
step(
  'too-short summary is rejected',
  Boolean(
    await page
      .waitForSelector('[data-sonner-toast][data-type="error"]', { timeout: 20000 })
      .catch(() => null),
  ),
);

// --- restore ---
await page.fill('textarea[name="summaryEn"]', original);
await page.click('button:has-text("Save service")');
await page.waitForSelector('text=Service saved.', { timeout: 20000 });
step(
  'original copy restored',
  await waitFor('/services', (h) => !h.includes(MARKER), 'marker gone from hub'),
);

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser page errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
