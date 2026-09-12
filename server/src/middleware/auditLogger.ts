import { AuditLog } from '../models/AuditLog';

interface LogOptions {
  userId?: any;
  userName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ip?: string;
  status?: 'SUCCESS' | 'FAILURE' | 'WARNING';
}

export const logAudit = async (options: LogOptions): Promise<void> => {
  try {
    await AuditLog.create({
      userId: options.userId,
      userName: options.userName || 'System',
      action: options.action,
      resource: options.resource,
      resourceId: options.resourceId,
      metadata: options.metadata,
      ip: options.ip || '127.0.0.1',
      status: options.status || 'SUCCESS',
    });
  } catch (err) {
    console.error('[AuditLogger] Failed to write audit log:', err);
  }
};
