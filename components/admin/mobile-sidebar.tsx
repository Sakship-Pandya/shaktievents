'use client';

import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { SidebarNav } from './sidebar-nav';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function MobileSidebar({ role }: { role: 'ADMIN' | 'EDITOR' }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="grid size-9 place-items-center rounded-lg border border-border text-ink lg:hidden"
      >
        <MenuIcon className="size-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[17rem] bg-ivory p-0 sm:max-w-none">
        <SheetTitle className="px-6 pt-5 pb-1 text-base">Shree Shakti Admin</SheetTitle>
        <SidebarNav role={role} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
