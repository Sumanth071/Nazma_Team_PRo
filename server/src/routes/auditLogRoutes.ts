import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('Admin'));

router.get('/', getAuditLogs);

export default router;
