import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests: the checks that must pass on any deployment of this site.
 *
 * They are read-only and need no admin credentials, so they can be pointed at
 * production after a deploy as well as at a local build:
 *
 *   pnpm build && pnpm start
 *   pnpm smoke
 *   SMOKE_URL=https://shreeshaktimandap.com pnpm smoke
 *
 * The deeper functional suites live in e2e/verify-*.mjs — those sign in, write
 * to the database and put back what they changed, so they belong on a local
 * build, not on the live site.
 */
const baseURL = process.env.SMOKE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e/smoke',
  // Renders every page once before the workers start; see warmup.ts.
  globalSetup: './e2e/smoke/warmup.ts',
  // Nothing here writes, so parallel is safe. Serial on CI keeps the output
  // readable when something fails.
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    // Most visitors here are on a phone.
    ...devices['Pixel 7'],
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
