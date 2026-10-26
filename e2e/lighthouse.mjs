/**
 * Mobile Lighthouse run against a production build:
 *   pnpm build && pnpm start
 *   pnpm lighthouse
 *
 * Uses Playwright's bundled Chromium so it runs without a system Chrome.
 * Scores from localhost are optimistic on network but honest about the things
 * we control — bundle size, layout shift, accessibility and SEO.
 */
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const PAGES = process.env.PAGES?.split(',') ?? [
  '/',
  '/services/wedding-mandap-decoration-surendranagar',
  '/blog/german-hanger-vs-traditional-pandal',
  '/get-quote',
];

const THRESHOLD = 95;

let failed = 0;
const rows = [];

for (const path of PAGES) {
  // A fresh browser per page. Reusing one instance made every audit after the
  // first score several points lower — the same page scored 96 alone and 93
  // when run second, which is enough to send you chasing a regression that
  // does not exist.
  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });

  const result = await lighthouse(
    `${BASE}${path}`,
    { port: chrome.port, output: 'json', logLevel: 'error' },
    // The default preset is already mobile with 4G throttling.
    undefined,
  );

  const categories = result?.lhr?.categories ?? {};
  const score = (key) => Math.round((categories[key]?.score ?? 0) * 100);

  const row = {
    path,
    performance: score('performance'),
    accessibility: score('accessibility'),
    'best-practices': score('best-practices'),
    seo: score('seo'),
    lcp: result?.lhr?.audits?.['largest-contentful-paint']?.displayValue ?? '—',
    cls: result?.lhr?.audits?.['cumulative-layout-shift']?.displayValue ?? '—',
    tbt: result?.lhr?.audits?.['total-blocking-time']?.displayValue ?? '—',
  };
  rows.push(row);
  await chrome.kill();

  for (const key of ['performance', 'accessibility', 'best-practices', 'seo']) {
    if (row[key] < THRESHOLD) failed++;
  }
}

const pad = (v, n) => String(v).padEnd(n);
console.log(
  `\n  ${pad('page', 52)}${pad('perf', 6)}${pad('a11y', 6)}${pad('best', 6)}${pad('seo', 6)}${pad('LCP', 10)}${pad('CLS', 8)}TBT`,
);
for (const row of rows) {
  const mark = (v) => (v >= THRESHOLD ? String(v) : `${v}!`);
  console.log(
    `  ${pad(row.path.slice(0, 50), 52)}${pad(mark(row.performance), 6)}${pad(mark(row.accessibility), 6)}${pad(mark(row['best-practices']), 6)}${pad(mark(row.seo), 6)}${pad(row.lcp, 10)}${pad(row.cls, 8)}${row.tbt}`,
  );
}
console.log(
  failed === 0
    ? `\n  All categories at or above ${THRESHOLD}.`
    : `\n  ${failed} category scores below ${THRESHOLD} (marked !).`,
);

process.exit(failed ? 1 : 0);
