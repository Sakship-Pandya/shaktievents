/**
 * Public information architecture. `key` maps to a `Nav.*` message key so the
 * labels stay translatable; `menu` names the dropdown panel the header should
 * render underneath the item.
 */
export type NavMenuId = 'services' | 'events';

export type NavItem = {
  key: 'services' | 'portfolio' | 'events' | 'about' | 'blog';
  href: string;
  menu?: NavMenuId;
};

export const primaryNav: NavItem[] = [
  { key: 'services', href: '/services', menu: 'services' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'events', href: '/events', menu: 'events' },
  { key: 'about', href: '/about' },
];

/** Secondary links, shown in the mobile sheet and the footer only. */
export const secondaryNav: NavItem[] = [{ key: 'blog', href: '/blog' }];
