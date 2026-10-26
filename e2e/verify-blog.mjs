/**
 * Blog pages and the Tiptap editor round trip:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:blog
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const SLUG = 'german-hanger-vs-traditional-pandal';
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

// --- hub ---
const hub = await markup('/blog');
step('hub lists all eight guides', (hub.match(/href="\/blog\/[a-z0-9-]+"/g) ?? []).length >= 8);
step('hub shows category filters', hub.includes('Costs & budgets') || hub.includes('Planning'));
step('hub shows reading times', /\d+ min read/.test(hub));

const filtered = await raw('/blog?category=planning');
step('a category view is noindex', filtered.includes('noindex'));
step(
  'the category view canonicalises to /blog',
  /rel="canonical" href="[^"]*\/blog"/.test(filtered),
);

// --- post ---
const post = await markup(`/blog/${SLUG}`);
step('post has exactly one h1', (post.match(/<h1/g) ?? []).length === 1);
step(
  'post renders body headings as h2',
  post.includes('<h2') && post.includes('What a German hanger is'),
);
step('post renders lists', post.includes('<ul') || post.includes('<ol'));
step('post renders the blockquote', post.includes('<blockquote'));
step('post shows a table of contents', post.includes('In this guide'));

// The TOC only works if its hrefs match the ids the renderer emitted.
// #main is the skip link at the top of every page, not a contents entry.
const tocLinks = (html) =>
  [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]).filter((id) => id !== 'main');

const ids = [...post.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]);
const hrefs = tocLinks(post);
step(
  'every table-of-contents link points at a heading that exists',
  hrefs.length > 0 && hrefs.every((href) => ids.includes(href)),
  `${hrefs.length} links, ${ids.length} headings`,
);

const postRaw = await raw(`/blog/${SLUG}`);
const types = [...postRaw.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
  (m) => JSON.parse(m[1])['@type'],
);
step(
  'post emits Article and BreadcrumbList',
  ['Article', 'BreadcrumbList'].every((t) => types.includes(t)),
  types.join(','),
);

// --- gujarati ---
const gu = await markup(`/gu/blog/${SLUG}`);
step('gujarati post is in gujarati', gu.includes('જર્મન હેંગર'));
step('gujarati post has no english section headings', !gu.includes('What a German hanger is'));
const guIds = [...gu.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]);
const guHrefs = tocLinks(gu);
step(
  'gujarati heading anchors survive their vowel signs',
  guHrefs.length > 0 && guHrefs.every((href) => guIds.includes(href)),
  guIds[0] ?? 'none',
);

// --- admin editor ---
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

await page.goto(`${BASE}/admin/blog`, { waitUntil: 'domcontentloaded' });
step('blog admin lists the posts', (await page.locator('a[href^="/admin/blog/"]').count()) >= 8);

await Promise.all([
  page.waitForURL(/\/admin\/blog\/[a-z0-9]+$/, { timeout: 20000 }),
  page.click('a[href^="/admin/blog/"]:has-text("German hanger")'),
]);
await page.waitForSelector('button:has-text("Save post")', { timeout: 20000 });
step('editor loads the article into Tiptap', (await page.locator('.prose-editor h2').count()) >= 3);

const MARKER = 'Verified by the smoke test.';
const body = page.locator('.prose-editor').first();
await body.click();
await page.keyboard.press('Control+End');
await page.keyboard.press('Enter');
await page.keyboard.type(MARKER);
await page.click('button:has-text("Save post")');
await page.waitForSelector('text=Post saved.', { timeout: 20000 });
step(
  'an edit in the editor reaches the published article',
  await waitFor(`/blog/${SLUG}`, (h) => h.includes(MARKER), 'marker on the page'),
);

// --- validation ---
await page.goto(`${BASE}/admin/blog/new`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('button:has-text("Save post")');
await page.fill('input[name="slug"]', 'verification-empty-post');
await page.fill('input[name="titleEn"]', 'Verification empty post');
await page.fill('input[name="titleGu"]', 'ચકાસણી ખાલી પોસ્ટ');
await page.selectOption('select[name="status"]', 'PUBLISHED');
await page.click('button:has-text("Save post")');
step(
  'publishing an empty article is refused',
  Boolean(
    await page
      .waitForSelector('text=Write the article before publishing', { timeout: 20000 })
      .catch(() => null),
  ),
);

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
