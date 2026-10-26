/**
 * Turns each optional feature on through the admin, checks it reaches the
 * public site, and turns it off again:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:features
 *
 * The suite starts and ends with every flag off, which is also the shipped
 * default — so a failure part-way through leaves the site in the state the
 * client would recognise, not half switched on.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const SLUG = 'sample-wedding-mandap-wadhwan';
const PANORAMA = 'https://res.cloudinary.com/demo/image/upload/v1/sample-panorama.jpg';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD.');
  process.exit(1);
}

let failed = 0;
const step = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const raw = async (path) => (await fetch(`${BASE}${path}`, { cache: 'no-store' })).text();
// next-intl serialises the message catalogue into the RSC payload, so a
// translated string is in the HTML whether or not its section rendered.
// Everything asserted on the public site is measured on the markup alone.
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

/** A future date, so the countdown never depends on when the suite is run. */
const soon = new Date(Date.now() + 45 * 86_400_000).toISOString().slice(0, 10);

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

const setFlags = async (on) => {
  await page.goto(`${BASE}/admin/settings/features`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button:has-text("Save features")', { timeout: 20000 });
  for (const key of ['countdown', 'styleExplorer', 'panorama', 'instagram', 'popup']) {
    const box = page.locator(`input[name="flag.${key}"]`);
    if ((await box.isChecked()) !== on) await box.click();
  }
  // A row with a blank date is dropped on save, so clearing the inputs is how
  // the suite leaves no verification dates behind in the client's calendar.
  const dates = page.locator('input[name^="muhurat."]');
  for (let i = 0; i < (await dates.count()); i++) await dates.nth(i).fill('');
  if (on) {
    await page.fill('input[name="muhurat.0.date"]', soon);
    await page.fill('input[name="muhurat.0.labelEn"]', 'Verification muhurat');
    await page.fill('input[name="muhurat.0.labelGu"]', 'ચકાસણી મુહૂર્ત');
  }
  await page.click('button:has-text("Save features")');
  await page.waitForSelector('[data-sonner-toast]', { timeout: 20000 });
};

// ---------------------------------------------------------------- flags off
console.log('\nflags off (the shipped default)');
const homeOff = await markup('/');
step('home has no countdown strip', !homeOff.includes('Next muhurat'));
step('portfolio has no style explorer', !(await markup('/portfolio')).includes('style-explorer'));

// The point of the flags is that their code is not shipped, not merely hidden.
const chunks = [];
const collector = async (res) => {
  if (!res.url().includes('/_next/static/')) return;
  try {
    chunks.push((await res.body()).toString('utf8'));
  } catch {
    /* a chunk served from the browser cache has no body */
  }
};
page.on('response', collector);
await page.goto(`${BASE}/portfolio`, { waitUntil: 'networkidle' });
page.off('response', collector);
const shipped = chunks.join('');
for (const [label, marker] of [
  ['the popup', 'shaktimandap:popup-seen'],
  ['the style explorer', 'stylesWaIntro'],
  ['the 360 viewer', 'pannellum'],
]) {
  step(`${label} is not downloaded while its flag is off`, !shipped.includes(marker));
}

// --- sign in ---
await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
  page.click('button[type="submit"]'),
]);

