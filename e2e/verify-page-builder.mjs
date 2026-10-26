/**
 * Verifies the page builder end to end against a built server:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:builder
 *
 * The point of this check is the round trip: an edit in /admin/sections must
 * reach the public, ISR-cached home page via revalidateTag('sections').
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

/**
 * next-intl serialises the entire message catalogue into the RSC payload, so
 * every translated string is present in the raw HTML whether or not the
 * section that uses it rendered. Strip the scripts and assert only against
 * real markup.
 */
const home = async () => {
  const res = await fetch(BASE, { cache: 'no-store' });
  const html = await res.text();
  return html.replace(/<script[\s\S]*?<\/script>/g, '');
};

/**
 * ISR regeneration is asynchronous, so a single fetch straight after an edit
 * can still be served the previous render. Poll until the page catches up.
 */
const waitForHome = async (predicate, label, timeoutMs = 15000) => {
  const deadline = Date.now() + timeoutMs;
  let html = '';
  while (Date.now() < deadline) {
    html = await home();
    if (predicate(html)) return { ok: true, html };
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log(`        (timed out waiting for: ${label})`);
  return { ok: false, html };
};

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

await page.goto(`${BASE}/admin/sections`, { waitUntil: 'domcontentloaded' });
await page.click('a:has-text("Home")');
await page.waitForSelector('h1:has-text("Home")');
step('home page lists its sections', (await page.locator('li:has(h3)').count()) === 6);

// --- hide the services grid, then confirm the public page drops it ---
const servicesCard = page.locator('li:has(h3:text-is("Services grid"))');
await servicesCard.locator('button[title="Hide on the site"]').click();
await page.waitForSelector('li:has(h3:text-is("Services grid")) span:text-is("Hidden")', {
  timeout: 15000,
});
step(
  'hiding a section removes it from the live page',
  (await waitForHome((h) => !h.includes('theme-light'), 'services grid gone')).ok,
);

await servicesCard.locator('button[title="Show on the site"]').click();
await page.waitForSelector('li:has(h3:text-is("Services grid")) button[title="Hide on the site"]', {
  timeout: 15000,
});
step(
  'showing it again brings it back',
  (await waitForHome((h) => h.includes('theme-light'), 'services grid back')).ok,
);

// --- edit a prop and confirm it reaches the rendered HTML ---
const marqueeCard = page.locator('li:has(h3:text-is("Event marquee"))');
await marqueeCard.locator('input[name="props.speedSeconds"]').fill('30');
await marqueeCard.locator('button:has-text("Save")').click();
await page.waitForSelector('text=Section updated.', { timeout: 15000 });
step(
  'prop edit reaches the live page',
  (await waitForHome((h) => h.includes('animation-duration:30s'), 'marquee at 30s')).ok,
);

// --- prop validation: the schema's max reaches the input, so the browser
//     blocks the submit before the action is ever called ---
const speedInput = marqueeCard.locator('input[name="props.speedSeconds"]');
await speedInput.fill('900');
await marqueeCard.locator('button:has-text("Save")').click();
step(
  'out-of-range prop is blocked by the generated input',
  await speedInput.evaluate((el) => !el.checkValidity() && el.validity.rangeOverflow),
);

await marqueeCard.locator('input[name="props.speedSeconds"]').fill('48');
await marqueeCard.locator('button:has-text("Save")').click();
await page.waitForSelector('text=Section updated.', { timeout: 15000 });

// --- reorder, and confirm the public page follows ---
// Compare rendered-markup markers: the hero's wrapper class against the
// marquee's animation class.
const HERO = 'hero-under-header';
const MARQUEE = 'animate-marquee';
const before = await home();
const heroFirst = before.indexOf(HERO) < before.indexOf(MARQUEE);
await page.locator('li:has(h3:text-is("Event marquee")) button[title="Move up"]').click();
await page.waitForSelector('li:nth-child(1):has(h3:text-is("Event marquee"))', { timeout: 15000 });
step(
  'reordering swaps the sections on the live page',
  heroFirst &&
    (await waitForHome((h) => h.indexOf(MARQUEE) < h.indexOf(HERO), 'marquee above hero')).ok,
);

await page.locator('li:has(h3:text-is("Event marquee")) button[title="Move down"]').click();
await page.waitForSelector('li:nth-child(1):has(h3:text-is("Hero"))', { timeout: 15000 });
step(
  'order restored',
  (await waitForHome((h) => h.indexOf(HERO) < h.indexOf(MARQUEE), 'hero back on top')).ok,
);

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser page errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
