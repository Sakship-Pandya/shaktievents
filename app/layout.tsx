import type { ReactNode } from 'react';
import './globals.css';

/**
 * <html> and <body> live in app/(site)/[locale]/layout.tsx, because the lang
 * attribute drives the Gujarati font swap (html:lang(gu) in globals.css).
 * This root layout only forwards children, so /admin can bring its own shell
 * in step 2 without inheriting the public chrome.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
