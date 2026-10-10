import { Router } from 'express';
import {
  getDashboardStats,
  getPredictionAnalytics,
  getUserAnalytics,
  getModelPerformanceAnalytics,
} from '../controllers/analyticsController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/dashboard', getDashboardStats);
router.get('/predictions', getPredictionAnalytics);
router.get('/users', getUserAnalytics);
router.get('/performance', getModelPerformanceAnalytics);

export default router;
