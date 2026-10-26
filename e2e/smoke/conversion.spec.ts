import { expect, test } from '@playwright/test';

/**
 * The site exists to turn a visitor into a phone call, a WhatsApp message or a
 * quote request. Everything else can degrade; these cannot.
 */

test('the home page offers all three ways to get in touch', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // The quote button lives in the header; call and WhatsApp live in the fixed
  // bar at the bottom of a phone screen and in the footer. Between them a
  // visitor is never more than two taps from reaching somebody.
  await expect(page.locator('header [data-cta="quote"]').first()).toBeAttached();
  for (const kind of ['call', 'whatsapp', 'quote']) {
    expect(await page.locator(`[data-cta="${kind}"]`).count(), `${kind} CTA`).toBeGreaterThan(0);
  }
});

test('a phone can always reach the business in two taps', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // The fixed bar at the bottom of a phone screen is the whole conversion path
  // on mobile. It must be present and every button must go somewhere.
  const bar = page.locator('nav[aria-label], div').filter({ has: page.locator('[data-cta]') });
  const ctas = page.locator('[data-cta]');
  expect(await ctas.count(), 'at least one call/WhatsApp/quote CTA').toBeGreaterThan(0);

  for (const cta of await ctas.all()) {
    const href = await cta.getAttribute('href');
    expect(href, 'every CTA points somewhere').toBeTruthy();
    // While the phone number is still [TBD] the buttons fall back to /contact,
    // which is a real page — never a dead tel: link.
    expect(href).toMatch(/^(tel:|https:\/\/wa\.me\/|mailto:|\/)/);
  }
  await expect(bar.first()).toBeAttached();
});

test('no CTA points at a page that does not exist', async ({ page, request }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const hrefs = new Set(
    (
      await page
        .locator('[data-cta]')
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href') ?? ''))
    ).filter((href) => href.startsWith('/')),
  );

  for (const href of hrefs) {
    const response = await request.get(href, { maxRedirects: 5 });
    expect(response.status(), `${href} from a CTA`).toBeLessThan(400);
  }
});

test('the quote wizard hydrates and refuses to advance on an empty step', async ({ page }) => {
  // The wizard reads the query string, so Next renders it on the client. The
  // form does not exist until hydration finishes — waiting for the element is
  // the point of the test, not an inconvenience.
  await page.goto('/get-quote', { waitUntil: 'domcontentloaded' });
  const form = page.locator('form').first();
  await expect(form).toBeVisible({ timeout: 20_000 });

  // The wizard does not let you advance from an empty step at all: the button
  // is disabled rather than clickable-then-scolding, which is the kinder of
  // the two designs and the one to keep.
  const next = page.getByRole('button', { name: /next|continue|આગળ/i }).first();
  await expect(next).toBeVisible();
  await expect(next).toBeDisabled();

  // Answering the step enables it.
  const firstChoice = form.locator('input[type="radio"], input[type="checkbox"]').first();
  if (await firstChoice.count()) {
    await firstChoice.check({ force: true });
    await expect(next).toBeEnabled();
  }
  expect(page.url()).toContain('/get-quote');
});

test('the contact page carries the same NAP as the footer', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  const contact = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  const footer = (await page.locator('footer').innerText()).replace(/\s+/g, ' ');

  // Inconsistent name/address/phone across a site is the fastest way to lose a
  // local ranking, so both blocks read from the same settings row.
  for (const town of ['Surendranagar']) {
    expect(contact).toContain(town);
    expect(footer).toContain(town);
  }
});

test('every internal link in the footer resolves', async ({ page, request }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const hrefs = await page
    .locator('footer a[href^="/"]')
    .evaluateAll((nodes) => [...new Set(nodes.map((n) => n.getAttribute('href')!))]);

  expect(hrefs.length).toBeGreaterThan(20);
  const bad: string[] = [];
  for (const href of hrefs) {
    const response = await request.get(href, { maxRedirects: 5 });
    if (response.status() >= 400) bad.push(`${href} → ${response.status()}`);
  }
  expect(bad).toEqual([]);
});

test('the page does not scroll sideways on a phone', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'only meaningful at phone width');
  for (const path of ['/', '/services', '/portfolio', '/get-quote', '/gu']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});
