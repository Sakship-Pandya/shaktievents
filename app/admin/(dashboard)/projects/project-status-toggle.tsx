'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
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
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (isPending) return;
    const isCurrentlyVisible = status === 'PUBLISHED';
    const nextStatus: 'PUBLISHED' | 'DRAFT' = isCurrentlyVisible ? 'DRAFT' : 'PUBLISHED';

    // Optimistically update UI immediately (0ms response time)
    setStatus(nextStatus);

    startTransition(async () => {
      try {
        const res = await toggleProjectStatus(id, nextStatus);
        if (!res?.ok) {
          throw new Error('Failed to update project status');
        }
        toast.success(
          nextStatus === 'PUBLISHED'
            ? 'Project is now visible on the website.'
            : 'Project is now hidden from the website.',
        );
      } catch {
        // Rollback on failure
        setStatus(status);
        toast.error('Failed to change project visibility. Please try again.');
      }
    });
  };

  const isVisible = status === 'PUBLISHED';

  return (
    <div className="flex items-center gap-2">
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide transition-colors ${
          STATUS_STYLE[status] ?? ''
        }`}
      >
        {isVisible ? 'Visible' : 'Not Visible'}
      </span>

      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        title={isVisible ? 'Make Not Visible' : 'Make Visible'}
        aria-label={isVisible ? 'Make Not Visible' : 'Make Visible'}
        className="grid size-8 place-items-center rounded-lg border border-border text-ink transition-colors hover:bg-sand disabled:opacity-60 cursor-pointer"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
        ) : isVisible ? (
          <Eye className="size-4 text-emerald-600" />
        ) : (
          <EyeOff className="size-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
