/**
 * Ad-hoc smoke check for the admin panel, run against a built server:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:admin
 *
 * Step 11 replaces this with a proper Playwright suite; until then it is the
 * fastest way to confirm the auth gate, the settings write path and sign-out
 * still work after a change.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

let failed = 0;
const step = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

await page.goto(`${BASE}/admin/settings`, { waitUntil: 'domcontentloaded' });
step('anonymous /admin/settings redirects to login', page.url().includes('/admin/login'));

await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
  page.click('button[type="submit"]'),
]);
step('login lands inside the admin', page.url().includes('/admin'), page.url());

await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });

// Everything this suite types is invented, and the project's whole rule is
// that no invented business fact survives anywhere. Remember what was there
// so it can all go back at the end.
const SETTINGS_FIELDS = [
  'ownerName',
  'establishedYear',
  'phonePrimary',
  'whatsappNumber',
  'eventsCompleted',
];
const before = {};
for (const field of SETTINGS_FIELDS) {
  before[field] = await page.locator(`input[name="${field}"]`).inputValue();
}
before.enquiryToEmails = await page.locator('textarea[name="enquiryToEmails"]').inputValue();

// saveSettings answers "No changes to save." when nothing differs, so the
// value has to be new on every run for this to test the save path.
await page.fill('input[name="ownerName"]', `Test Owner ${Date.now()}`);
await page.fill('input[name="establishedYear"]', '1998');
await page.fill('input[name="phonePrimary"]', '98765 43210');
await page.fill('input[name="whatsappNumber"]', '9876543210');
await page.fill('input[name="eventsCompleted"]', '1200');
await page.fill('textarea[name="enquiryToEmails"]', 'a@example.com, b@example.com');
await page.click('button[type="submit"]:has-text("Save settings")');
step(
  'settings save shows success toast',
  Boolean(await page.waitForSelector('text=Settings saved.', { timeout: 15000 }).catch(() => null)),
);

await page.fill('input[name="phonePrimary"]', '123');
await page.click('button[type="submit"]:has-text("Save settings")');
step(
  'invalid phone rejected inline',
  Boolean(
    await page
      .waitForSelector('text=Enter a 10-digit Indian mobile number', { timeout: 15000 })
      .catch(() => null),
  ),
);

// Put the valid number back so the public check below has something to find.
await page.fill('input[name="phonePrimary"]', '98765 43210');
await page.click('button[type="submit"]:has-text("Save settings")');
await page.waitForSelector('text=Settings saved.', { timeout: 15000 }).catch(() => null);

// --- a settings save must reach the public site, not just the database ---
const publicHtml = async () => {
  const res = await fetch(`${BASE}/`, { cache: 'no-store' });
  const html = await res.text();
  return html.replace(/<script[\s\S]*?<\/script>/g, '');
};
const waitForPublic = async (predicate, timeoutMs = 15000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate(await publicHtml())) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
};
step(
  'saved phone number reaches the public site',
  await waitForPublic((h) => h.includes('tel:+919876543210')),
);

// --- announcement bar is admin-managed ---
await page.goto(`${BASE}/admin/announcements`, { waitUntil: 'domcontentloaded' });
step('announcements page renders', await page.locator('h1:has-text("Announcements")').isVisible());
const liveCard = page.locator('li:has(span:text-is("Live"))').first();
await liveCard.locator('input[name="isActive"]').uncheck();
await liveCard.locator('button:has-text("Save")').click();
await page.waitForSelector('text=Announcement saved.', { timeout: 15000 });
step(
  'hiding the announcement removes the bar',
  await waitForPublic((h) => !h.includes('Now booking for Lagan Season')),
);
const hiddenCard = page.locator('li:has(span:text-is("Hidden"))').first();
await hiddenCard.locator('input[name="isActive"]').check();
await hiddenCard.locator('button:has-text("Save")').click();
await page.waitForSelector('text=Announcement saved.', { timeout: 15000 });
step(
  'showing it again brings the bar back',
  await waitForPublic((h) => h.includes('Now booking for Lagan Season')),
);

await page.goto(`${BASE}/admin/media`, { waitUntil: 'domcontentloaded' });
step('media page renders', await page.locator('h1:has-text("Media")').isVisible());

// --- put the invented business facts back to whatever they were ---
await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
for (const field of SETTINGS_FIELDS) {
  await page.fill(`input[name="${field}"]`, before[field]);
}
await page.fill('textarea[name="enquiryToEmails"]', before.enquiryToEmails);
await page.click('button[type="submit"]:has-text("Save settings")');
await page.waitForSelector('[data-sonner-toast]', { timeout: 15000 }).catch(() => null);
await page.reload({ waitUntil: 'networkidle' });
step(
  'the suite leaves no invented business facts behind',
  (await page.locator('input[name="eventsCompleted"]').inputValue()) === before.eventsCompleted &&
    (await page.locator('input[name="ownerName"]').inputValue()) === before.ownerName,
);

await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded' });
await Promise.all([
  page.waitForURL((u) => u.pathname.includes('/admin/login'), { timeout: 20000 }),
  page.click('button:has-text("Sign out")'),
]);
step('sign out returns to login', page.url().includes('/admin/login'));

console.log(
  errors.length
    ? `\n  browser errors:\n   ${errors.join('\n   ')}`
    : '\n  no browser console errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
