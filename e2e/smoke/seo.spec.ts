import { expect, test } from '@playwright/test';
import { BILINGUAL_ROUTES, gu } from './routes';

/**
 * The tags that decide whether this site ranks. A wrong canonical or a missing
 * hreflang does not break anything a visitor sees, which is exactly why it
 * needs a test — nobody would notice for months.
 */

const head = async (page: import('@playwright/test').Page, selector: string) =>
  page.locator(selector).first().getAttribute('href');

for (const path of BILINGUAL_ROUTES) {
  test(`${path} declares its canonical and both alternates`, async ({ page, baseURL }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    const canonical = await head(page, 'link[rel="canonical"]');
    expect(canonical, 'canonical is absolute').toMatch(/^https?:\/\//);
    expect(new URL(canonical!).pathname).toBe(path);

    const en = await head(page, 'link[rel="alternate"][hreflang="en-IN"]');
    const guAlt = await head(page, 'link[rel="alternate"][hreflang="gu-IN"]');
    const xDefault = await head(page, 'link[rel="alternate"][hreflang="x-default"]');

    expect(new URL(en!).pathname).toBe(path);
    expect(new URL(guAlt!).pathname).toBe(gu(path));
    // x-default points at the English page: it is the one a stranger should get.
    expect(xDefault).toBe(en);

    // Every alternate has to be on the deployment's own origin, or the pair of
    // pages is telling Google they belong to a different site.
    if (baseURL) {
      const origin = new URL(baseURL).origin;
      for (const href of [canonical, en, guAlt]) {
        expect(new URL(href!).origin).toBe(origin);
      }
    }
  });
}

test('the Gujarati page canonicalises to itself, not to English', async ({ page }) => {
  await page.goto('/gu/services', { waitUntil: 'domcontentloaded' });
  const canonical = await head(page, 'link[rel="canonical"]');
  expect(new URL(canonical!).pathname).toBe('/gu/services');
});

for (const [path, types] of [
  ['/', ['LocalBusiness']],
  ['/services/wedding-mandap-decoration-surendranagar', ['Service', 'BreadcrumbList']],
  ['/faq', ['FAQPage']],
  ['/blog/wedding-mandap-cost-surendranagar-2026', ['Article', 'BreadcrumbList']],
  ['/areas/limbdi', ['BreadcrumbList']],
] as const) {
  test(`${path} emits ${types.join(' + ')} structured data`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);

    const parsed = blocks.map((block) => JSON.parse(block));
    const present = parsed.flatMap((node) =>
      Array.isArray(node['@graph'])
        ? node['@graph'].map((n: { '@type': string }) => n['@type'])
        : [node['@type']],
    );
    for (const type of types) expect(present).toContain(type);
  });
}

test('no page invents an aggregateRating', async ({ page }) => {
  for (const path of ['/', '/testimonials', '/services', '/packages']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.join(''), `${path} must not claim reviews it does not have`).not.toContain(
      'aggregateRating',
    );
  }
});

test('every page has a title and a description', async ({ page }) => {
  for (const path of ['/', '/services', '/portfolio', '/get-quote', '/gu']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/.{15,}/);
    const description = await page
      .locator('meta[name="description"]')
      .first()
      .getAttribute('content');
    expect(description?.length ?? 0, `${path} description`).toBeGreaterThan(50);
  }
});

test('the Open Graph image resolves', async ({ page, request }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const image = await page.locator('meta[property="og:image"]').first().getAttribute('content');
  expect(image).toBeTruthy();
  const response = await request.get(image!);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image');
});
