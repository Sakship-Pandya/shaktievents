import Link from 'next/link';
import { fontVariables } from '@/lib/fonts';

/**
 * Fallback for paths outside the locale tree (the middleware matcher skips
 * /api, /admin and files). The locale-aware 404 lives at
 * app/(site)/[locale]/not-found.tsx. This one carries its own <html> because
 * the root layout is a pass-through.
 */
export default function RootNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="grid min-h-svh place-items-center bg-ink px-6 text-center text-ivory antialiased">
        <div>
          <p className="eyebrow text-gold">404</p>
          <h1 className="mt-4 font-display text-display-md font-medium">Page not found</h1>
          <Link
            href="/"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-marigold px-6 text-[0.9rem] font-semibold text-ink transition-colors hover:bg-marigold-300"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
