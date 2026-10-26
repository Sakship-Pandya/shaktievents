import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { isBuiltRoute } from '@/lib/routes';

type NavLinkProps = ComponentProps<typeof Link>;

/**
 * A locale-aware Link that does not prefetch routes which have not been built
 * yet. Use it anywhere the site links to its own information architecture
 * ahead of the pages existing — the nav, the footer, the area and event chips.
 */
export function NavLink({ href, ...props }: NavLinkProps) {
  const target = typeof href === 'string' ? href : String(href);
  return <Link href={href} prefetch={isBuiltRoute(target) ? undefined : false} {...props} />;
}
