import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { getRedirects, matchRedirect } from '@/lib/redirects';
import { resolveLocale } from '@/lib/locale';
import { localizedPath } from '@/lib/seo';

/**
 * Catch-all for paths that match no real route. Next prefers specific routes,
 * so this only runs for URLs that would otherwise 404 — which is exactly where
 * a redirect rule needs to fire.
 *
 * It lives here rather than in the middleware because the rules are in the
 * database and Prisma cannot run on the edge. The cost is that the redirect
 * happens after the route match instead of before it; the benefit is that the
 * client can add one without a deploy.
 */
export const dynamic = 'force-dynamic';

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const locale = await resolveLocale(params);
  const { rest } = await params;

  const path = `/${rest.join('/')}`;
  const rule = matchRedirect(await getRedirects(), path);

  if (rule) {
    const target = rule.destination.startsWith('/')
      ? localizedPath(locale, rule.destination)
      : rule.destination;
    if (rule.permanent) permanentRedirect(target);
    redirect(target);
  }

  notFound();
}
