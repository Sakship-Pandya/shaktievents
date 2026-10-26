/**
 * Which public routes actually exist yet.
 *
 * Next prefetches every <Link> that enters the viewport, so a footer full of
 * links to unbuilt routes fires dozens of failing requests on every page load —
 * wasted data on a 4G connection and a console full of 404s. Links to routes
 * listed here prefetch normally; everything else renders without it until its
 * page ships.
 *
 * Add a route here in the same commit that builds it.
 */
const BUILT_EXACT = new Set([
  '/',
  '/about',
  '/blog',
  '/contact',
  '/events',
  '/faq',
  '/get-quote',
  '/portfolio',
  '/privacy-policy',
  '/services',
  '/terms',
  '/testimonials',
  '/videos',
]);

const BUILT_PREFIXES = ['/services/', '/portfolio/', '/events/', '/blog/'];

export function isBuiltRoute(href: string): boolean {
  const path = (href.split('?')[0] ?? href).split('#')[0] ?? href;
  if (BUILT_EXACT.has(path)) return true;
  return BUILT_PREFIXES.some((prefix) => path.startsWith(prefix));
}
