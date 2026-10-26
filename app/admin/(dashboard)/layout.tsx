import type { ReactNode } from 'react';
import { Logo } from '@/components/brand/logo';
import { MobileSidebar } from '@/components/admin/mobile-sidebar';
import { SidebarNav } from '@/components/admin/sidebar-nav';
import { UserMenu } from '@/components/admin/user-menu';
import { requireUser } from '@/lib/auth-helpers';

/**
 * The signed-in shell. The middleware already redirects anonymous requests;
 * requireUser() is the server-side backstop, and every server action repeats
 * the check because actions are reachable without a page navigation.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-[16.5rem] shrink-0 flex-col border-r border-border bg-ivory lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5 text-maroon">
          <Logo name="Shree Shakti" tagline="Admin panel" className="[&_span]:text-ink" compact />
        </div>
        <SidebarNav role={user.role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-ivory/90 px-5 backdrop-blur-md">
          <MobileSidebar role={user.role} />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-maroon max-sm:hidden"
          >
            View site ↗
          </a>
          <div className="ml-auto">
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 px-5 py-7 lg:px-8 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
