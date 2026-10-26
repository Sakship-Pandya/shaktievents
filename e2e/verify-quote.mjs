/**
 * The conversion path, end to end:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:quote
 *
 * Covers both estimator states — no rules configured (the launch default,
 * where no figure may be shown) and rules configured (where a range appears) —
 * and checks the enquiry lands in the admin pipeline either way.
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

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

/** Walks the four steps and submits. Returns the summary card locator. */
async function runWizard(name, phone) {
  await page.goto(`${BASE}/get-quote`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button:has-text("Weddings")');
  await page.click('button:has-text("Weddings")'); // step 1 auto-advances
  await page.waitForSelector('#guest-slider');
  await page.fill('#event-date', '2026-12-05');
  await page.click('button:has-text("Next")');
  await page.waitForSelector('button:has-text("Wedding mandap")');
  await page.click('button:has-text("Wedding mandap")');
  await page.click('button:has-text("Sound & PA")');
  await page.click('button:has-text("Next")');
  await page.waitForSelector('#q-name');
  await page.fill('#q-name', name);
  await page.fill('#q-phone', phone);
  await page.click('button:has-text("Get my quote")');
  await page.waitForSelector('text=Reference', { timeout: 25000 });
}

/** Blanks every base price and unchecks every peak month. */
async function clearEstimatorRules() {
  await page.goto(`${BASE}/admin/settings/estimator`, { waitUntil: 'domcontentloaded' });
  for (const input of await page.locator('input[name^="base."]').all()) await input.fill('');
  for (const box of await page.locator('input[name="peakMonths"]').all()) await box.uncheck();
  await page.click('button:has-text("Save rules")');
  await page.waitForSelector('text=will not show a figure', { timeout: 20000 });
}

// --- sign in first; the estimator has to be reset before anything is asserted ---
await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
  page.click('button[type="submit"]'),
]);
await clearEstimatorRules();

// --- 1. no estimator rules: the wizard must not invent a number ---
await runWizard('Quote Test One', '9876500001');
const noRules = await page.locator('body').innerText();
step('wizard completes and shows a reference', noRules.includes('Reference'));
step(
  'with no rules configured, no figure is shown',
  noRules.includes('quote after a site visit') && !/₹\s?\d/.test(noRules),
);

// --- the lagan-season warning comes from the configured peak months ---
// Scoped to the form: the announcement bar also says "Lagan Season".
const seasonWarning = () => page.locator('form').getByText('That date falls in lagan season');

await page.goto(`${BASE}/get-quote`, { waitUntil: 'domcontentloaded' });
await page.click('button:has-text("Weddings")');
await page.waitForSelector('#event-date');
await page.fill('#event-date', '2026-12-05');
step('no season warning before peak months are configured', (await seasonWarning().count()) === 0);

// --- 2. configure the estimator through the admin ---
await page.goto(`${BASE}/admin/settings/estimator`, { waitUntil: 'domcontentloaded' });
await page.fill('input[name="base.wedding-mandap-decoration-surendranagar"]', '40000');
await page.fill('input[name="base.sound-system-pa-service-surendranagar"]', '25000');
await page.fill('input[name="bands.0.upTo"]', '1000');
await page.fill('input[name="bands.0.multiplier"]', '1');
await page.check('input[name="peakMonths"][value="12"]');
await page.fill('input[name="peakMultiplier"]', '1.25');
await page.click('button:has-text("Save rules")');
await page.waitForSelector('text=Estimator rules saved.', { timeout: 20000 });
step('estimator rules save', true);

// --- 3. with rules, the warning and a range appear ---
await page.goto(`${BASE}/get-quote`, { waitUntil: 'domcontentloaded' });
await page.click('button:has-text("Weddings")');
await page.waitForSelector('#event-date');
await page.fill('#event-date', '2026-12-05');
await seasonWarning().first().waitFor({ timeout: 15000 });
step('season warning appears once December is a peak month', true);

await runWizard('Quote Test Two', '9876500002');
const withRules = await page.locator('body').innerText();
step('a range is shown once rules exist', /₹[\d,]+\s*–\s*₹[\d,]+/.test(withRules));
step('the range is labelled an estimate, not a quote', withRules.includes('not a quote'));
step('lagan season pricing is disclosed', withRules.includes('Lagan season pricing'));

// --- 4. the enquiries land in the pipeline ---
await page.goto(`${BASE}/admin/enquiries`, { waitUntil: 'domcontentloaded' });
const board = await page.locator('body').innerText();
step(
  'both enquiries reached the admin',
  board.includes('Quote Test One') && board.includes('Quote Test Two'),
);

await page.click('a:has-text("Quote Test Two")');
await page.waitForSelector('h1:has-text("Quote Test Two")');
step(
  'detail shows the estimate that was displayed',
  (await page.locator('body').innerText()).includes('₹'),
);
step(
  'detail lists the services asked for',
  (await page.locator('body').innerText()).includes('wedding-mandap'),
);

await page.click('button:has-text("Contacted")');
await page.waitForSelector('button[aria-current="true"]:has-text("Contacted")', { timeout: 20000 });
step('status can be moved along', true);

await page.fill('textarea[name="body"]', 'Called back, site visit on Thursday.');
await page.click('button:has-text("Add note")');
await page.waitForSelector('text=Called back, site visit on Thursday.', { timeout: 20000 });
step('a note can be added', true);

// --- 5. duplicate detection ---
await runWizard('Quote Test Two Again', '9876500002');
await page.goto(`${BASE}/admin/enquiries`, { waitUntil: 'domcontentloaded' });
const after = await page.locator('body').innerText();
step(
  'a repeat from the same number updates rather than duplicating',
  after.includes('Quote Test Two Again') && !after.includes('Quote Test Two\n'),
);

// --- 6. validation ---
await page.goto(`${BASE}/get-quote`, { waitUntil: 'domcontentloaded' });
await page.click('button:has-text("Weddings")');
await page.click('button:has-text("Next")');
await page.click('button:has-text("Next")');
await page.fill('#q-name', 'Bad Phone');
await page.fill('#q-phone', '12345');
await page.click('button:has-text("Get my quote")');
step(
  'an invalid phone number is rejected',
  Boolean(
    await page.waitForSelector('text=10-digit mobile number', { timeout: 20000 }).catch(() => null),
  ),
);

// --- 7. CSV export ---
const csv = await context.request.get(`${BASE}/api/admin/enquiries/export`);
const body = await csv.text();
step('CSV export returns the enquiries', csv.ok() && body.includes('Quote Test One'));

const anon = await browser.newContext();
const anonCsv = await anon.request.get(`${BASE}/api/admin/enquiries/export`);
step('CSV export refuses anonymous requests', anonCsv.status() === 401);
await anon.close();

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
