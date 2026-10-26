import { expect, test } from '@playwright/test';
import { PUBLIC_ROUTES } from './routes';

/**
 * What is still waiting on the client.
 *
 * By design this site never invents a business fact: anything unknown renders
 * a visible [TBD] rather than a guess. That is correct before launch and wrong
 * after it, so these checks report rather than fail — until SMOKE_STRICT=1,
 * which is what the launch checklist tells you to run on the live site.
 */
const strict = process.env.SMOKE_STRICT === '1';

test('outstanding [TBD] markers', async ({ page }) => {
  const outstanding: string[] = [];

  for (const path of PUBLIC_ROUTES) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const count = await page.locator('main, footer').getByText('[TBD]').count();
    if (count > 0) outstanding.push(`${path} (${count})`);
  }

  if (outstanding.length > 0) {
    console.log(`\n  Still waiting on the client:\n   ${outstanding.join('\n   ')}\n`);
  }

  if (strict) expect(outstanding, 'pages still showing [TBD]').toEqual([]);
  else expect(outstanding.length).toBeGreaterThanOrEqual(0);
});

test('the phone number and WhatsApp are configured', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  const tel = await page.locator('a[href^="tel:"]').count();
  const whatsapp = await page.locator('a[href^="https://wa.me/"]').count();

  if (tel === 0 || whatsapp === 0) {
    console.log('\n  No phone or WhatsApp number set — buttons fall back to /contact.\n');
  }
  if (strict) {
    expect(tel, 'a tel: link').toBeGreaterThan(0);
    expect(whatsapp, 'a wa.me link').toBeGreaterThan(0);
  }
});

test('the portfolio has real work on it', async ({ page }) => {
  await page.goto('/portfolio', { waitUntil: 'domcontentloaded' });
  const cards = await page.locator('main a[href*="/portfolio/"]').count();
  if (cards === 0) console.log('\n  No published projects yet.\n');
  if (strict) expect(cards, 'published projects').toBeGreaterThan(0);
});

test('no placeholder image reaches a launched site', async ({ page }) => {
  await page.goto('/portfolio', { waitUntil: 'domcontentloaded' });
  const placeholders = await page.getByText('placeholder', { exact: false }).count();
  if (placeholders > 0) console.log(`\n  ${placeholders} placeholder notices on /portfolio.\n`);
  if (strict) expect(placeholders, 'placeholder images').toBe(0);
});
