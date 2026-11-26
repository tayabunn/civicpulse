import { Request } from 'express';
import { db } from '../db';
import { auditLogs } from '../db/schema';
import { AuthenticatedRequest } from '../middleware/auth';

export interface AuditLogParams {
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: string | Record<string, any>;
  status?: 'SUCCESS' | 'DENIED' | 'FAILED';
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
}

export async function logSecurityAudit(req: Request, params: AuditLogParams) {
  try {
    const authReq = req as AuthenticatedRequest;
    const actorId = params.actorId || authReq.user?.id || null;
    const actorEmail = params.actorEmail || authReq.user?.email || null;
    const actorRole = params.actorRole || authReq.user?.role || 'anonymous';

    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress =
      typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : req.ip || req.socket.remoteAddress || '127.0.0.1';

    const userAgent = req.headers['user-agent'] || 'Unknown Agent';

    const detailsStr =
      typeof params.details === 'object'
        ? JSON.stringify(params.details)
        : params.details || null;

    await db.insert(auditLogs).values({
      actorId: actorId ? actorId : undefined,
      actorEmail: actorEmail,
      actorRole: actorRole,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId || null,
      details: detailsStr,
      ipAddress,
      userAgent: userAgent.slice(0, 500),
      status: params.status || 'SUCCESS',
    });

    console.info(
      `🛡️ [SECURITY AUDIT] ${params.status || 'SUCCESS'} | ${actorRole} (${actorEmail || 'anon'}) -> ${params.action} on ${params.resource}${params.resourceId ? `:${params.resourceId}` : ''}`
    );
  } catch (err) {
    // Audit log insertion should be non-blocking
    console.warn(`[SECURITY AUDIT LOG FAILED]`, err);
  }
}
