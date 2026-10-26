import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';
import { fontVariables } from '@/lib/fonts';

/**
 * The admin panel sits outside the [locale] tree: it is English-only and must
 * never be indexed. It brings its own <html> because the root layout is a
 * pass-through. `theme-light` flips the shadcn tokens to the ivory palette —
 * long data-entry sessions are easier to read on light.
 */
export const metadata: Metadata = {
  title: { default: 'Admin · Shree Shakti', template: '%s · Shree Shakti Admin' },
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FBF6EE',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="theme-light min-h-svh antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
