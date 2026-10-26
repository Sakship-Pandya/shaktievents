import { after } from 'next/server';
import { db } from '@/lib/db';
import type { Prisma } from '@/lib/generated/prisma/client';

export type AuditParams = {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Prisma.InputJsonObject;
};

/**
 * Records an audit log entry in the background using Next.js 15 `after()`.
 * This removes the ~250ms remote database round-trip from the critical path of
 * admin button clicks and form submissions while ensuring the entry is still
 * reliably persisted.
 */
export function recordAudit(params: AuditParams): void {
  const write = async () => {
    try {
      await db.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          meta: params.meta ?? undefined,
        },
      });
    } catch (error) {
      console.error('[audit] Failed to record audit log:', error);
    }
  };

  try {
    after(write);
  } catch {
    // If called outside a request context (e.g. scripts or test runners),
    // fire unawaited without crashing.
    void write();
  }
}
