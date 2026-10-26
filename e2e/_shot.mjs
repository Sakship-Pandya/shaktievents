import { chromium } from 'playwright';
const OUT = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });

await page.goto('http://localhost:3000/privacy-policy', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${OUT}/legal-en.png`, fullPage: false });
await page.goto('http://localhost:3000/gu/terms', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${OUT}/legal-gu.png`, fullPage: false });

await page.goto('http://localhost:3000/admin/login', { waitUntil: 'domcontentloaded' });
await page.fill('input[name="email"]', process.env.ADMIN_EMAIL);
await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 }),
  page.click('button[type="submit"]'),
]);
await page.goto('http://localhost:3000/admin/help', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${OUT}/help-en.png` });
await page.click('button:has-text("ગુજરાતી")');
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/help-gu.png` });
await browser.close();
console.log('ok');
