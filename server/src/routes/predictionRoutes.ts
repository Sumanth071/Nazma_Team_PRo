import { Router } from 'express';
import {
  createPrediction,
  getPredictions,
  getPredictionById,
  updateReview,
  deletePrediction,
} from '../controllers/predictionController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { requirePermission, requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', upload.single('image'), createPrediction);
router.get('/', getPredictions);
router.get('/:id', getPredictionById);
router.patch('/:id/review', updateReview);
router.delete('/:id', requireRole('Admin'), deletePrediction);

export default router;
