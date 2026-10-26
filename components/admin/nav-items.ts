import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  Folders,
  Gauge,
  Image,
  Inbox,
  LayoutTemplate,
  Megaphone,
  MessageSquareQuote,
  PlaySquare,
  ScrollText,
  Search,
  Settings,
  Sparkles,
  ToggleRight,
  Users,
  Wrench,
} from 'lucide-react';

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Build-order step that ships this module. Undefined means it is live. */
  comingInStep?: number;
  /** Hidden from editors: these change who can sign in, not what the site says. */
  adminOnly?: boolean;
};

export type AdminNavGroup = { label: string; items: AdminNavItem[] };

/**
 * Every module in the admin. `comingInStep` renders an entry disabled with its
 * step number rather than hiding it, so the client can see the shape of what is
 * coming and nobody clicks through to a 404 — but nothing is listed that is not
 * actually going to arrive. Two modules from the original spec are not built:
 * see docs/content-review.md for what they were and what they would take.
 */
export const adminNav: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: Gauge },
      { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
      { label: 'Projects', href: '/admin/projects', icon: Folders },
      { label: 'Media', href: '/admin/media', icon: Image },
      { label: 'Services', href: '/admin/services', icon: Wrench },
      { label: 'Event types', href: '/admin/event-types', icon: Sparkles },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'Trusted by', href: '/admin/clients', icon: Building2 },
      { label: 'Blog', href: '/admin/blog', icon: FileText },
      { label: 'Videos', href: '/admin/videos', icon: PlaySquare },
      { label: 'FAQs', href: '/admin/faqs', icon: ScrollText },
    ],
  },
  {
    label: 'Site',
    items: [
      { label: 'Pages & sections', href: '/admin/sections', icon: LayoutTemplate },
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { label: 'SEO', href: '/admin/seo', icon: Search },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Extra features', href: '/admin/settings/features', icon: ToggleRight },
      { label: 'Users & roles', href: '/admin/users', icon: Users, adminOnly: true },
      { label: 'Audit log', href: '/admin/audit', icon: ScrollText, adminOnly: true },
      { label: 'Guide', href: '/admin/help', icon: BookOpen },
    ],
  },
];
