import { Router } from 'express';
import {
  getModels,
  getModelById,
  createModel,
  activateModel,
  updateModelStatus,
  deleteModel,
} from '../controllers/modelController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getModels);
router.get('/:id', getModelById);
router.post('/', requireRole('Admin'), createModel);
router.post('/:id/activate', requireRole('Admin'), activateModel);
router.put('/:id/status', requireRole('Admin'), updateModelStatus);
router.delete('/:id', requireRole('Admin'), deleteModel);

export default router;
