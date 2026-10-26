import NextAuth from 'next-auth';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { authConfig } from './auth.config';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

const LOGIN_PATH = '/admin/login';

/**
 * Two jobs in one pass: gate /admin behind a session, and run next-intl's
 * locale negotiation for everything else. The admin panel is deliberately
 * outside the [locale] tree — it is English-only and must not be indexed.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const isLoginPage = pathname === LOGIN_PATH;
    const isLoggedIn = Boolean(req.auth);

    if (!isLoggedIn && !isLoginPage) {
      const url = new URL(LOGIN_PATH, req.nextUrl.origin);
      url.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }

    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  return handleI18n(req);
});

export const config = {
  // Everything except API routes, Next internals and static files.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
