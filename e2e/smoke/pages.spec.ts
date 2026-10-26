import { expect, test } from '@playwright/test';
import { BILINGUAL_ROUTES, FILES, gu, PUBLIC_ROUTES } from './routes';

/**
 * Every page a visitor or a crawler can reach has to load, in both languages,
 * with one h1 and without a console error. If this file goes red, the site is
 * broken in a way somebody will notice within the hour.
 */

for (const path of PUBLIC_ROUTES) {
  test(`${path} loads`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), `${path} status`).toBe(200);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();
    expect(errors, `${path} console`).toEqual([]);
  });
}

for (const path of BILINGUAL_ROUTES) {
  test(`${gu(path)} loads in Gujarati`, async ({ page }) => {
    const response = await page.goto(gu(path), { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'gu');
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('an unknown path returns a 404 page, not a crash', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist', {
    waitUntil: 'domcontentloaded',
  });
  expect(response?.status()).toBe(404);
});

test('the admin is behind a login', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  expect(new URL(page.url()).pathname).toContain('/admin/login');
});

for (const file of FILES) {
  test(`${file} is served`, async ({ request }) => {
    const response = await request.get(file);
    expect(response.status()).toBe(200);
    expect((await response.text()).length).toBeGreaterThan(50);
  });
}

test('the sitemap lists both languages and no draft pages', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('<urlset');
  expect(xml).toContain('/gu/');
  // A sitemap that advertises the admin is a sitemap that leaks the admin.
  expect(xml).not.toContain('/admin');
  expect(xml).not.toContain('/api/');
});

test('robots.txt points at the sitemap and keeps crawlers out of the admin', async ({
  request,
}) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toMatch(/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/);
  expect(txt).toContain('/admin');
});
