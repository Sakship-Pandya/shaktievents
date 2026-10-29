'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { toggleProjectStatus } from './actions';

const STATUS_STYLE: Record<string, string> = {
  PUBLISHED: 'bg-success/15 text-success',
  DRAFT: 'border border-border text-muted-foreground',
  ARCHIVED: 'border border-border text-muted-foreground line-through',
};

export function ProjectStatusToggle({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggle = async () => {
    if (isSyncing) return;
    const prevStatus = status;
    const isCurrentlyVisible = status === 'PUBLISHED';
    const nextStatus: 'PUBLISHED' | 'DRAFT' = isCurrentlyVisible ? 'DRAFT' : 'PUBLISHED';

    // 1. Instant 0ms optimistic switch: user sees badge and icon change immediately
    setStatus(nextStatus);
    setIsSyncing(true);

    try {
      // 2. High-speed direct REST API request (~100ms) with background cache revalidation
      const res = await fetch('/api/admin/projects/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });

      if (!res.ok) {
        // Fallback to server action if route isn't reachable
        const fallback = await toggleProjectStatus(id, nextStatus);
        if (!fallback?.ok) throw new Error('Update failed');
      }
    } catch {
      // Rollback on genuine network failure
      setStatus(prevStatus);
      toast.error('Failed to change project visibility. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const isVisible = status === 'PUBLISHED';

  return (
    <div className="flex items-center gap-2">
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide transition-all ${
          STATUS_STYLE[status] ?? ''
        } ${isSyncing ? 'opacity-80' : ''}`}
      >
        {isVisible ? 'Visible' : 'Not Visible'}
      </span>

      <button
        type="button"
        onClick={handleToggle}
        disabled={isSyncing}
        title={isVisible ? 'Make Not Visible' : 'Make Visible'}
        aria-label={isVisible ? 'Make Not Visible' : 'Make Visible'}
        className={`relative grid size-8 place-items-center rounded-lg border transition-all cursor-pointer ${
          isVisible
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
            : 'border-border text-muted-foreground hover:bg-sand hover:text-ink'
        } ${isSyncing ? 'opacity-75 cursor-wait' : ''}`}
      >
        {isVisible ? (
          <Eye className="size-4 text-emerald-600" />
        ) : (
          <EyeOff className="size-4 text-muted-foreground" />
        )}
        {isSyncing && (
          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-maroon animate-pulse" />
        )}
      </button>
    </div>
  );
}
