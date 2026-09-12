import { Router } from 'express';
import {
  getRoles,
  createRole,
  updateRolePermissions,
  deleteRole,
} from '../controllers/roleController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole('Admin'));

router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id/permissions', updateRolePermissions);
router.delete('/:id', deleteRole);

export default router;
