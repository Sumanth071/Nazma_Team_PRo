import { Router } from 'express';
import {
  getDatasets,
  getDatasetById,
  createDataset,
  updateDataset,
  deleteDataset,
} from '../controllers/datasetController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getDatasets);
router.get('/:id', getDatasetById);
router.post('/', requireRole('Admin'), createDataset);
router.put('/:id', requireRole('Admin'), updateDataset);
router.delete('/:id', requireRole('Admin'), deleteDataset);

export default router;