await page.goto(`${BASE}/admin/settings/features`, { waitUntil: 'domcontentloaded' });
step(
  'the features page offers all five switches',
  (await page.locator('input[name^="flag."]').count()) === 5,
);
// A saved token must never travel back to the browser: the box renders empty
// and a blank box means "leave it alone", so only the fact that one exists
// crosses the wire.
const TOKEN = `IGQV-verify-${Date.now()}`;
await page.fill('input[name="instagramToken"]', TOKEN);
await page.click('button:has-text("Save features")');
await page.waitForSelector('[data-sonner-toast]', { timeout: 20000 });
await page.goto(`${BASE}/admin/settings/features`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('button:has-text("Save features")', { timeout: 20000 });

step(
  'a saved token is not written back into the form',
  (await page.locator('input[name="instagramToken"]').inputValue()) === '',
);
step('a saved token is nowhere in the page source', !(await page.content()).includes(TOKEN));
step('the page says a token is saved', (await page.locator('text=A token is saved').count()) === 1);

await page.check('input[name="clearInstagramToken"]');
await page.click('button:has-text("Save features")');
await page.waitForSelector('[data-sonner-toast]', { timeout: 20000 });
await page.goto(`${BASE}/admin/settings/features`, { waitUntil: 'domcontentloaded' });
step(
  'removing the token is offered and works',
  (await page.locator('text=No token saved yet').count()) === 1,
);

// ----------------------------------------------------------------- flags on
console.log('\nflags on');
await setFlags(true);

step(
  'countdown reaches the home page',
  await waitFor('/', (h) => h.includes('Next muhurat'), 'countdown strip'),
);
const home = await markup('/');
step('countdown names the muhurat', home.includes('Verification muhurat'));
step('countdown counts whole days', /\d+ days away/.test(home));
step('countdown links to the quote form', home.includes('data-cta="quote"'));
step(
  'countdown is translated on the Gujarati home page',
  (await markup('/gu')).includes('ચકાસણી મુહૂર્ત'),
);

step(
  'style explorer reaches the portfolio page',
  await waitFor('/portfolio', (h) => h.includes('style-explorer'), 'explorer section'),
);

step(
  'Instagram section falls back rather than going blank',
  // No token is configured in the test environment, so this exercises exactly
  // the path a client hits when their token quietly expires.
  (await markup('/')).includes('Straight from the site') ||
    !(await markup('/')).includes('From our Instagram'),
);

// --- the style explorer, in the browser ---
await page.goto(`${BASE}/portfolio`, { waitUntil: 'domcontentloaded' });
const keep = page.locator('#style-explorer button:has-text("Keep")');
await keep.waitFor({ timeout: 20000 });
const firstStyle = await page.locator('#style-explorer h3').first().innerText();
await keep.click();
step(
  'keeping a style adds it to the shortlist',
  await page
    .locator('#style-explorer aside li', { hasText: firstStyle })
    .waitFor({ timeout: 10000 })
    .then(() => true)
    .catch(() => false),
);
step(
  'the shortlist is held in the URL so it can be shared',
  new URL(page.url()).searchParams.get('styles') !== null,
);
const shared = page.url();
await page.goto(`${BASE}/portfolio`, { waitUntil: 'domcontentloaded' });
await page.goto(shared, { waitUntil: 'domcontentloaded' });
step(
  'opening a shared shortlist restores it',
  await page
    .locator('#style-explorer aside li', { hasText: firstStyle })
    .waitFor({ timeout: 15000 })
    .then(() => true)
    .catch(() => false),
);

// --- the popup ---
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
const popup = page.locator('[role="dialog"][aria-labelledby="popup-title"]');
step(
  'the popup appears after its delay',
  await popup
    .waitFor({ timeout: 20000 })
    .then(() => true)
    .catch(() => false),
);
await page.locator('[aria-labelledby="popup-title"] button[aria-label="Not now"]').click();
step('dismissing the popup hides it', (await popup.count()) === 0);
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(10_000);
step('the popup does not come back in the same session', (await popup.count()) === 0);

const quote = await browser.newPage();
await quote.goto(`${BASE}/get-quote`, { waitUntil: 'domcontentloaded' });
await quote.waitForTimeout(10_000);
step(
  'the popup never interrupts the quote form',
  (await quote.locator('[aria-labelledby="popup-title"]').count()) === 0,
);
await quote.close();

// --- the 360 viewer, on a published project that has a panorama ---
await page.goto(`${BASE}/admin/projects`, { waitUntil: 'domcontentloaded' });
await Promise.all([
  page.waitForURL(/\/admin\/projects\/[a-z0-9]+$/, { timeout: 20000 }),
  page.click('a[href^="/admin/projects/"]:has-text("Sample — wedding mandap")'),
]);
await page.waitForSelector('button:has-text("Save project")', { timeout: 20000 });
await page.fill('input[name="panoramaUrl"]', PANORAMA);
await page.selectOption('select[name="status"]', 'PUBLISHED');
await page.click('button:has-text("Save project")');
await page.waitForSelector('[data-sonner-toast]', { timeout: 20000 });

step(
  'the 360 section appears on a project that has a panorama',
  await waitFor(`/portfolio/${SLUG}`, (h) => h.includes('Look around'), '360 section'),
);
await page.goto(`${BASE}/portfolio/${SLUG}`, { waitUntil: 'domcontentloaded' });
step(
  'the viewer mounts a canvas',
  await page
    .waitForSelector('.pnlm-container', { timeout: 25000 })
    .then(() => true)
    .catch(() => false),
);

// ------------------------------------------------------------ back to draft
await page.goto(`${BASE}/admin/projects`, { waitUntil: 'domcontentloaded' });
await Promise.all([
  page.waitForURL(/\/admin\/projects\/[a-z0-9]+$/, { timeout: 20000 }),
  page.click('a[href^="/admin/projects/"]:has-text("Sample — wedding mandap")'),
]);
await page.waitForSelector('button:has-text("Save project")', { timeout: 20000 });
await page.fill('input[name="panoramaUrl"]', '');
await page.selectOption('select[name="status"]', 'DRAFT');
await page.click('button:has-text("Save project")');
await page.waitForSelector('[data-sonner-toast]', { timeout: 20000 });

// ---------------------------------------------------------- flags off again
console.log('\nflags off again');
await setFlags(false);
step(
  'switching the countdown off removes it',
  await waitFor('/', (h) => !h.includes('Next muhurat'), 'countdown gone'),
);
step(
  'switching the explorer off removes it',
  await waitFor('/portfolio', (h) => !h.includes('style-explorer'), 'explorer gone'),
);
step(
  'the sample project is back to draft',
  await waitFor('/portfolio', (h) => !h.includes('Sample — wedding mandap'), 'card gone'),
);
await page.goto(`${BASE}/admin/settings/features`, { waitUntil: 'domcontentloaded' });
step(
  'no verification dates are left in the calendar',
  (await page.locator('input[name^="muhurat."][value]:not([value=""])').count()) === 0 &&
    !(await page.content()).includes('Verification muhurat'),
);

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
