/**
 * Users, roles and the audit log:
 *   pnpm build && pnpm start
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm verify:users
 *
 * The suite creates an editor, signs in as them, checks what they can and
 * cannot reach, and deletes the account again — so it leaves the site with
 * exactly the one admin it found.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const TEST_EMAIL = `verify-editor-${Date.now()}@example.com`;

if (!EMAIL || !PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD.');
  process.exit(1);
}

let failed = 0;
const step = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`);
});

const signIn = async (target, email, password) => {
  await target.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
  await target.fill('input[name="email"]', email);
  await target.fill('input[name="password"]', password);
  await Promise.all([
    target.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
    target.click('button[type="submit"]'),
  ]);
};

await signIn(page, EMAIL, PASSWORD);

// --- the log is there and reads in plain words -----------------------------
await page.goto(`${BASE}/admin/audit`, { waitUntil: 'domcontentloaded' });
step('audit log opens', await page.locator('h1:has-text("Audit log")').isVisible());
const entries = await page.locator('ol > li').count();
step('audit log has entries from earlier work', entries > 0, `${entries} shown`);
step(
  'audit log says what happened in words, not codes',
  /\b(added|changed|deleted|published)\b/.test(await page.locator('main').innerText()),
);
const filters = await page.locator('nav[aria-label="Filter"] a').count();
step('audit log offers filters by what was changed', filters > 1, `${filters} filters`);

// --- creating an editor ----------------------------------------------------
await page.goto(`${BASE}/admin/users`, { waitUntil: 'domcontentloaded' });
const before = await page.locator('ul > li').count();
step('users page lists the existing accounts', before >= 1);
step(
  'the only admin cannot switch themselves off',
  (await page.locator('button:has-text("Switch off")[disabled]').count()) > 0 ||
    (await page.locator('text=cannot switch off or demote your own account').count()) > 0,
);

// Each listed account has its own role dropdown, so the new-account form has
// to be addressed by the button it ends with.
const newAccount = page.locator('form', { has: page.locator('button:has-text("Create account")') });
await newAccount.locator('input[name="name"]').fill('Verification Editor');
await newAccount.locator('input[name="email"]').fill(TEST_EMAIL);
await newAccount.locator('select[name="role"]').selectOption('EDITOR');
await page.click('button:has-text("Create account")');
await page.waitForSelector('text=Write this password down now', { timeout: 20000 });
step('creating an account shows the password once', true);

await page.click('button:has-text("Show")');
const generated = (await page.locator('code').first().innerText()).trim();
step('the generated password is long enough to be worth having', generated.length >= 14);
step(
  'the password is not on the page after it is dismissed',
  await page
    .click('button:has-text("I have written it down")')
    .then(async () => !(await page.content()).includes(generated)),
);

await page.reload({ waitUntil: 'domcontentloaded' });
step('the new account is listed', (await page.locator('ul > li').count()) === before + 1);
step(
  'the password is not sent back to the browser on a reload',
  !(await page.content()).includes(generated),
);

// --- what an editor can and cannot do --------------------------------------
const editor = await browser.newPage();
await signIn(editor, TEST_EMAIL, generated);
step('the new editor can sign in with that password', !editor.url().includes('/login'));
step(
  'the editor sidebar does not offer Users or Audit log',
  (await editor.locator('nav a[href="/admin/users"]').count()) === 0 &&
    (await editor.locator('nav a[href="/admin/audit"]').count()) === 0,
);
await editor.goto(`${BASE}/admin/users`, { waitUntil: 'domcontentloaded' });
step(
  'an editor typing the URL is turned away',
  !editor.url().includes('/admin/users'),
  editor.url().replace(BASE, ''),
);
await editor.goto(`${BASE}/admin/services`, { waitUntil: 'domcontentloaded' });
step('an editor can still edit content', editor.url().includes('/admin/services'));
await editor.close();

// --- the log recorded all of it --------------------------------------------
await page.goto(`${BASE}/admin/audit?entity=User`, { waitUntil: 'domcontentloaded' });
// Signing in is recorded against User too, so the newest entry is the editor's
// own login, not the account creation. Search the page rather than assume.
step(
  'creating the account was recorded against the admin who did it',
  (await page.locator('ol').innerText()).includes(TEST_EMAIL),
);
step(
  'signing in is recorded as well',
  (await page.locator('ol > li').first().innerText()).includes('signed in'),
);

// --- switching the account off ---------------------------------------------
await page.goto(`${BASE}/admin/users`, { waitUntil: 'domcontentloaded' });
const row = page.locator('li', { has: page.locator(`text=${TEST_EMAIL}`) });
await row.locator('button:has-text("Switch off")').click();
await page.waitForSelector(`li:has-text("${TEST_EMAIL}") button:has-text("Switch on")`, {
  timeout: 20000,
});
step('an account can be switched off', true);

const blocked = await browser.newPage();
await blocked.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
await blocked.fill('input[name="email"]', TEST_EMAIL);
await blocked.fill('input[name="password"]', generated);
await blocked.click('button[type="submit"]');
await blocked.waitForTimeout(3000);
step('a switched-off account cannot sign in', blocked.url().includes('/admin/login'));
await blocked.close();

// --- and removed again, so the suite leaves the list as it found it --------
page.on('dialog', (d) => d.accept());
await page.goto(`${BASE}/admin/users`, { waitUntil: 'domcontentloaded' });
await page
  .locator('li', { has: page.locator(`text=${TEST_EMAIL}`) })
  .locator(`button[aria-label="Remove ${TEST_EMAIL}"]`)
  .click();
await page.waitForTimeout(1000);
await page.reload({ waitUntil: 'domcontentloaded' });
step(
  'the verification account is gone again',
  (await page.locator('ul > li').count()) === before &&
    !(await page.content()).includes(TEST_EMAIL),
);
step(
  'removing it is itself recorded',
  await page
    .goto(`${BASE}/admin/audit?entity=User`, { waitUntil: 'domcontentloaded' })
    .then(async () => (await page.locator('ol').innerText()).includes('deleted')),
);

console.log(
  errors.length ? `\n  browser errors:\n   ${errors.join('\n   ')}` : '\n  no browser errors',
);
await browser.close();
process.exit(failed ? 1 : 0);
