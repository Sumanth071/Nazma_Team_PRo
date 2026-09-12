import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({ success: false, message: 'Access denied. Role not identified.' });
      return;
    }

    if (!roles.includes(req.user.role.name)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Action requires one of [${roles.join(', ')}] roles.`,
      });
      return;
    }

    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({ success: false, message: 'Access denied. Role not identified.' });
      return;
    }

    const userPermissions = req.user.role.permissions || [];
    const hasWildcard = userPermissions.some((p) => p === '*' || p.endsWith(':*') && permission.startsWith(p.split(':')[0]));
    const hasDirect = userPermissions.includes(permission);

    if (!hasWildcard && !hasDirect) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Missing required permission '${permission}'.`,
      });
      return;
    }

    next();
  };
};
